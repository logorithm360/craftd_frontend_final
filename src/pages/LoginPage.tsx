import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export function LoginPage() {
  const { login, vscodeState, setVscodeState, vscodeCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as LocationState)?.from?.pathname || '/dashboard/projects';

  // Auto-complete VS Code callback if session cookie is still active
  useEffect(() => {
    if (!vscodeState) return;
    let cancelled = false;
    fetch('http://localhost:3001/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then(async (data) => {
        if (cancelled || !data?.accessToken) return;
        const redirectUrl = await vscodeCallback(vscodeState);
        if (redirectUrl && !cancelled) {
          window.location.href = redirectUrl;
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [vscodeState, vscodeCallback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    const success = await login(email, password);
    setIsSubmitting(false);

    if (success) {
      // If this came from the VS Code extension login flow,
      // complete the VSCode callback and redirect browser to deep link
      if (vscodeState) {
        const redirectUrl = await vscodeCallback(vscodeState);
        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }
      }
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password. (Hint: use admin@craftd.sh / password)');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#07080a] text-slate-100 flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md">
        {/* Brand heading */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950">
              C
            </div>
            <span className="font-semibold text-lg text-white tracking-wider">CRAFTD</span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
          <p className="text-slate-500 text-xs mt-1">Enter your credentials to access your dashboard</p>
        </div>

        {/* Sync Device Banner if vscode_state query param is present */}
        {vscodeState && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-bold tracking-wide uppercase text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              VS Code Device Association Flow
            </div>
            <p className="leading-relaxed">
              Login or register below to associate your local VS Code Workspace <code className="bg-emerald-500/20 px-1 py-0.5 rounded font-mono text-[10px] text-emerald-300">{vscodeState}</code> with your account.
            </p>
            <button
              onClick={() => setVscodeState(null)}
              className="text-left text-[10px] underline hover:text-emerald-300 text-slate-400 transition-colors"
            >
              Cancel association flow
            </button>
          </div>
        )}

        {/* Login form container */}
        <div className="bg-slate-900/40 border border-slate-900/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[10px] text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer">Forgot password?</span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all duration-200 shadow-lg shadow-emerald-500/10 cursor-pointer flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                'Sign In to Workspace'
              )}
            </button>
          </form>

          {/* Prompt helper credentials */}
          <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
            <p className="text-[10px] text-slate-500">
              Demo Credentials: <span className="text-emerald-400/80">admin@craftd.sh</span> / <span className="text-emerald-400/80">password</span>
            </p>
          </div>
        </div>

        {/* Link to sign up */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Don't have an account?{' '}
          <Link to={vscodeState ? `/register?vscode_state=${vscodeState}` : '/register'} className="text-emerald-400 hover:underline font-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
