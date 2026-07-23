import { useState } from 'react'
import { useRoom } from '../../context/RoomContext'
import { useToast } from '../../context/ToastContext'

export default function JoinRoomCard() {
  const [code, setCode] = useState('')
  const { joinRoom, isLoading, error } = useRoom()
  const toast = useToast()

  const handleJoin = async () => {
    if (code.length < 6) {
      toast.warning('Room code must be 6 characters (e.g. BX-XXXX)')
      return
    }
    try {
      await joinRoom(code)
    } catch {
      // Error handled by RoomContext
    }
  }
  
  return (
    <div id="join-card" className="bg-arena-panel border border-arena-green/30 rounded-xl p-5 glow-green flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <i className="fa-solid fa-door-open text-arena-green"></i>
        <h3 className="font-mono text-sm font-bold text-white">Join a Room</h3>
      </div>
      
      <div className="flex-1 flex flex-col justify-center mb-6">
        <label className="block font-mono text-xs text-arena-green mb-2">// enter room code</label>
        <div className="relative">
          <input 
            type="text" 
            placeholder="BX-XXXX" 
            maxLength="7"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className={`w-full bg-arena-bg border rounded-lg px-4 py-3 font-mono text-xl text-center text-white tracking-widest placeholder-arena-muted focus:outline-none transition-all uppercase ${
              error
                ? 'border-red-500/50 focus:border-red-400'
                : 'border-arena-border focus:border-arena-green focus:shadow-[0_0_0_3px_rgba(0,255,65,0.1)]'
            }`}
          />
        </div>
        <div className="min-h-[1.5rem] mt-2">
          {error && (
            <p className="text-red-400 text-xs font-mono text-center animate-[slideInUp_0.3s_ease-out]">
              {error}
            </p>
          )}
        </div>
      </div>
      <button 
        onClick={handleJoin}
        disabled={isLoading || code.length < 6}
        className="w-full start-btn text-black font-mono font-bold text-sm py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin text-xs"></i>
            JOINING...
          </>
        ) : (
          <>
            <i className="fa-solid fa-play text-xs"></i>
            JOIN ARENA
          </>
        )}
      </button>
    </div>
  )
}
