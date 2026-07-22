import { useState, useEffect } from 'react'

export default function GameHeader({ roomCode, user }) {
  const [timeLeft, setTimeLeft] = useState(67) // mock time
  const total = 90
  const isUrgent = timeLeft <= 20
  
  useEffect(() => {
    const ti = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(ti)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(ti)
  }, [])

  const pct = timeLeft / total
  const circumference = 264
  const strokeDashoffset = circumference * (1 - pct)

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <header className="border-b border-arena-border bg-arena-bg/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 py-2.5 flex items-center gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2 mr-2">
          <span className="font-mono text-arena-green">⌘</span>
          <span className="font-mono font-bold text-white text-sm">
            bugbrawl<span className="text-arena-muted">.sh</span>
          </span>
        </div>

        {/* Round indicator */}
        <div className="flex items-center gap-2 bg-arena-panel border border-arena-border rounded-lg px-3 py-1.5 hidden md:flex">
          <span className="font-mono text-xs text-arena-muted">ROUND</span>
          <span className="font-mono text-sm font-bold text-white">3</span>
          <span className="text-arena-border">/</span>
          <span className="font-mono text-sm text-arena-muted">5</span>
        </div>

        {/* Progress bar */}
        <div className="flex-1 max-w-xs hidden sm:block">
          <div className="w-full bg-arena-border rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-gradient-to-r from-arena-purple to-arena-green" style={{ width: '60%' }}></div>
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
                style={{ strokeDashoffset }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-mono text-sm font-bold ${isUrgent ? 'text-arena-red' : 'text-arena-green'}`}>
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

        {/* Difficulty + room */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-2 py-1 rounded-full hidden lg:inline-block difficulty-badge medium">MEDIUM</span>
          <div className="flex items-center gap-2 font-mono text-xs text-arena-green">
            <span className="relative inline-flex h-2 w-2">
              <span className="live-dot absolute"></span>
              <span className="relative inline-block h-2 w-2 rounded-full bg-arena-green"></span>
            </span>
            {roomCode}
          </div>
          {/* User */}
          <div className="w-8 h-8 rounded-full border border-arena-border bg-arena-panel flex items-center justify-center text-xs font-bold text-white uppercase">
            {user?.username?.charAt(0) || '?'}
          </div>
        </div>
      </div>
    </header>
  )
}
