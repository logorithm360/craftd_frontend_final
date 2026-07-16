import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen w-screen bg-[#07080a] text-slate-100 flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-md space-y-6">
        <h1 className="font-mono text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-amber-500">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Endpoint Refused (Not Found)</h2>
          <p className="text-slate-500 text-xs leading-relaxed">
            The route telemetry request failed or the requested container was not initialized. Check your active route configuration variables.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            to="/dashboard/projects"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
          >
            Go to Projects
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
