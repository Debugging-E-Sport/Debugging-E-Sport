import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useRoom } from '../context/RoomContext'
import { useAuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import RoomHeader from '../components/Lobby/RoomHeader'
import LobbyTabs from '../components/Lobby/LobbyTabs'
import GameSummaryCard from '../components/Lobby/GameSummaryCard'
import HostActionsCard from '../components/Lobby/HostActionsCard'
import GameView from '../components/Game/GameView'

export default function ArenaLobbyPage() {
  const { code } = useParams()
  const { currentRoom, fetchRoom, isLoading } = useRoom()
  const { user } = useAuthContext()

  useEffect(() => {
    if (!currentRoom || currentRoom.code !== code) {
      fetchRoom(code)
    }
  }, [code, currentRoom, fetchRoom])

  if (isLoading || !currentRoom) {
    return (
      <div className="text-arena-text min-h-screen grid-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-arena-green"></i>
        </div>
      </div>
    )
  }

  const isHost = user?.id === currentRoom.host_id

  if (currentRoom.status === 'playing') {
    return <GameView roomCode={currentRoom.code} user={user} />
  }

  return (
    <div className="text-arena-text min-h-screen grid-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: Room Setup & Participants (col 8) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <RoomHeader roomCode={currentRoom.code} hostName={currentRoom.host_username || 'Host'} />
            <LobbyTabs />
          </div>

          {/* RIGHT SIDEBAR (col 4) */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            <GameSummaryCard />
            <HostActionsCard roomCode={currentRoom.code} />
          </div>
        </div>
      </main>
    </div>
  )
}
