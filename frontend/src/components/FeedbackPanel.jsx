export default function FeedbackPanel({ evaluation, onNext, isLast }) {
  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-700 bg-green-100 border-green-300";
    if (score >= 6) return "text-yellow-700 bg-yellow-100 border-yellow-300";
    if (score >= 4) return "text-orange-700 bg-orange-100 border-orange-300";
    return "text-red-700 bg-red-100 border-red-300";
  };

  return (
    <div className="card max-w-3xl mx-auto mt-4 border-violet-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">AI Feedback</h3>
        <div className={`score-badge border ${getScoreColor(evaluation.score)}`}>
          ⭐ {evaluation.score}/10
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-xl p-3 shadow-sm border border-gray-100">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Correctness</span>
          <p className="text-sm text-gray-700 mt-1">{evaluation.correctness}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 shadow-sm border border-gray-100">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Clarity</span>
          <p className="text-sm text-gray-700 mt-1">{evaluation.clarity}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 shadow-sm border border-gray-100">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Confidence</span>
          <p className="text-sm text-gray-700 mt-1">{evaluation.confidence}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 shadow-sm border border-gray-100">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Improvement</span>
          <p className="text-sm text-gray-700 mt-1">{evaluation.improvement}</p>
        </div>
      </div>

      {evaluation.sampleAnswer && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-4">
          <span className="text-xs text-violet-600 uppercase tracking-wide font-medium">💡 Ideal Answer</span>
          <p className="text-sm text-gray-700 mt-1">{evaluation.sampleAnswer}</p>
        </div>
      )}

      <button onClick={onNext} className="btn-primary w-full">
        {isLast ? "View Final Report" : "Next Question →"}
      </button>
    </div>
  );
}
