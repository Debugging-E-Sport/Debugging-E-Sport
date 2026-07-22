import { useAuthContext } from '../context/AuthContext'
import { Link } from 'react-router'

export default function Navbar() {
  const { user, logout } = useAuthContext()

  return (
    <header className="border-b border-arena-border bg-arena-bg/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* LOGO INTERAKTIF */}
        <Link 
          to="/select/role" 
          className="flex items-center gap-3 group hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="font-mono text-arena-green text-lg group-hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.8)] transition-all">⌘</span>
          <span className="font-mono font-bold text-white tracking-tight">
            bugbrawl<span className="text-arena-muted">.sh</span>
          </span>
        </Link>

        {/* USER SECTION */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-arena-border bg-arena-panel flex flex-shrink-0 items-center justify-center font-mono font-bold text-arena-green text-sm">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'G'}
            </div>
            <span className="font-mono text-sm text-white">{user?.username || 'Guest'}</span>
            
            <button 
              onClick={logout}
              title="Logout"
              className="font-mono text-xs px-3 py-1.5 ml-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors cursor-pointer flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span className="hidden sm:inline">LOGOUT</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
