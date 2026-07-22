import Navbar from '../components/Navbar'
import HostRoomCard from '../components/Lobby/HostRoomCard'
import JoinRoomCard from '../components/Lobby/JoinRoomCard'

export default function SelectRolePage() {
  return (
    <div className="text-arena-text min-h-screen grid-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="text-center mb-10">
          <h1 className="font-mono text-3xl font-bold text-white mb-2">Select Your Role</h1>
          <p className="text-arena-muted font-mono text-sm">Do you want to host an arena or join an existing one?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
          {/* Host Option */}
          <div className="transform transition-transform hover:-translate-y-2">
            <HostRoomCard />
          </div>

          {/* Join Option */}
          <div className="transform transition-transform hover:-translate-y-2">
            <JoinRoomCard />
          </div>
        </div>
      </main>
    </div>
  )
}
