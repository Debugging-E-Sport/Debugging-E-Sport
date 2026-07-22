import { useState } from 'react'
import { useRoom } from '../../context/RoomContext'

export default function JoinRoomCard() {
  const [code, setCode] = useState('')
  const { joinRoom, isLoading, error } = useRoom()
  
  return (
    <div id="join-card" className="bg-arena-panel border border-arena-green/30 rounded-xl p-5 glow-green">
      <div className="flex items-center gap-2 mb-4">
        <i className="fa-solid fa-door-open text-arena-green"></i>
        <h3 className="font-mono text-sm font-bold text-white">Join a Room</h3>
      </div>
      <label className="block font-mono text-xs text-arena-green mb-2">// enter room code</label>
      <div className="relative mb-3">
        <input 
          type="text" 
          placeholder="BX-XXXX" 
          maxLength="7"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full bg-arena-bg border border-arena-border rounded-lg px-4 py-3 font-mono text-xl text-center text-white tracking-widest placeholder-arena-muted focus:outline-none focus:border-arena-green focus:shadow-[0_0_0_3px_rgba(0,255,65,0.1)] transition-all uppercase" 
        />
      </div>
      {error && <p className="text-red-400 text-xs font-mono mb-3 text-center">{error}</p>}
      <button 
        onClick={() => joinRoom(code)}
        disabled={isLoading || code.length < 6}
        className="w-full start-btn text-black font-mono font-bold text-sm py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <i className="fa-solid fa-spinner fa-spin text-xs"></i>
        ) : (
          <i className="fa-solid fa-play text-xs"></i>
        )}
        {isLoading ? 'JOINING...' : 'JOIN ARENA'}
      </button>
    </div>
  )
}
