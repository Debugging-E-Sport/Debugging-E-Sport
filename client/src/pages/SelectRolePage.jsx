import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import HostRoomCard from '../components/Lobby/HostRoomCard'
import JoinRoomCard from '../components/Lobby/JoinRoomCard'

function GlobalStatsPanel() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-arena-panel border border-arena-border rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-arena-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="text-arena-purpleLight text-3xl mb-2"><i className="fa-solid fa-fire"></i></div>
        <div className="font-mono font-bold text-white text-3xl tracking-tight">42</div>
        <div className="font-mono text-[10px] text-arena-muted uppercase tracking-wider mt-2 font-bold">Active Arenas</div>
      </div>
      <div className="bg-arena-panel border border-arena-border rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-arena-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="text-arena-green text-3xl mb-2"><i className="fa-solid fa-code-commit"></i></div>
        <div className="font-mono font-bold text-white text-3xl tracking-tight">12.4K</div>
        <div className="font-mono text-[10px] text-arena-muted uppercase tracking-wider mt-2 font-bold">Lines Fixed</div>
      </div>
    </div>
  )
}

function TerminalLiveFeed() {
  const [logs, setLogs] = useState([
    "> [SYS] System initialized",
    "> [NET] Connecting to Global Network...",
    "> [NET] Connection established. Latency: 12ms",
  ])

  useEffect(() => {
    const messages = [
      "> [AI] Bug #402 resolved by player 'Cipher' in 14.2s",
      "> [SYS] Arena BX-2UQF created by host",
      "> [NET] Player 'Dope' connected from Region AP-SE",
      "> [MATCH] Team Alpha just scored 500pts",
      "> [SYS] Daily challenge 'Memory Leak' updated",
      "> [WARN] High CPU usage detected in sandbox #4",
      "> [AI] Analyzing code quality for player 'ZeroDay'",
      "> [NET] Node 12 synced successfully"
    ]
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, messages[Math.floor(Math.random() * messages.length)]]
        // Keep only last 8 logs
        if (newLogs.length > 8) return newLogs.slice(newLogs.length - 8)
        return newLogs
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#0a0a0a] border border-arena-border rounded-xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.7)] relative overflow-hidden">
      {/* Fake scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-4 border-b border-arena-border/50 pb-3 relative z-10">
        <i className="fa-solid fa-terminal text-arena-green text-sm"></i>
        <h3 className="font-mono text-sm font-bold text-white">System Logs</h3>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-arena-green shadow-[0_0_5px_rgba(0,255,65,0.5)]"></div>
        </div>
      </div>
      <div className="font-mono text-[11px] text-arena-muted flex flex-col gap-2 h-[220px] overflow-hidden relative z-10 leading-relaxed">
        {logs.map((log, i) => (
          <div 
            key={i} 
            className={`transition-all duration-300 ${i === logs.length - 1 ? 'text-arena-green font-bold translate-x-1' : ''}`}
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SelectRolePage() {
  return (
    <div className="text-arena-text min-h-screen bg-arena-bg relative flex flex-col overflow-x-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-arena-green/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-arena-purple/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <Navbar />
      
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-12 lg:py-20 flex items-center justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 w-full max-w-6xl">
          
          {/* LEFT COLUMN: Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-arena-green/10 border border-arena-green/20 rounded-full text-arena-green font-mono text-[10px] uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-green animate-pulse"></span>
                Global Network Online
              </div>
              <h1 className="font-mono text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Select Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-arena-green to-arena-purpleLight">Battle Role</span>
              </h1>
              <p className="text-arena-muted font-mono text-sm leading-relaxed max-w-md">
                Enter the ultimate E-Sport coding arena. Host a private match for your team, or join an active battlefield to squash bugs and climb the leaderboard.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Host Option */}
              <div className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,255,65,0.15)] rounded-2xl">
                <HostRoomCard />
              </div>

              {/* Join Option */}
              <div className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(157,78,221,0.15)] rounded-2xl">
                <JoinRoomCard />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Atmosphere/Stats (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-8 hidden md:flex">
            <GlobalStatsPanel />
            <TerminalLiveFeed />
          </div>

        </div>
      </main>
    </div>
  )
}
