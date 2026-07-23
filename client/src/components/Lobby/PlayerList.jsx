import { useMemo } from 'react'

export default function PlayerList({ players = [], isLoading = false, emptyMessage = 'No players have joined yet.' }) {
  const quotes = useMemo(() => [
    '"It\'s not a bug, it\'s an undocumented feature."',
    '"First, solve the problem. Then, write the code." – John Johnson',
    '"Code is like humor. When you have to explain it, it\'s bad." – Cory House',
    '"Fix the cause, not the symptom." – Steve Maguire',
    '"Make it work, make it right, make it fast." – Kent Beck',
    '"Simplicity is the soul of efficiency." – Austin Freeman'
  ], [])

  const randomQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], [quotes])

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
  if (players.length === 0) {
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
          <span className="text-arena-green font-bold">{players.length}</span> player{players.length !== 1 ? 's' : ''} in room
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="participants-list">
        {players.map((p) => (
          <div key={p.id || p.username} className="participant-enter flex items-center gap-3 bg-arena-bg border border-arena-border rounded-lg p-3">
            <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold text-lg flex-shrink-0 border-arena-border text-arena-green bg-arena-green/10">
              {(p.username || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-mono text-sm font-semibold text-white block truncate">{p.username}</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-arena-green/10 text-arena-green border border-arena-green/30">IN ROOM</span>
          </div>
        ))}

        {/* Animated Empty Slots */}
        {players.length < 8 && (
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
        {players.map((p, i) => (
          <p key={p.id || i}>
            <span className="text-arena-muted">--:--:--</span>{' '}
            <span className="text-arena-green">[join]</span>{' '}
            <span className="text-white">{p.username}</span> joined the arena
          </p>
        ))}
        <p className="blink-cursor">
          <span className="text-arena-muted">--:--:--</span>{' '}
          <span className="text-arena-green">[ws]</span>{' '}
          Listening for connections — {players.length} player{players.length !== 1 ? 's' : ''} connected
        </p>
      </div>
    </div>
  )
}
