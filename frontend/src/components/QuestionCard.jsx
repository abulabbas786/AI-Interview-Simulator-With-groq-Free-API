import { useState, useEffect } from "react";

export default function QuestionCard({ question, questionNumber, onSubmit, loading }) {
  const [answer, setAnswer] = useState("");
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [timer, setTimer] = useState(0);
  const [isListening, setIsListening] = useState(false);

  // Typing animation for question
  useEffect(() => {
    setDisplayedQuestion("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < question.length) {
        setDisplayedQuestion(question.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [question]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [question]);

  // Reset timer on new question
  useEffect(() => {
    setTimer(0);
    setAnswer("");
  }, [question]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    onSubmit(answer);
  };

  // Voice input
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };

    recognition.start();
  };

  return (
    <div className="card max-w-3xl mx-auto">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-violet-600 bg-violet-100 px-3 py-1 rounded-full shadow-sm">
          Question {questionNumber}
        </span>
        <span className="text-sm font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
          ⏱ {formatTime(timer)}
        </span>
      </div>

      {/* Question Text */}
      <div className="mb-6 min-h-[60px]">
        <p className="text-lg text-gray-800 leading-relaxed font-medium">
          {displayedQuestion}
          <span className="animate-pulse text-violet-500">|</span>
        </p>
      </div>

      {/* Answer Area */}
      <div className="space-y-3">
        <label className="block text-sm text-gray-600 font-medium">Your Answer</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="input-field min-h-[140px] resize-y"
          disabled={loading}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            className="btn-primary flex-1"
            disabled={loading || !answer.trim()}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Evaluating...
              </span>
            ) : (
              "Submit Answer"
            )}
          </button>

          <button
            onClick={startListening}
            className={`btn-secondary px-4 ${isListening ? "!border-red-500 !text-red-400" : ""}`}
            disabled={loading}
            title="Voice Input"
          >
            {isListening ? "🔴 Listening..." : "🎤 Voice"}
          </button>
        </div>
      </div>
    </div>
  );
}
