export default function LoginHero() {
  return (
    <section className="relative hidden lg:flex w-full lg:w-[55%] h-full flex-col justify-between p-8 xl:p-12 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[#00ff41] text-lg">{'\u2318'}</span>
          <span className="font-mono font-semibold tracking-tight text-white">
            bugbrawl<span className="opacity-50">.sh</span>
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-[#00ff41]">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#00ff41] opacity-75 animate-ping" />
            <span className="relative inline-block h-2 w-2 rounded-full bg-[#00ff41]" />
          </span>
          LIVE · 128 arenas open
        </div>
      </div>

      <div className="mt-12 leading-none font-mono text-[#00ff41] select-all whitespace-pre overflow-hidden">
        <pre className="text-[11px] sm:text-[13px] md:text-[15px] tracking-widest opacity-90">
          {`██████╗  ██╗   ██╗  ██████╗      ██████╗  ██████╗   █████╗  ██╗    ██╗ ██╗     
██╔══██╗ ██║   ██║ ██╔════╝      ██╔══██╗ ██╔══██╗ ██╔══██╗ ██║    ██║ ██║     
██████╔╝ ██║   ██║ ██║  ███╗     ██████╔╝ ██████╔╝ ███████║ ██║ █╗ ██║ ██║     
██╔══██╗ ██║   ██║ ██║   ██║     ██╔══██╗ ██╔══██╗ ██╔══██║ ██║███╗██║ ██║     
██████╔╝ ╚██████╔╝ ╚██████╔╝     ██████╔╝ ██║  ██║ ██║  ██║ ╚███╔███╔╝ ███████╗
╚═════╝   ╚═════╝   ╚═════╝      ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═╝  ╚══╝╚══╝  ╚══════╝
┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
Powered by Resky Altaf Adri`}
        </pre>
      </div>
      <p className="font-mono text-[#00ff41] mt-2 ml-1">
        &gt; Debug. Compete. Dominate.
      </p>

      <div className="relative mt-8 h-44 max-w-xl">
        <div className="absolute -top-4 left-0 w-72 bg-[#161b22] border border-[#30363d] rounded-md shadow-2xl overflow-hidden transform -rotate-2 z-10">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#30363d] bg-[#0d1117]">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="ml-2 font-mono text-[11px] opacity-50">player.py</span>
          </div>
          <div className="p-3 font-mono text-[12px] leading-relaxed">
            <span className="text-purple-400">def</span>{' '}
            <span className="text-[#00ff41]">solve</span>(n):
            <br />
            <span className="opacity-50"># TODO: fix off-by-one</span>
            <br />
            <span className="text-purple-400">for</span> i{' '}
            <span className="text-purple-400">in</span>{' '}
            <span className="text-[#00ff41]">range</span>(n
            <span className="opacity-50">+1</span>):
            <br />
            <span className="bg-[#00ff41]/15 text-[#00ff41] px-0.5">
              assert sum(primes(i)) == target
            </span>
          </div>
        </div>
        <div className="absolute top-8 right-0 w-64 bg-[#161b22] border border-[#30363d] rounded-md shadow-2xl overflow-hidden transform rotate-1 z-20">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#30363d] bg-[#0d1117]">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="ml-2 font-mono text-[11px] opacity-50">arena.js</span>
          </div>
          <div className="p-3 font-mono text-[12px] leading-relaxed">
            <span className="text-[#00ff41]">const</span> score ={' '}
            <span className="text-purple-400">await</span>{' '}
            <span className="text-[#00ff41]">judge</span>(sol);
            <br />
            <span className="opacity-50">// latency 12ms · AI scored</span>
            <br />
            <span className="text-purple-400">if</span> (score &gt;{' '}
            <span className="opacity-50">0.95</span>){' '}
            <span className="text-[#00ff41]">promote</span>();
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap gap-3">
          <Pill icon="fa-solid fa-users" text="2,400+ Developers" />
          <Pill icon="fa-solid fa-bug" text="15,000+ Bugs Squashed" />
          <Pill icon="fa-solid fa-robot" text="Real-time AI Scoring" />
        </div>
        <div className="font-mono text-sm opacity-50 flex items-center gap-2">
          <span className="text-[#00ff41]">root@bugbrawl</span>:
          <span className="text-purple-400">~</span>$ ./start_competition.sh{' '}
          <span className="inline-block w-2 h-4 bg-[#00ff41] animate-pulse align-middle" />
        </div>
      </div>
    </section>
  )
}

function Pill({ icon, text }) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-full px-4 py-2 font-mono text-xs flex items-center gap-2">
      <i className={`${icon} text-[#00ff41]`} /> {text}
    </div>
  )
}
