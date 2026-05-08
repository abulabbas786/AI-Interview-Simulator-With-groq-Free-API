export default function FinalReport({ report, config, evaluations, onRestart }) {
  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    if (score >= 4) return "text-orange-600";
    return "text-red-600";
  };

  const downloadReport = () => {
    const text = `
AI INTERVIEW REPORT
====================
Role: ${config.role}
Level: ${config.difficulty}
Type: ${config.type}
Date: ${new Date().toLocaleDateString()}

OVERALL SCORE: ${report.overallScore}/10
PERFORMANCE: ${report.performanceLabel}
BADGE: ${report.badge}

STRENGTHS:
${report.strengths?.map((s) => `  ✓ ${s}`).join("\n")}

WEAKNESSES:
${report.weaknesses?.map((w) => `  ✗ ${w}`).join("\n")}

SUGGESTED IMPROVEMENTS:
${report.improvements?.map((i) => `  → ${i}`).join("\n")}

TOPICS TO STUDY:
${report.topicsToStudy?.map((t) => `  📚 ${t}`).join("\n")}

QUESTION-WISE SCORES:
${evaluations.map((e, i) => `  Q${i + 1}: ${e.score}/10`).join("\n")}
    `.trim();

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Score Hero */}
      <div className="card text-center">
        <div className="mb-4">
          <div className={`text-6xl font-bold ${getScoreColor(report.overallScore)}`}>
            {report.overallScore}<span className="text-2xl text-gray-400">/10</span>
          </div>
          <p className="text-gray-500 mt-2">{report.performanceLabel}</p>
        </div>

        {report.badge && (
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-violet-100 to-indigo-100 border border-violet-300 rounded-full shadow-sm">
            <span className="text-violet-700 font-medium">🏆 {report.badge}</span>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-400">
          {config.role} • {config.difficulty} • {config.type}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Breakdown</h3>
        <div className="space-y-2">
          {evaluations.map((e, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm text-gray-500 w-8">Q{i + 1}</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-700"
                  style={{ width: `${(e.score / 10) * 100}%` }}
                />
              </div>
              <span className={`text-sm font-medium w-10 text-right ${getScoreColor(e.score)}`}>
                {e.score}/10
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-green-600 font-semibold mb-3">✓ Strengths</h3>
          <ul className="space-y-2">
            {report.strengths?.map((s, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 className="text-red-500 font-semibold mb-3">✗ Weaknesses</h3>
          <ul className="space-y-2">
            {report.weaknesses?.map((w, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Improvements & Topics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📈 Suggested Improvements</h3>
        <ul className="space-y-2 mb-6">
          {report.improvements?.map((imp, i) => (
            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-violet-500">→</span> {imp}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">📚 Topics to Practice</h3>
        <div className="flex flex-wrap gap-2">
          {report.topicsToStudy?.map((topic, i) => (
            <span key={i} className="px-3 py-1.5 bg-violet-50 text-violet-700 text-sm rounded-lg border border-violet-200 shadow-sm">
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onRestart} className="btn-primary flex-1">
          Start New Interview
        </button>
        <button onClick={downloadReport} className="btn-secondary">
          📥 Download Report
        </button>
      </div>
    </div>
  );
}
