import { useState } from 'react';
import { useAuth } from '../hooks/use-auth';

export function SettingsPage() {
  const { vscodeState, setVscodeState, user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'sync' | 'billing'>('account');

  // Input states
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const mockToken = 'craftd_usr_token_9x2b8z71y6w5v4u3';

  const handleCopyToken = () => {
    navigator.clipboard.writeText(mockToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, avatarUrl);
    setSuccessMsg('Account preferences successfully updated!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Settings Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings Workspace</h1>
        <p className="text-slate-500 text-xs">Configure your user account profile and sync active device telemetry.</p>
      </div>

      {/* Tabs list navigation */}
      <div className="flex border-b border-slate-900 gap-1">
        {(['account', 'sync', 'billing'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeTab === tab
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-white'
            }`}
          >
            {tab} Settings
          </button>
        ))}
      </div>

      {/* Tab panel contents */}
      <div className="bg-slate-900/15 border border-slate-900 rounded-2xl p-6 md:p-8">
        {activeTab === 'account' && (
          <form onSubmit={handleUpdateAccount} className="space-y-6 max-w-xl">
            <h3 className="text-base font-bold text-white mb-2">Account Credentials</h3>

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg">
                {successMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Display Developer Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-slate-950/40 border border-slate-900 rounded-lg px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-600 mt-1 block">Account emails cannot be changed in Sandbox environment.</span>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md shadow-emerald-500/10"
            >
              Save Changes
            </button>
          </form>
        )}

        {activeTab === 'sync' && (
          <div className="space-y-8 max-w-2xl">
            {/* VS Code Extension Status Block */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">VS Code Integration</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Sync active projects and track task telemetry directly from your editor. Use the access token below inside the extension settings to establish a live pipeline.
              </p>
            </div>

            {vscodeState && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active Sync Request Parameter
                </div>
                <p>
                  You are in the middle of linking workspace metadata <code className="bg-emerald-500/20 px-1 py-0.5 rounded font-mono text-[10px] text-emerald-300">{vscodeState}</code>.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSuccessMsg('Workspace device successfully linked!');
                      setVscodeState(null);
                      setTimeout(() => setSuccessMsg(null), 3000);
                    }}
                    className="px-3 py-1.5 rounded bg-emerald-500 text-slate-950 font-bold text-[10px] transition-all cursor-pointer"
                  >
                    Authorize Syncing
                  </button>
                  <button
                    onClick={() => setVscodeState(null)}
                    className="px-3 py-1.5 rounded bg-slate-800 text-white font-semibold text-[10px] transition-all cursor-pointer"
                  >
                    Reject Sync
                  </button>
                </div>
              </div>
            )}

            {/* Token Copy Section */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-900 space-y-3">
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Personal Workspace Integration Access Token
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={mockToken}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyToken}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition-all border border-slate-700"
                >
                  {copied ? 'Copied!' : 'Copy Token'}
                </button>
              </div>
              <p className="text-[10px] text-slate-600">Never share your access token. Re-generating will invalidate any previously synchronized devices.</p>
            </div>

            {/* Simulated Device Registry */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Associated Sync Devices</h4>
              <div className="border border-slate-900 rounded-xl overflow-hidden divide-y divide-slate-900 text-xs">
                <div className="p-4 bg-slate-950/40 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <div>
                      <p className="font-semibold text-white">VS Code Workspace - Mac Pro</p>
                      <p className="text-[10px] text-slate-500 font-mono">ID: dev_workspace_9x2b8 • Extension v1.2.4</p>
                    </div>
                  </div>
                  <button className="px-2 py-1 rounded border border-red-500/20 text-red-400 text-[10px] bg-red-500/5 hover:bg-red-500/10 cursor-pointer">
                    Revoke Sync
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-base font-bold text-white mb-2">Plan Details</h3>
              <p className="text-slate-400 text-xs">You are currently subscribed to the free sandbox environment, which includes local storage sync controls.</p>
            </div>

            <div className="p-4 rounded-xl border border-dashed border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 space-y-2">
              <p className="font-semibold uppercase tracking-wider text-[10px]">Upcoming Beta Features</p>
              <p className="leading-relaxed text-slate-300 text-[11px]">
                Premium collaborative telemetry hubs, NestJS user organizations, and custom metrics query runners will be available during Phase 2 & Phase 3 launches. Stay tuned!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
