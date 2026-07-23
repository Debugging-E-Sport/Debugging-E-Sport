import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSocket } from '../context/SocketContext'
import { useAuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/Spinner'
import GameView from '../components/Game/GameView'

export default function GamePage() {
  const { code: roomCode } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthContext()
  const { connect, leaveGame, gameState, isConnected } = useSocket()
  const toast = useToast()

  useEffect(() => {
    if (!isAuthenticated || !roomCode) {
      navigate('/login', { replace: true })
      return
    }

    const cleanup = connect(roomCode)

    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup()
      }
    }
  }, [roomCode, isAuthenticated])

  useEffect(() => {
    if (gameState === 'over') {
      navigate(`/game/${roomCode}/over`, { replace: true })
    }
  }, [gameState, roomCode, navigate])

  const handleLeave = () => {
    leaveGame(roomCode)
    navigate('/select/role', { replace: true })
  }

  if (!isAuthenticated || !roomCode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-arena-bg text-arena-text">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-arena-bg">
      {/* Connection status banner */}
      {!isConnected && gameState !== 'idle' && (
        <div className="disconnect-banner bg-red-500/10 border-b border-red-500/30 px-4 py-2 text-center">
          <p className="font-mono text-xs text-red-400">
            <i className="fa-solid fa-plug-circle-xmark mr-1.5"></i>
            Disconnected from server. Trying to reconnect...
          </p>
        </div>
      )}

      {/* Waiting / Connecting state */}
      {gameState === 'idle' && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-arena-green/10 border-2 border-arena-green/30 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-arena-green"></i>
            </div>
            <h1 className="font-mono text-2xl font-bold text-white mb-2">Connecting to Arena</h1>
            <p className="font-mono text-sm text-arena-muted">
              Joining room <span className="text-arena-green font-bold">{roomCode}</span>...
            </p>
          </div>
          <button
            onClick={handleLeave}
            className="font-mono text-sm text-arena-muted hover:text-white border border-arena-border rounded-lg px-6 py-2.5 transition-all cursor-pointer hover:border-arena-green/50"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i> Back to Lobby
          </button>
        </div>
      )}

      {/* Connected / Playing */}
      {(gameState === 'waiting' || gameState === 'playing') && (
        <GameView roomCode={roomCode} user={user} />
      )}
    </div>
  )
}
