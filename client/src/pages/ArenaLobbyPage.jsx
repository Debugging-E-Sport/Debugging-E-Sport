import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useRoom } from '../context/RoomContext'
import { useAuthContext } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import { useToast } from '../context/ToastContext'
import Navbar from '../components/Navbar'
import RoomHeader from '../components/Lobby/RoomHeader'
import LobbyTabs from '../components/Lobby/LobbyTabs'
import GameSummaryCard from '../components/Lobby/GameSummaryCard'
import HostActionsCard from '../components/Lobby/HostActionsCard'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function ArenaLobbyPage() {
  const { code } = useParams()
  const { currentRoom, fetchRoom, isLoading, error } = useRoom()
  const { user } = useAuthContext()
  const { connect, players, isConnected, leaveGame } = useSocket()
  const toast = useToast()

  useEffect(() => {
    if (!currentRoom || currentRoom.code !== code) {
      fetchRoom(code)
    }
  }, [code, currentRoom, fetchRoom])

  // Connect to socket when room loads
  useEffect(() => {
    if (!code) return
    const cleanup = connect(code)
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup()
      }
      leaveGame(code)
    }
  }, [code])

  // Show error via toast
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error, toast])

  // Loading state
  if (isLoading) {
    return (
      <div className="text-arena-text min-h-screen grid-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-arena-green/10 border-2 border-arena-green/30 flex items-center justify-center">
              <i className="fa-solid fa-spinner fa-spin text-2xl text-arena-green"></i>
            </div>
            <p className="font-mono text-sm text-arena-muted">Loading room...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state (room not found, etc.)
  if (error && !currentRoom) {
    return (
      <div className="text-arena-text min-h-screen grid-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-arena-panel border border-red-500/30 rounded-xl p-8 max-w-md w-full text-center shadow-[0_0_30px_rgba(248,81,73,0.1)]">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-circle-xmark text-2xl text-red-400"></i>
            </div>
            <h2 className="font-mono text-xl font-bold text-white mb-2">Room Error</h2>
            <p className="font-mono text-sm text-red-400/80 mb-6">{error}</p>
            <p className="font-mono text-xs text-arena-muted">
              Redirecting to lobby...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!currentRoom) return null

  const isHost = user?.id === currentRoom.host_id

  return (
    <div className="text-arena-text min-h-screen grid-bg">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Socket connection status indicator */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]' : 'bg-red-400'}`}></span>
          <span className="font-mono text-xs text-arena-muted">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {/* LEFT: Room Setup & Participants (col 8) */}
          <div className="col-span-12 lg:col-span-8 space-y-4 sm:space-y-6">
            <RoomHeader roomCode={currentRoom.code} hostName={currentRoom.host_username || 'Host'} />
            <LobbyTabs players={players} isConnected={isConnected} />
          </div>

          {/* RIGHT SIDEBAR (col 4) */}
          <div className="col-span-12 lg:col-span-4 space-y-4 sm:space-y-5">
            <GameSummaryCard />
            <HostActionsCard roomCode={currentRoom.code} />
          </div>
        </div>
      </main>
    </div>
  )
}
