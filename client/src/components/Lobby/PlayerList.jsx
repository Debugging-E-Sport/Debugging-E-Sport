export default function PlayerList() {
  const players = [
    { id: 1, name: 'ByteHunter', role: 'HOST', avatar: 'avatar-2.jpg', level: 42, pts: 3204, status: 'READY' },
    { id: 2, name: 'NullPointer99', role: 'PLAYER', avatar: 'avatar-5.jpg', level: 28, pts: 1890, status: 'READY' },
    { id: 3, name: 'SegFaultSlayer', role: 'PLAYER', avatar: 'avatar-3.jpg', level: 35, pts: 2450, status: 'READY' },
    { id: 4, name: 'HeapOverflow', role: 'PLAYER', avatar: 'avatar-6.jpg', level: 19, pts: 910, status: 'WAIT' },
    { id: 5, name: 'StackSmith', role: 'PLAYER', avatar: 'avatar-4.jpg', level: 24, pts: 1320, status: 'WAIT' },
    { id: 6, name: 'RecursiveRey', role: 'PLAYER', avatar: 'avatar-7.jpg', level: 31, pts: 1780, status: 'READY' },
  ]

  return (
    <div id="pane-participants" className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="participants-list">
        {players.map(p => (
          <div key={p.id} className="participant-enter flex items-center gap-3 bg-arena-bg border border-arena-border rounded-lg p-3">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold text-lg flex-shrink-0 ${p.role === 'HOST' ? 'border-arena-purple text-arena-purpleLight bg-arena-purple/10' : 'border-arena-border text-arena-green bg-arena-green/10'}`}>
              {p.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-white block truncate">{p.name}</span>
                {p.role === 'HOST' && <span className="text-xs font-mono px-1.5 py-0.5 bg-arena-purple/20 text-arena-purpleLight border border-arena-purple/30 rounded">HOST</span>}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {p.role === 'HOST' && <i className="fa-solid fa-star text-yellow-400 text-xs"></i>}
                <span className="font-mono text-xs text-arena-muted">Lv. {p.level} · {p.pts.toLocaleString()} pts</span>
              </div>
            </div>
            {p.status === 'READY' ? (
              <span className="ready-badge text-xs font-mono px-2 py-0.5 rounded-full">READY</span>
            ) : (
              <span className="waiting-badge text-xs font-mono px-2 py-0.5 rounded-full">WAIT</span>
            )}
          </div>
        ))}
        {/* Animated Empty Slots (Scanner Card) */}
        <div className="relative flex items-center justify-center gap-3 bg-arena-bg/40 border border-arena-border/60 rounded-lg p-3 h-[72px] overflow-hidden group shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
          {/* Efek radar berjalan */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-arena-green/15 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]"></div>
          <div className="w-10 h-10 rounded-full border border-arena-green/40 border-dashed flex items-center justify-center relative z-10 animate-[spin_4s_linear_infinite] shadow-[0_0_10px_rgba(0,255,65,0.2)]">
            <i className="fa-solid fa-crosshairs text-arena-green text-sm"></i>
          </div>
          <span className="font-mono text-xs text-arena-green relative z-10 animate-pulse tracking-widest">SEARCHING_FOR_CHALLENGERS...</span>
        </div>
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
