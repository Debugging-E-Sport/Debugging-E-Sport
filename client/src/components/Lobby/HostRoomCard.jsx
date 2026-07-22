import { useRoom } from '../../context/RoomContext'

export default function HostRoomCard() {
  const { createRoom, isLoading } = useRoom()

  return (
    <div className="bg-arena-panel border border-arena-purple/30 rounded-xl p-5 glow-purple flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <i className="fa-solid fa-server text-arena-purpleLight"></i>
        <h3 className="font-mono text-sm font-bold text-white">Host a Room</h3>
      </div>
      
      <div className="flex-1 flex flex-col justify-center mb-6">
        <p className="font-mono text-xs text-arena-muted mb-2 text-center">
          // create a new arena
        </p>
        <p className="text-center text-sm text-arena-text">
          Configure rules, time limits, and invite participants to a private debugging arena.
        </p>
      </div>

      <button 
        onClick={createRoom}
        disabled={isLoading}
        className="w-full bg-arena-purple hover:bg-arena-purpleLight text-white font-mono font-bold text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <i className="fa-solid fa-spinner fa-spin text-xs"></i>
        ) : (
          <i className="fa-solid fa-plus text-xs"></i>
        )}
        {isLoading ? 'CREATING...' : 'CREATE ARENA'}
      </button>
    </div>
  )
}
