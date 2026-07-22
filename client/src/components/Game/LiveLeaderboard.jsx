export default function LiveLeaderboard() {
  return (
    <section id="leaderboard-panel" className="space-y-6">
      {/* Leaderboard card */}
      <div className="bg-arena-panel border border-arena-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-arena-border">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-trophy text-yellow-400 text-sm"></i>
            <span className="font-mono text-sm font-bold text-white">Leaderboard</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-arena-green">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="live-dot absolute"></span>
              <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-arena-green"></span>
            </span>
            LIVE
          </div>
        </div>

        <div className="divide-y divide-arena-border" id="lb-list">
          {/* Rank 1 */}
          <div className="flex items-center gap-3 px-4 py-3 bg-yellow-400/5">
            <span className="font-mono text-sm font-bold rank-1 w-5 text-center">1</span>
            <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" className="w-8 h-8 rounded-full border-2 border-yellow-400/50" alt="avatar" />
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs font-bold text-white truncate">NullPointer99</p>
              <p className="font-mono text-xs text-arena-muted">Round 3 ✓</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-bold text-arena-green">524</p>
              <p className="font-mono text-xs text-arena-muted">pts</p>
            </div>
          </div>
          {/* Rank 2 (YOU) */}
          <div className="flex items-center gap-3 px-4 py-3 bg-arena-green/5 border-l-2 border-arena-green">
            <span className="font-mono text-sm font-bold rank-2 w-5 text-center">2</span>
            <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" className="w-8 h-8 rounded-full border-2 border-arena-green/50" alt="avatar" />
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs font-bold text-white truncate">ByteHunter</p>
              <p className="font-mono text-xs text-arena-green">● You</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-bold text-arena-green score-flash" id="my-score">487</p>
              <p className="font-mono text-xs text-arena-muted">pts</p>
            </div>
          </div>
          {/* Rank 3 */}
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="font-mono text-sm font-bold rank-3 w-5 text-center">3</span>
            <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg" className="w-8 h-8 rounded-full border border-arena-border" alt="avatar" />
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs font-bold text-white truncate">StackSmith</p>
              <p className="font-mono text-xs text-arena-muted">Round 3 ✓</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-bold text-white">401</p>
              <p className="font-mono text-xs text-arena-muted">pts</p>
            </div>
          </div>
          {/* Rank 4 */}
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="font-mono text-sm text-arena-muted w-5 text-center">4</span>
            <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" className="w-8 h-8 rounded-full border border-arena-border" alt="avatar" />
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs font-bold text-white truncate">SegFaultSlayer</p>
              <p className="font-mono text-xs text-arena-muted">Typing...</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-bold text-white">388</p>
              <p className="font-mono text-xs text-arena-muted">pts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Other players' status (Moved from AnswerPanel) */}
      <div className="bg-arena-panel border border-arena-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs font-bold text-white">Live Progress</span>
          <div className="flex items-center gap-1.5 font-mono text-xs text-arena-green">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="live-dot absolute"></span>
              <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-arena-green"></span>
            </span>
            WebSocket
          </div>
        </div>
        <div className="space-y-3 mt-4">
          {/* Players */}
          <div className="flex items-center gap-3">
            <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" className="w-7 h-7 rounded-full border border-arena-border flex-shrink-0" alt="avatar" />
            <span className="font-mono text-xs text-white flex-1 truncate">NullPointer99</span>
            <div className="flex-1 max-w-[80px]">
              <div className="w-full bg-arena-border rounded-full h-1"><div className="h-1 bg-arena-green rounded-full shadow-[0_0_5px_rgba(0,255,65,0.8)]" style={{ width: '100%' }}></div></div>
            </div>
            <span className="font-mono text-[10px] text-arena-green flex-shrink-0 animate-pulse">Submitted</span>
          </div>
          <div className="flex items-center gap-3">
            <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" className="w-7 h-7 rounded-full border border-arena-border flex-shrink-0" alt="avatar" />
            <span className="font-mono text-xs text-white flex-1 truncate">SegFaultSlayer</span>
            <div className="flex-1 max-w-[80px]">
              <div className="w-full bg-arena-border rounded-full h-1"><div className="h-1 bg-yellow-400 rounded-full" style={{ width: '70%' }}></div></div>
            </div>
            <span className="font-mono text-[10px] text-yellow-400 flex-shrink-0 animate-pulse">Typing...</span>
          </div>
          <div className="flex items-center gap-3">
            <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg" className="w-7 h-7 rounded-full border border-arena-border flex-shrink-0" alt="avatar" />
            <span className="font-mono text-xs text-white flex-1 truncate">HeapOverflow</span>
            <div className="flex-1 max-w-[80px]">
              <div className="w-full bg-arena-border rounded-full h-1"><div className="h-1 bg-arena-border rounded-full" style={{ width: '20%' }}></div></div>
            </div>
            <span className="font-mono text-[10px] text-arena-muted flex-shrink-0">Thinking</span>
          </div>
        </div>
      </div>

    </section>
  )
}
