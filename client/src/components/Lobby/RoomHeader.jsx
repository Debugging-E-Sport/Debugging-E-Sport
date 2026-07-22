import { useState } from 'react'

export default function RoomHeader({ roomCode = 'BX-7291', hostName = 'ByteHunter' }) {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div id="room-header" className="bg-arena-panel border border-arena-border rounded-xl p-6 glow-green">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-arena-green text-xs">// room active</span>
            <span className="ready-badge text-xs font-mono px-2 py-0.5 rounded-full">● OPEN</span>
          </div>
          <h1 className="font-mono text-2xl font-bold text-white">Debug Arena #{roomCode.split('-')[1] || '0000'}</h1>
          <p className="text-arena-muted text-sm mt-1">
            Hosted by <span className="text-arena-green font-medium">{hostName}</span> · Waiting for players to join...
          </p>
        </div>
        {/* Room Code */}
        <div className="bg-arena-bg border border-arena-border rounded-lg p-4 text-center min-w-[180px]">
          <p className="font-mono text-xs text-arena-muted mb-1">// room code</p>
          <div className="flex items-center justify-center gap-2">
            <span id="room-code" className="font-mono text-3xl font-bold text-arena-green tracking-widest">
              {roomCode}
            </span>
            <button 
              onClick={copyCode} 
              className="copy-btn text-arena-muted transition-colors ml-1 cursor-pointer" 
              title="Copy code"
            >
              <i className={`fa-solid ${copied ? 'fa-check text-arena-green' : 'fa-copy'} text-sm`}></i>
            </button>
          </div>
          <p className="font-mono text-xs text-arena-muted mt-1">Share with participants</p>
        </div>
      </div>
    </div>
  )
}
