export default function HostActionsCard({ roomCode }) {
  return (
    <>
      {/* Start Button (Host only) */}
      <div id="host-actions" className="bg-arena-panel border border-arena-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-arena-muted">Ready: <span className="text-arena-green font-bold">4</span>/6</span>
          <span className="font-mono text-xs text-arena-muted">Min: 2 players</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-arena-bg rounded-full h-1.5 mb-4">
          <div className="bg-arena-green h-1.5 rounded-full transition-all" style={{ width: '66%' }}></div>
        </div>
        <button 
          className="start-btn w-full text-black font-mono font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
          onClick={() => {
            fetch(`/api/rooms/${roomCode}/start`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('bugbrawl_auth') || '{}').token}`
              }
            }).catch(console.error)
          }}
        >
          <i className="fa-solid fa-rocket text-xs"></i> START GAME
        </button>
        <p className="font-mono text-xs text-arena-muted text-center mt-2">4/6 players ready · Can start now</p>
      </div>

      {/* AI Scoring badge */}
      <div className="bg-arena-panel border border-arena-purple/30 rounded-xl p-4 glow-purple">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-arena-purple/20 border border-arena-purple/30 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-robot text-arena-purpleLight text-sm"></i>
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-arena-purpleLight">AI Scoring Active</p>
            <p className="text-xs text-arena-muted mt-0.5 leading-relaxed">
              Every answer is analyzed and scored in real-time by our AI engine. Accuracy, reasoning, and speed all count.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
