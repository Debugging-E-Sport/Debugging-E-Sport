import { useMemo } from 'react'

export default function PlayerList({ players = [], isLoading = false, emptyMessage = 'No players have joined yet.' }) {
  // Use real players if provided, otherwise fallback to demo data
  const displayPlayers = players.length > 0 ? players : !isLoading ? [
    { id: 1, name: 'ByteHunter', role: 'HOST', level: 42, pts: 3204, status: 'READY' },
    { id: 2, name: 'NullPointer99', role: 'PLAYER', level: 28, pts: 1890, status: 'READY' },
    { id: 3, name: 'SegFaultSlayer', role: 'PLAYER', level: 35, pts: 2450, status: 'READY' },
    { id: 4, name: 'HeapOverflow', role: 'PLAYER', level: 19, pts: 910, status: 'WAIT' },
    { id: 5, name: 'StackSmith', role: 'PLAYER', level: 24, pts: 1320, status: 'WAIT' },
    { id: 6, name: 'RecursiveRey', role: 'PLAYER', level: 31, pts: 1780, status: 'READY' },
  ] : []

  const quotes = useMemo(() => [
    '"It\'s not a bug, it\'s an undocumented feature."',
    '"First, solve the problem. Then, write the code." – John Johnson',
    '"Code is like humor. When you have to explain it, it\'s bad." – Cory House',
    '"Fix the cause, not the symptom." – Steve Maguire',
    '"Make it work, make it right, make it fast." – Kent Beck',
    '"Simplicity is the soul of efficiency." – Austin Freeman'
  ], [])
  
  const randomQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], [quotes])

  const readyCount = displayPlayers.filter(p => p.status === 'READY').length

  // Loading skeleton
  if (isLoading) {
    return (
      <div id="pane-participants" className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 bg-arena-bg border border-arena-border rounded-lg p-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-arena-border/50"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-arena-border/50 rounded"></div>
                <div className="h-2.5 w-16 bg-arena-border/50 rounded"></div>
              </div>
              <div className="h-5 w-14 bg-arena-border/50 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (displayPlayers.length === 0) {
    return (
      <div id="pane-participants" className="p-5">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-arena-green/5 border border-arena-green/20 flex items-center justify-center mb-4">
            <i className="fa-solid fa-user-group text-2xl text-arena-muted"></i>
          </div>
          <p className="font-mono text-sm text-arena-muted mb-1">{emptyMessage}</p>
          <p className="font-mono text-xs text-arena-muted/60">Share the room code to invite players.</p>
        </div>
      </div>
    )
  }

  return (
    <div id="pane-participants" className="p-5">
      {/* Status bar */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs text-arena-muted">
          <span className="text-arena-green font-bold">{readyCount}</span> / {displayPlayers.length} ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="participants-list">
        {displayPlayers.map(p => (
          <div key={p.id || p.name} className="participant-enter flex items-center gap-3 bg-arena-bg border border-arena-border rounded-lg p-3">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold text-lg flex-shrink-0 ${p.role === 'HOST' ? 'border-arena-purple text-arena-purpleLight bg-arena-purple/10' : 'border-arena-border text-arena-green bg-arena-green/10'}`}>
              {(p.name || p.username || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-white block truncate">{p.name || p.username}</span>
                {p.role === 'HOST' && <span className="text-xs font-mono px-1.5 py-0.5 bg-arena-purple/20 text-arena-purpleLight border border-arena-purple/30 rounded">HOST</span>}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {p.role === 'HOST' && <i className="fa-solid fa-star text-yellow-400 text-xs"></i>}
                <span className="font-mono text-xs text-arena-muted">Lv. {p.level || '?'} · {(p.pts || 0).toLocaleString()} pts</span>
              </div>
            </div>
            {p.status === 'READY' ? (
              <span className="ready-badge text-xs font-mono px-2 py-0.5 rounded-full">READY</span>
            ) : (
              <span className="waiting-badge text-xs font-mono px-2 py-0.5 rounded-full">WAIT</span>
            )}
          </div>
        ))}

        {/* Animated Empty Slots */}
        {displayPlayers.length < 8 && (
          <div className="col-span-1 sm:col-span-2 relative flex items-center justify-center gap-4 bg-arena-bg/40 border border-arena-border/60 rounded-lg p-4 h-[72px] overflow-hidden group shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-arena-green/15 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]"></div>
            <div className="w-10 h-10 rounded-full border border-arena-green/40 border-dashed flex items-center justify-center relative z-10 animate-[spin_4s_linear_infinite] shadow-[0_0_10px_rgba(0,255,65,0.2)]">
              <i className="fa-solid fa-code text-arena-green text-sm"></i>
            </div>
            <span className="font-mono text-sm text-arena-green relative z-10 animate-pulse tracking-wide italic">
              {randomQuote}
            </span>
          </div>
        )}
      </div>
      
      {/* Terminal log */}
      <div className="mt-4 bg-arena-bg border border-arena-border rounded-lg p-3 font-mono text-xs space-y-1.5 max-h-28 overflow-y-auto">
        <p><span className="text-arena-muted">09:41:02</span> <span className="text-arena-green">[join]</span> <span className="text-white">RecursiveRey</span> joined the arena</p>
        <p><span className="text-arena-muted">09:40:58</span> <span className="text-arena-green">[join]</span> <span className="text-white">StackSmith</span> joined the arena</p>
        <p><span className="text-arena-muted">09:40:44</span> <span className="text-yellow-400">[status]</span> <span className="text-white">HeapOverflow</span> is not ready</p>
        <p><span className="text-arena-muted">09:40:31</span> <span className="text-arena-green">[ready]</span> <span className="text-white">SegFaultSlayer</span> marked as ready</p>
        <p><span className="text-arena-muted">09:40:12</span> <span className="text-arena-green">[join]</span> <span className="text-white">NullPointer99</span> joined the arena</p>
        <p className="blink-cursor"><span className="text-arena-muted">09:41:10</span> <span className="text-arena-green">[ws]</span> Listening for connections</p>
      </div>
    </div>
  )
}
