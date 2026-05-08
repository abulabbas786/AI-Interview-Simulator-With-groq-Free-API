import { useState } from "react";
import Header from "./components/Header";
import InterviewSetup from "./components/InterviewSetup";
import ProgressBar from "./components/ProgressBar";
import QuestionCard from "./components/QuestionCard";
import FeedbackPanel from "./components/FeedbackPanel";
import FinalReport from "./components/FinalReport";

const API_BASE = "backend-ahg6qip4k-abulabbas786s-projects.vercel.app/api";

function App() {
  // App state
  const [screen, setScreen] = useState("setup"); // setup | interview | report
  const [config, setConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [evaluations, setEvaluations] = useState([]);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Start interview
  const handleStart = async (interviewConfig) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/start-interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interviewConfig),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setConfig(interviewConfig);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setEvaluations([]);
      setCurrentFeedback(null);
      setScreen("interview");
    } catch (err) {
      setError(err.message || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  // Submit answer
  const handleSubmitAnswer = async (answer) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/evaluate-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[currentIndex],
          answer,
          role: config.role,
          difficulty: config.difficulty,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCurrentFeedback(data.evaluation);
      setEvaluations((prev) => [...prev, data.evaluation]);
    } catch (err) {
      setError(err.message || "Failed to evaluate answer");
    } finally {
      setLoading(false);
    }
  };

  // Next question or final report
  const handleNext = async () => {
    if (currentIndex >= questions.length - 1) {
      // Generate final report
      setLoading(true);
      setCurrentFeedback(null);
      try {
        const res = await fetch(`${API_BASE}/final-report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: config.role,
            difficulty: config.difficulty,
            type: config.type,
            evaluations,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setReport(data.report);
        setScreen("report");
      } catch (err) {
        setError(err.message || "Failed to generate report");
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentIndex((i) => i + 1);
      setCurrentFeedback(null);
    }
  };

  // Restart
  const handleRestart = () => {
    setScreen("setup");
    setConfig(null);
    setQuestions([]);
    setCurrentIndex(0);
    setEvaluations([]);
    setCurrentFeedback(null);
    setReport(null);
    setError("");
  };

  return (
    <div className="min-h-screen px-4 py-6 max-w-5xl mx-auto">
      <Header />

      {error && (
        <div className="max-w-3xl mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm shadow-sm">
          {error}
          <button onClick={() => setError("")} className="ml-3 underline">Dismiss</button>
        </div>
      )}

      {/* Setup Screen */}
      {screen === "setup" && (
        <InterviewSetup onStart={handleStart} loading={loading} />
      )}

      {/* Interview Screen */}
      {screen === "interview" && (
        <div>
          <ProgressBar current={currentIndex + 1} total={questions.length} />

          <QuestionCard
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            onSubmit={handleSubmitAnswer}
            loading={loading}
          />

          {currentFeedback && (
            <FeedbackPanel
              evaluation={currentFeedback}
              onNext={handleNext}
              isLast={currentIndex >= questions.length - 1}
            />
          )}

          <div className="text-center mt-6">
            <button onClick={handleRestart} className="btn-danger text-sm">
              ✕ End Interview
            </button>
          </div>
        </div>
      )}

      {/* Report Screen */}
      {screen === "report" && report && (
        <FinalReport
          report={report}
          config={config}
          evaluations={evaluations}
          onRestart={handleRestart}
        />
      )}

      {/* Loading overlay for report generation */}
      {screen === "interview" && loading && !currentFeedback && currentIndex >= questions.length - 1 && evaluations.length === questions.length && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card text-center">
            <svg className="animate-spin h-10 w-10 text-violet-500 mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-500">Generating your performance report...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
