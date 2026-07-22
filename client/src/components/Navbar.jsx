import { useAuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuthContext()

  return (
    <header className="border-b border-arena-border bg-arena-bg/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-arena-green text-lg">⌘</span>
          <span className="font-mono font-bold text-white">bugbrawl<span className="text-arena-muted">.sh</span></span>
          <span className="text-arena-border">|</span>
          <span className="font-mono text-xs text-arena-muted">Lobby</span>
        </div>
        <div className="flex items-center gap-5">
          {/* Live indicator */}
          <div className="flex items-center gap-2 font-mono text-xs text-arena-green">
            <span className="relative inline-flex h-2 w-2">
              <span className="live-dot absolute"></span>
              <span className="relative inline-block h-2 w-2 rounded-full bg-arena-green"></span>
            </span>
            LIVE · 128 arenas
          </div>
          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-arena-border bg-arena-panel flex flex-shrink-0 items-center justify-center font-mono font-bold text-arena-green text-sm">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'G'}
            </div>
            <span className="font-mono text-sm text-white">{user?.username || 'Guest'}</span>
            <button 
              onClick={logout}
              className="font-mono text-xs px-2 py-0.5 bg-arena-purple/20 text-arena-purpleLight border border-arena-purple/30 rounded-full hover:bg-arena-purple/40 transition-colors cursor-pointer"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
