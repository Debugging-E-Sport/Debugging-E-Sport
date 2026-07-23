import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { useSocket } from '../../context/SocketContext'
import { useAuthContext } from '../../context/AuthContext'

export default function GameHeader({ roomCode }) {
  const { user } = useAuthContext()
  const { isConnected, currentRound, totalRounds, timeLeft, gameState } = useSocket()
  const isUrgent = timeLeft <= 10
  const total = 30 // fallback; timeLimit comes from server

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const circumference = 264
  const pct = total > 0 ? timeLeft / total : 0
  const strokeDashoffset = circumference * (1 - Math.min(pct, 1))

  const roundProgress = totalRounds > 0 ? `${currentRound}/${totalRounds}` : '—'

  return (
    <header className="border-b border-arena-border bg-arena-bg/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 py-2.5 flex items-center gap-4">
        
        {/* Brand */}
        <Link 
          to="/select/role" 
          className="flex items-center gap-2 mr-2 group hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="font-mono text-arena-green text-lg group-hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.8)] transition-all">⌘</span>
          <span className="font-mono font-bold text-white text-sm tracking-tight">
            bugbrawl<span className="text-arena-muted">.sh</span>
          </span>
        </Link>

        {/* Round indicator */}
        <div className="flex items-center gap-2 bg-arena-panel border border-arena-border rounded-lg px-3 py-1.5 hidden md:flex">
          <span className="font-mono text-xs text-arena-muted">ROUND</span>
          <span className="font-mono text-sm font-bold text-white">{roundProgress}</span>
        </div>

        {/* Progress bar */}
        <div className="flex-1 max-w-xs hidden sm:block">
          <div className="w-full bg-arena-border rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full bg-gradient-to-r from-arena-purple to-arena-green transition-all duration-1000" 
              style={{ width: totalRounds > 0 ? `${(currentRound / totalRounds) * 100}%` : '0%' }}
            />
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* TIMER (center) */}
        <div className="flex items-center gap-3">
          <div className={`relative w-12 h-12 ${isUrgent ? 'timer-urgent' : ''}`}>
            <svg className="timer-ring absolute inset-0" width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#30363d" strokeWidth="3" />
              <circle 
                className="timer-circle" 
                cx="24" 
                cy="24" 
                r="20" 
                fill="none" 
                stroke={isUrgent ? '#f85149' : '#00ff41'} 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-mono text-sm font-bold ${isUrgent ? 'text-red-500' : 'text-arena-green'}`}>
                {timeLeft}
              </span>
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="font-mono text-xs text-arena-muted">Time left</p>
            <p className="font-mono text-sm font-bold text-white">{formatTime(timeLeft)}</p>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Room & User */}
        <div className="flex items-center gap-5">
          {/* Room Code */}
          <div className="flex items-center gap-2 font-mono text-xs text-arena-green bg-arena-green/5 border border-arena-green/20 px-3 py-1.5 rounded-lg shadow-[inset_0_0_8px_rgba(0,255,65,0.1)]">
            <span className="relative inline-flex h-2 w-2 mr-1">
              <span className="live-dot absolute"></span>
              <span className={`relative inline-block h-2 w-2 rounded-full ${isConnected ? 'bg-arena-green' : 'bg-red-500'}`}></span>
            </span>
            {roomCode}
          </div>
          
          {/* User */}
          <div className="hidden md:flex items-center gap-3 border-l border-arena-border pl-5">
            <div className="w-8 h-8 rounded-full border border-arena-border bg-arena-panel flex flex-shrink-0 items-center justify-center font-mono font-bold text-arena-green text-sm">
              {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
            <span className="font-mono text-sm text-white">{user?.username || 'Guest'}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
