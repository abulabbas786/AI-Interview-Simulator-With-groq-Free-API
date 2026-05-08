export default function Header() {
  return (
    <header className="text-center py-8 mb-6">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
        AI Interview Simulator
      </h1>
      <p className="text-gray-500 mt-3 text-lg">
        Practice interviews with AI-powered feedback & scoring
      </p>
      <div className="flex items-center justify-center gap-2 mt-4">
        <span className="px-3 py-1 bg-violet-100 text-violet-600 text-xs rounded-full border border-violet-200 font-medium shadow-sm">
          Powered by Groq + LLaMA 3.1
        </span>
      </div>
    </header>
  );
}
