import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, vscodeState } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0e12] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium text-sm tracking-wide">Syncing session state...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Preserve vscode_state if present to ensure the linking flows don't break
    const searchParams = new URLSearchParams();
    if (vscodeState) {
      searchParams.set('vscode_state', vscodeState);
    }
    const searchStr = searchParams.toString();
    const loginPath = searchStr ? `/login?${searchStr}` : '/login';

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
