import Navbar from '../components/Navbar'
import RoomHeader from '../components/Lobby/RoomHeader'
import LobbyTabs from '../components/Lobby/LobbyTabs'
import JoinRoomCard from '../components/Lobby/JoinRoomCard'
import GameSummaryCard from '../components/Lobby/GameSummaryCard'
import HostActionsCard from '../components/Lobby/HostActionsCard'

export default function LobbyPage() {
  return (
    <div className="text-arena-text min-h-screen grid-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: Room Setup & Participants (col 8) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <RoomHeader />
            <LobbyTabs />
          </div>

          {/* RIGHT SIDEBAR (col 4) */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            <JoinRoomCard />
            <GameSummaryCard />
            <HostActionsCard />
          </div>
        </div>
      </main>
    </div>
  )
}
