const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Product Manager",
  "HR Manager",
  "DevOps Engineer",
  "Mobile Developer",
];

const difficulties = ["Beginner", "Intermediate", "Advanced"];
const interviewTypes = ["Technical", "HR", "Behavioral", "Mixed"];
const questionCounts = [2, 5, 10, 15];

export default function InterviewSetup({ onStart, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onStart({
      role: formData.get("role"),
      difficulty: formData.get("difficulty"),
      type: formData.get("type"),
      numberOfQuestions: parseInt(formData.get("numberOfQuestions")),
    });
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Setup Your Interview</h2>
        <p className="text-gray-500 text-sm mt-1">Configure your mock interview session</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 font-medium mb-1.5">Job Role</label>
            <select name="role" className="select-field" required>
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 font-medium mb-1.5">Experience Level</label>
            <select name="difficulty" className="select-field" required>
              {difficulties.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 font-medium mb-1.5">Interview Type</label>
            <select name="type" className="select-field" required>
              {interviewTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 font-medium mb-1.5">Number of Questions</label>
            <select name="numberOfQuestions" className="select-field" required>
              {questionCounts.map((n) => (
                <option key={n} value={n}>{n} Questions</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full mt-6" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating Questions...
            </span>
          ) : (
            "Start Interview"
          )}
        </button>
      </form>
    </div>
  );
}
