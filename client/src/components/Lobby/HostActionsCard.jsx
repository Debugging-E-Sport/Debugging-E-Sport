import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useRoom } from '../../context/RoomContext'
import { api } from '../../api/client'

export default function HostActionsCard({ roomCode }) {
  const { currentRoom } = useRoom()
  const navigate = useNavigate()
  const [isStarting, setIsStarting] = useState(false)

  const handleStart = async () => {
    setIsStarting(true)
    try {
      await api.post(`/rooms/${roomCode}/start`)
      // Navigate to game page - connect to socket there
      navigate(`/game/${roomCode}`, { replace: true })
    } catch (err) {
      console.error('Failed to start game:', err)
    } finally {
      setIsStarting(false)
    }
  }

  const playerCount = currentRoom?.players?.length || 0

  return (
    <>
      {/* Start Button (Host only) */}
      <div id="host-actions" className="bg-arena-panel border border-arena-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-arena-muted">
            Players: <span className="text-arena-green font-bold">{playerCount}</span>
          </span>
          <span className="font-mono text-xs text-arena-muted">Min: 2 players</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-arena-bg rounded-full h-1.5 mb-4">
          <div className="bg-arena-green h-1.5 rounded-full transition-all" style={{ width: `${Math.min(playerCount / 6 * 100, 100)}%` }}></div>
        </div>
        <button 
          className="start-btn w-full text-black font-mono font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 text-sm cursor-pointer shadow-[0_0_20px_rgba(0,255,65,0.4)] hover:shadow-[0_0_30px_rgba(0,255,65,0.8)] hover:scale-[1.02] transition-all"
          onClick={handleStart}
          disabled={isStarting || playerCount < 2}
        >
          {isStarting ? (
            <>
              <i className="fa-solid fa-spinner fa-spin text-xs"></i> STARTING...
            </>
          ) : (
            <>
              <i className="fa-solid fa-rocket text-xs"></i> START GAME
            </>
          )}
        </button>
        <p className="font-mono text-xs text-arena-muted text-center mt-2">
          {playerCount < 2 ? `Need at least 2 players (${playerCount} joined)` : `${playerCount} players in room · Ready to start`}
        </p>
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
