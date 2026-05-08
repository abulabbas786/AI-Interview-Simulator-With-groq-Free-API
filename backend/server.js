const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Original Q&A endpoint
app.post("/api/ask", async (req, res) => {
  const { question, model } = req.body;

  if (!question || question.trim() === "") {
    return res.status(400).json({ error: "Question is required" });
  }

  const allowedModels = ["llama-3.1-8b-instant"];
  const selectedModel = allowedModels.includes(model) ? model : "llama-3.1-8b-instant";

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: question }],
      model: selectedModel,
    });

    const answer = chatCompletion.choices[0]?.message?.content || "No response";
    res.json({ answer });
  } catch (error) {
    console.error("Groq API error:", error.message);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

// Interview: Generate questions
app.post("/api/start-interview", async (req, res) => {
  const { role, difficulty, type, numberOfQuestions } = req.body;

  if (!role || !difficulty || !type || !numberOfQuestions) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const prompt = `You are an expert interviewer. Generate exactly ${numberOfQuestions} ${type} interview questions for a ${difficulty} level ${role} position.

Return ONLY a valid JSON array of strings. No markdown, no explanation, no code blocks. Example format:
["Question 1?", "Question 2?", "Question 3?"]

Make questions realistic, progressively challenging, and relevant to the role. Mix conceptual and practical questions.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
    });

    const content = chatCompletion.choices[0]?.message?.content || "[]";
    // Extract JSON array from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    if (questions.length === 0) {
      return res.status(500).json({ error: "Failed to generate questions" });
    }

    res.json({ questions });
  } catch (error) {
    console.error("Interview generation error:", error.message);
    res.status(500).json({ error: "Failed to generate interview questions" });
  }
});

// Interview: Evaluate answer
app.post("/api/evaluate-answer", async (req, res) => {
  const { question, answer, role, difficulty } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer are required" });
  }

  const prompt = `You are an expert interviewer evaluating a candidate for a ${difficulty} level ${role} position.

Question: "${question}"
Candidate's Answer: "${answer}"

Evaluate the answer and return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "score": <number 1-10>,
  "correctness": "<one sentence>",
  "clarity": "<one sentence>",
  "confidence": "<one sentence>",
  "improvement": "<one sentence suggestion>",
  "sampleAnswer": "<brief ideal answer in 2-3 sentences>"
}

Be fair but rigorous. Score realistically.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!evaluation) {
      return res.status(500).json({ error: "Failed to parse evaluation" });
    }

    res.json({ evaluation });
  } catch (error) {
    console.error("Evaluation error:", error.message);
    res.status(500).json({ error: "Failed to evaluate answer" });
  }
});

// Interview: Generate final report
app.post("/api/final-report", async (req, res) => {
  const { role, difficulty, type, evaluations } = req.body;

  if (!evaluations || evaluations.length === 0) {
    return res.status(400).json({ error: "No evaluations provided" });
  }

  const avgScore = evaluations.reduce((sum, e) => sum + (e.score || 0), 0) / evaluations.length;

  const prompt = `You are an expert career coach. A candidate just completed a ${type} interview for a ${difficulty} level ${role} position.

Their scores per question: ${evaluations.map((e, i) => `Q${i + 1}: ${e.score}/10`).join(", ")}
Average score: ${avgScore.toFixed(1)}/10

Based on this performance, return ONLY valid JSON (no markdown, no code blocks):
{
  "overallScore": ${avgScore.toFixed(1)},
  "performanceLabel": "<one of: Exceptional, Strong Performer, Good Potential, Needs Improvement, Needs More Practice>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "improvements": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "topicsToStudy": ["<topic 1>", "<topic 2>", "<topic 3>", "<topic 4>"],
  "badge": "<a fun badge title like 'Strong Communicator' or 'Technical Thinker' or 'Quick Learner'>"
}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.4,
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const report = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!report) {
      return res.status(500).json({ error: "Failed to generate report" });
    }

    res.json({ report });
  } catch (error) {
    console.error("Report error:", error.message);
    res.status(500).json({ error: "Failed to generate final report" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
