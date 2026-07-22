import { useState } from 'react';
import { Link } from 'react-router';
import AuthLayout from '../components/AuthLayout';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API Call
    setTimeout(() => {
      console.log('Login attempt:', { username, password });
      setIsLoading(false);
    }, 1000);
  };

  

  return (
   <>
  <div
    id="code-rain"
    className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
  />
  {/* LEFT PANEL: Atmospheric developer visual */}
  <section className="relative hidden lg:flex w-full lg:w-[55%] h-full flex-col justify-between p-8 xl:p-12 z-10">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-mono text-arena-green text-lg">⌘</span>
        <span className="font-mono font-semibold tracking-tight text-white">
          bugbrawl<span className="text-arena-muted">.sh</span>
        </span>
      </div>
      <div className="flex items-center gap-2 font-mono text-xs text-arena-green">
        <span className="relative inline-flex h-2 w-2">
          <span className="live-pulse" />
          <span className="relative inline-block h-2 w-2 rounded-full bg-arena-green" />
        </span>
        LIVE · 128 arenas open
      </div>
    </div>
    {/* Massive ASCII art logo */}
    <div className="mt-12 leading-none font-mono text-arena-green select-all whitespace-pre overflow-hidden">
      <pre className="text-[11px] sm:text-[13px] md:text-[15px] tracking-widest opacity-90">
        ██████╗{"  "}██╗{"   "}██╗{"  "}██████╗{"      "}██████╗{"  "}██████╗
        {"   "}█████╗{"  "}██╗{"    "}██╗ ██╗{"     "}
        {"\n"}██╔══██╗ ██║{"   "}██║ ██╔════╝{"      "}██╔══██╗ ██╔══██╗
        ██╔══██╗ ██║{"    "}██║ ██║{"     "}
        {"\n"}██████╔╝ ██║{"   "}██║ ██║{"  "}███╗{"     "}██████╔╝ ██████╔╝
        ███████║ ██║ █╗ ██║ ██║{"     "}
        {"\n"}██╔══██╗ ██║{"   "}██║ ██║{"   "}██║{"     "}██╔══██╗ ██╔══██╗
        ██╔══██║ ██║███╗██║ ██║{"     "}
        {"\n"}██████╔╝ ╚██████╔╝ ╚██████╔╝{"     "}██████╔╝ ██║{"  "}██║ ██║
        {"  "}██║ ╚███╔███╔╝ ███████╗{"\n"}╚═════╝{"   "}╚═════╝{"   "}╚═════╝
        {"      "}╚═════╝{"  "}╚═╝{"  "}╚═╝ ╚═╝{"  "}╚═╝{"  "}╚══╝╚══╝{"  "}
        ╚══════╝{"\n"}
        ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
        {"\n"}Powered by Resky Altaf Andri{"\n"}
        {"    "}
      </pre>
    </div>
    <p className="font-mono text-arena-green mt-2 ml-1">
      &gt; Debug. Compete. Dominate.
    </p>
    {/* Floating code snippet cards */}
    <div className="relative mt-8 h-44 max-w-xl">
      <div className="absolute -top-4 left-0 w-72 bg-arena-panel border border-arena-border rounded-md shadow-2xl overflow-hidden transform -rotate-2 z-10">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-arena-border bg-[#0d1117]">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="ml-2 font-mono text-[11px] text-arena-muted">
            player.py
          </span>
        </div>
        <div className="p-3 font-mono text-[12px] leading-relaxed">
          <span className="text-purple-400">def</span>{" "}
          <span className="text-arena-green">solve</span>(n):
          <br />
          <span className="text-arena-muted"># TODO: fix off-by-one</span>
          <br />
          <span className="text-purple-400">for</span> i{" "}
          <span className="text-purple-400">in</span>{" "}
          <span className="text-arena-green">range</span>(n
          <span className="text-arena-muted">+1</span>):
          <br />
          <span className="bg-arena-green/15 text-arena-green px-0.5">
            assert sum(primes(i)) == target
          </span>
        </div>
      </div>
      <div className="absolute top-8 right-0 w-64 bg-arena-panel border border-arena-border rounded-md shadow-2xl overflow-hidden transform rotate-1 z-20">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-arena-border bg-[#0d1117]">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="ml-2 font-mono text-[11px] text-arena-muted">
            arena.js
          </span>
        </div>
        <div className="p-3 font-mono text-[12px] leading-relaxed">
          <span className="text-arena-green">const</span> score ={" "}
          <span className="text-purple-400">await</span>{" "}
          <span className="text-arena-green">judge</span>(sol);
          <br />
          <span className="text-arena-muted">// latency 12ms · AI scored</span>
          <br />
          <span className="text-purple-400">if</span> (score &gt;{" "}
          <span className="text-arena-muted">0.95</span>){" "}
          <span className="text-arena-green">promote</span>();
        </div>
      </div>
    </div>
    {/* Stat pills + terminal footer */}
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <div className="bg-arena-panel border border-arena-border rounded-full px-4 py-2 font-mono text-xs flex items-center gap-2">
          <i className="fa-solid fa-users text-arena-green" /> 2,400+ Developers
        </div>
        <div className="bg-arena-panel border border-arena-border rounded-full px-4 py-2 font-mono text-xs flex items-center gap-2">
          <i className="fa-solid fa-bug text-arena-green" /> 15,000+ Bugs
          Squashed
        </div>
        <div className="bg-arena-panel border border-arena-border rounded-full px-4 py-2 font-mono text-xs flex items-center gap-2">
          <i className="fa-solid fa-robot text-arena-green" /> Real-time AI
          Scoring
        </div>
      </div>
      <div className="font-mono text-sm text-arena-muted flex items-center gap-2">
        <span className="text-arena-green">root@bugbrawl</span>:
        <span className="text-purple-400">~</span>$ ./start_competition.sh{" "}
        <span className="blink-cursor" />
      </div>
    </div>
  </section>
  {/* RIGHT PANEL: Auth card */}
  <section className="w-full lg:w-[45%] h-full flex items-center justify-center p-6 relative z-20">
    <div className="w-full max-w-md bg-arena-panel border border-arena-border rounded-xl shadow-2xl p-8">
      {/* Tab switcher */}
      <div className="flex border-b border-arena-border mb-7">
        <button
          id="tab-login"
          onclick="switchTab('login')"
          className="flex-1 pb-3 font-mono text-sm font-semibold tab-active transition-colors hover:text-arena-green"
        >
          Login
        </button>
        <button
          id="tab-register"
          onclick="switchTab('register')"
          className="flex-1 pb-3 font-mono text-sm font-semibold text-arena-muted transition-colors hover:text-arena-green"
        >
          Register
        </button>
      </div>
      {/* LOGIN STATE */}
      <div id="state-login">
        <h2 className="font-mono text-xl font-bold text-white mb-7">
          Welcome back, debugger
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block font-mono text-xs text-arena-green mb-1.5">
              // username
            </label>
            <div className="relative">
              <i className="fa-solid fa-at absolute left-3.5 top-1/2 -translate-y-1/2 text-arena-muted text-sm" />
              <input
                type="text"
                placeholder="your.handle"
                className="w-full bg-arena-bg border border-arena-border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-arena-muted focus:outline-none focus:border-arena-green focus:shadow-[0_0_0_3px_rgba(0,255,65,0.1)] transition-all font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block font-mono text-xs text-arena-green mb-1.5">
              // password
            </label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-arena-muted text-sm" />
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full bg-arena-bg border border-arena-border rounded-lg pl-10 pr-12 py-3 text-sm text-white placeholder-arena-muted focus:outline-none focus:border-arena-green focus:shadow-[0_0_0_3px_rgba(0,255,65,0.1)] transition-all font-mono"
              />
              <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-arena-muted hover:text-arena-green transition-colors">
                <i className="fa-regular fa-eye text-sm" />
              </button>
            </div>
          </div>
          <button className="w-full bg-gradient-cta text-black font-mono font-bold text-sm py-3.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            LOGIN
          </button>
        </div>
      </div>
      {/* REGISTER STATE */}
      <div id="state-register" className="hidden">
        <h2 className="font-mono text-xl font-bold text-white mb-7">
          Join the arena, debugger
        </h2>
        <div className="space-y-5 mb-7">
          <div>
            <label className="block font-mono text-xs text-arena-green mb-1.5">
              // username
            </label>
            <div className="relative">
              <i className="fa-solid fa-user-ninja absolute left-3.5 top-1/2 -translate-y-1/2 text-arena-muted text-sm" />
              <input
                type="text"
                placeholder="pick.your.handle"
                className="w-full bg-arena-bg border border-arena-border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-arena-muted focus:outline-none focus:border-arena-green focus:shadow-[0_0_0_3px_rgba(0,255,65,0.1)] transition-all font-mono"
              />
            </div>
          </div>
        </div>
        <div className="">
          <div>
            <label className="block font-mono text-xs text-arena-green mb-1.5">
              // password
            </label>
            <div className="relative">
              <i className="fa-solid fa-key absolute left-3.5 top-1/2 -translate-y-1/2 text-arena-muted text-sm" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-arena-bg border border-arena-border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-arena-muted focus:outline-none focus:border-arena-green focus:shadow-[0_0_0_3px_rgba(0,255,65,0.1)] transition-all font-mono"
              />
            </div>
            <div className="mt-7">
              <button className="w-full bg-gradient-cta text-black font-mono font-bold text-sm py-3.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span>&gt; _</span> CREATE ACCOUNT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</>

   
  );
}
