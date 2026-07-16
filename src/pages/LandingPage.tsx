import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

export function LandingPage() {
  const { user } = useAuth();
  const [isAnnual, setIsAnnual] = useState(true);

  const faqs = [
    {
      q: "How does Craftd integrate with VS Code?",
      a: "Craftd comes with an official, lightweight VS Code extension. Simply generate an access token or click 'Link Device' in settings to sync your workspace metadata, active tasks, and code metrics instantly."
    },
    {
      q: "Is my source code secure?",
      a: "Yes! Craftd only transmits metadata, task status updates, and build metrics to organize your workspace. We never access, copy, or store your actual codebase or intellectual property."
    },
    {
      q: "Can I use Craftd without backend servers running?",
      a: "Absolutely. Our web application functions out-of-the-box in standalone Sandbox mode. Your active projects, tasks, and configurations are safely stored directly in your local environment."
    },
    {
      q: "What is the NestJS and FastAPI dual architecture?",
      a: "Craftd uses NestJS for robust identity, auth flow, and device state management, while using FastAPI's high performance for lightning-fast project and task telemetry computation."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07080a] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Dynamic Navbar */}
      <nav className="sticky top-0 z-50 bg-[#07080a]/80 backdrop-blur-md border-b border-slate-900/80 px-6 lg:px-16 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950">
            C
          </div>
          <span className="font-semibold text-lg text-white tracking-wider">CRAFTD</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
          <a href="#architecture" className="hover:text-emerald-400 transition-colors">Architecture</a>
          <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
          <a href="#faqs" className="hover:text-emerald-400 transition-colors">FAQs</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard/projects"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all duration-200"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all duration-200"
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with gradients */}
        <section className="relative pt-24 pb-20 px-6 lg:px-16 text-center overflow-hidden">
          {/* Neon Glow Backdrops */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>

          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* Status Integration Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-semibold tracking-wide mb-8 animate-bounce">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              VS Code Extension + React 19 Frontend Active
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Smarter Workspaces.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500">
                Crafted for Developers.
              </span>
            </h1>

            <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed mb-10">
              The ultimate developer productivity suite. Sync projects directly between your VS Code IDE and web dashboard with absolute zero friction. Driven by FastAPI & NestJS microservices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Start Crafting Free
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-bold text-base transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Explore Features
              </a>
            </div>

            {/* Simulated Glassmorphism Web App Preview */}
            <div className="mt-16 w-full max-w-5xl rounded-2xl bg-slate-900/50 border border-slate-800/80 p-3 shadow-2xl backdrop-blur-md relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-transparent to-transparent -z-10"></div>
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-800 bg-slate-950/80 rounded-t-xl text-xs text-slate-500">
                <span className="w-3 h-3 rounded-full bg-red-500/60"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/60"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/60"></span>
                <span className="ml-2 font-mono text-[10px]">app.craftd.sh/dashboard/projects</span>
              </div>
              <div className="bg-slate-950/90 rounded-b-xl p-6 text-left font-mono text-xs md:text-sm text-slate-400 space-y-4">
                <p className="text-emerald-400"># Successfully authenticated with Craftd NestJS identity portal</p>
                <p className="text-slate-200">$ npx craftd-cli sync-device --key=dev_workspace_9x2b8</p>
                <p className="text-blue-400">✓ Syncing workspace metadata from local VS Code workspace ... [OK]</p>
                <div className="pl-4 border-l border-emerald-500/30 py-2 space-y-1">
                  <p>📁 Active Projects: 3 detected (NestAPI, Web App Frontend, CLI Tool)</p>
                  <p>📋 Tasks: 12 open tasks, 8 pending review, 1 blocked</p>
                  <p>⚡ Extension Sync State: ACTIVE (Connected: VS Code Extension v1.2.4)</p>
                </div>
                <p className="text-slate-500">// Real-time dashboard updated. Direct telemetry computed successfully.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-24 px-6 lg:px-16 border-t border-slate-900/60 bg-gradient-to-b from-[#07080a] to-[#0a0c10]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-xs uppercase tracking-widest font-semibold text-emerald-400 mb-2">Core Features</h2>
              <p className="text-3xl md:text-4xl font-bold text-white">Full integration, custom built for speed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">VS Code Seamless Integration</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Command pallete connection and background task syncing allows managing tickets, backlogs, and status directly inside your editor.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Lightning Dual Services</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Harnessing FastAPI's compute speed alongside NestJS authentication nodes guarantees ultra-low telemetry response times.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Silent Cookie Auths</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Secure HttpOnly token refresh loops ensure you stay authenticated across reloads without showing annoying flash logins.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section id="architecture" className="py-24 px-6 lg:px-16 border-t border-slate-900/50 bg-[#07080a]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-xs uppercase tracking-widest font-semibold text-emerald-400 mb-2">System Blueprint</h2>
                <h3 className="text-3xl font-bold text-white mb-6">Built on High Performance Tech Standards</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Our codebase adheres to modern microservice layouts. Craftd runs with React 19 on Vite, optimized compiling via Tailwind CSS v4 components.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs">1</div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">NestJS Auth Portal</h4>
                      <p className="text-slate-500 text-xs">Handles session creation, password hashes, devices tracking, and cookie storage.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs">2</div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">FastAPI Telemetry Hub</h4>
                      <p className="text-slate-500 text-xs">Powers instant query evaluations of developer projects, tasks statistics, and workspace state payloads.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/30 border border-slate-800 p-8 rounded-2xl">
                <div className="text-xs text-slate-500 font-mono space-y-3.5">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-semibold">Web Client Layer</span>
                    <span className="text-emerald-400">Vite 8 + React 19</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-semibold">Style Engine</span>
                    <span className="text-emerald-400">Tailwind CSS v4</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-semibold">State Routing</span>
                    <span className="text-teal-400">react-router-dom v7</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-semibold">Security Model</span>
                    <span className="text-blue-400">Secure HttpOnly Cookies</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400 font-semibold">Development Target</span>
                    <span className="text-purple-400">VS Code Integration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Toggle Grid */}
        <section id="pricing" className="py-24 px-6 lg:px-16 border-t border-slate-900/50 bg-[#07080a]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-xs uppercase tracking-widest font-semibold text-emerald-400 mb-2">Flexible Pricing</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Designed to Scale with Your Team</h3>

              {/* Monthly/Annual Toggle Switch */}
              <div className="inline-flex items-center gap-3 p-1.5 rounded-full bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    !isAnnual ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                    isAnnual ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Annually
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/20">
                    -20%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter Tier */}
              <div className="p-8 rounded-2xl bg-slate-900/20 border border-slate-900 hover:border-slate-800 transition-all">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Starter</p>
                <p className="text-3xl font-bold text-white mb-6">$0 <span className="text-sm font-normal text-slate-500">/ forever</span></p>
                <ul className="space-y-3 text-slate-400 text-xs mb-8">
                  <li className="flex items-center gap-2"><span className="text-emerald-400 font-semibold">✓</span> Up to 3 active projects</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400 font-semibold">✓</span> 50 tasks updates/month</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400 font-semibold">✓</span> VS Code extension link</li>
                  <li className="flex items-center gap-2 text-slate-600">✗ No multiple device logs</li>
                </ul>
                <Link to="/register" className="block w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-white text-xs font-semibold text-center transition-all">
                  Get Started Free
                </Link>
              </div>

              {/* Professional Tier (Highlighted) */}
              <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-900/20 border border-emerald-500/30 relative">
                <div className="absolute top-0 right-8 -translate-y-1/2 px-2.5 py-1 rounded bg-emerald-500 text-slate-950 text-[9px] font-bold tracking-widest uppercase">
                  Most Popular
                </div>
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">Professional</p>
                <p className="text-3xl font-bold text-white mb-6">
                  ${isAnnual ? '8' : '10'} <span className="text-sm font-normal text-slate-500">/ user / mo</span>
                </p>
                <ul className="space-y-3 text-slate-300 text-xs mb-8">
                  <li className="flex items-center gap-2"><span className="text-emerald-400 font-semibold">✓</span> Unlimited active projects</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400 font-semibold">✓</span> Unlimited workspace tasks</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400 font-semibold">✓</span> Premium task telemetry access</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400 font-semibold">✓</span> Support for multi-device syncs</li>
                </ul>
                <Link to="/register" className="block w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold text-center shadow-md shadow-emerald-500/10 transition-all">
                  Upgrade to Pro
                </Link>
              </div>

              {/* Enterprise Tier */}
              <div className="p-8 rounded-2xl bg-slate-900/20 border border-slate-900 hover:border-slate-800 transition-all">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Enterprise</p>
                <p className="text-3xl font-bold text-white mb-6">Custom <span className="text-sm font-normal text-slate-500">/ scaling</span></p>
                <ul className="space-y-3 text-slate-400 text-xs mb-8">
                  <li className="flex items-center gap-2"><span className="text-emerald-400 font-semibold">✓</span> Dedicate server endpoints</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400 font-semibold">✓</span> Custom integrations config</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400 font-semibold">✓</span> SLAs and priority chat support</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400 font-semibold">✓</span> Detailed metrics exporting</li>
                </ul>
                <a href="mailto:sales@craftd.sh" className="block w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-white text-xs font-semibold text-center transition-all">
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Polished FAQ Section */}
        <section id="faqs" className="py-24 px-6 lg:px-16 border-t border-slate-900/50 bg-[#07080a]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-xs uppercase tracking-widest font-semibold text-emerald-400 mb-2">Have Questions?</h2>
              <h3 className="text-3xl font-bold text-white">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-slate-900/30 border border-slate-900 hover:border-slate-800 rounded-xl p-5 transition-all duration-200 cursor-pointer"
                >
                  <summary className="list-none flex items-center justify-between text-sm font-semibold text-white select-none">
                    <span>{faq.q}</span>
                    <span className="text-slate-500 group-open:rotate-180 transition-transform duration-200">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-3 text-xs leading-relaxed text-slate-400 pl-1 border-l-2 border-emerald-500/20 transition-all">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Multi-column Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 lg:px-16 py-12 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                C
              </div>
              <span className="font-semibold text-white tracking-wider text-sm">CRAFTD</span>
            </div>
            <p className="leading-relaxed">
              Crafting state-of-the-art workspace utilities, driving automation workflows directly within active IDE files.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing Plans</a></li>
              <li><a href="https://marketplace.visualstudio.com" className="hover:text-emerald-400 transition-colors">VS Code Extension</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Architects</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-400">Vite v8 Bundler</span></li>
              <li><span className="text-slate-400">React 19 Hooks</span></li>
              <li><span className="text-slate-400">Tailwind CSS v4</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2">
              <li><a href="#faqs" className="hover:text-emerald-400 transition-colors">Platform FAQ</a></li>
              <li><a href="mailto:support@craftd.sh" className="hover:text-emerald-400 transition-colors">Contact Support</a></li>
              <li><span className="text-slate-400">Status: Operational</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-slate-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Craftd. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-emerald-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-emerald-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
