export default function GameSummaryCard() {
  return (
    <div id="game-summary" className="bg-arena-panel border border-arena-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <i className="fa-solid fa-circle-info text-arena-purpleLight"></i>
        <h3 className="font-mono text-sm font-bold text-white">Game Info</h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-arena-border">
          <span className="font-mono text-xs text-arena-muted">Difficulty</span>
          <span className="difficulty-badge medium font-mono text-xs px-2 py-0.5 rounded-full">MEDIUM</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-arena-border">
          <span className="font-mono text-xs text-arena-muted">Questions</span>
          <span className="font-mono text-sm text-white">5 rounds</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-arena-border">
          <span className="font-mono text-xs text-arena-muted">Time / Round</span>
          <span className="font-mono text-sm text-white">90 seconds</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-arena-border">
          <span className="font-mono text-xs text-arena-muted">Language</span>
          <span className="font-mono text-sm text-white">JavaScript</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="font-mono text-xs text-arena-muted">Scoring</span>
          <span className="font-mono text-xs text-arena-purpleLight flex items-center gap-1">
            <i className="fa-solid fa-robot text-xs"></i> AI Powered
          </span>
        </div>
      </div>
    </div>
  )
}
