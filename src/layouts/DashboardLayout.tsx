import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../hooks/use-auth';

export function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();

  // Simple Breadcrumbs calculation
  const pathParts = location.pathname.split('/').filter(Boolean);
  const formattedParts = pathParts.map(part => part.charAt(0).toUpperCase() + part.slice(1));

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Sub Header / Dashboard Toolbar */}
        <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/40 backdrop-blur-md">
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <Link to="/" className="text-slate-400 hover:text-emerald-400 transition-colors">
              App
            </Link>
            {formattedParts.map((part, index) => {
              const url = '/' + pathParts.slice(0, index + 1).join('/');
              const isLast = index === formattedParts.length - 1;
              return (
                <React.Fragment key={url}>
                  <span className="text-slate-600">/</span>
                  {isLast ? (
                    <span className="text-emerald-400 font-semibold">{part}</span>
                  ) : (
                    <Link to={url} className="text-slate-400 hover:text-emerald-400 transition-colors">
                      {part}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Sync status & User actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Sandbox Connected
            </div>

            <div className="h-4 w-px bg-slate-800"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold text-white">{user?.name || 'Developer'}</p>
                <p className="text-[10px] text-slate-500">Tier: Pro Developer</p>
              </div>
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border border-slate-700 hover:border-emerald-400 transition-colors cursor-pointer"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Layout Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950/60 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
