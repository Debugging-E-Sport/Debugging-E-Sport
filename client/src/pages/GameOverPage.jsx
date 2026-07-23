import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useSocket } from '../context/SocketContext'
import { useAuthContext } from '../context/AuthContext'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function GameOverPage() {
  const { code: roomCode } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { winner, finalLeaderboard, gameState, leaveGame, isConnected } = useSocket()
  const [confetti, setConfetti] = useState(true)

  useEffect(() => {
    if (confetti) {
      const timer = setTimeout(() => setConfetti(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [confetti])

  // Redirect if not in 'over' state and no data available
  useEffect(() => {
    if (gameState !== 'over' && finalLeaderboard.length === 0) {
      navigate(`/game/${roomCode}`, { replace: true })
    }
  }, [gameState, finalLeaderboard, roomCode, navigate])

  const handleBackToLobby = () => {
    leaveGame(roomCode)
    navigate('/select/role', { replace: true })
  }

  const trophyEmoji = ['🥇', '🥈', '🥉']
  const avatarColors = ['#ffd700', '#c0c0c0', '#cd7f32']
  const confettiColors = ['#00ff41', '#ffd700', '#7c3aed', '#f85149', '#a78bfa', '#ffffff']

  // Loading state — still fetching results
  if (finalLeaderboard.length === 0 && gameState !== 'over') {
    return (
      <div className="min-h-screen bg-arena-bg text-arena-text antialiased grid-bg flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-arena-green/10 border-2 border-arena-green/30 flex items-center justify-center mx-auto">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-arena-green"></i>
            </div>
            <h2 className="font-mono text-xl font-bold text-white">Calculating Results</h2>
            <p className="font-mono text-sm text-arena-muted">Tabulating final scores...</p>
          </div>
        </div>
      </div>
    )
  }

  // Edge case: no leaderboard data but in 'over' state
  if (finalLeaderboard.length === 0 && gameState === 'over') {
    return (
      <div className="min-h-screen bg-arena-bg text-arena-text antialiased grid-bg flex flex-col">
        <header className="border-b border-arena-border bg-arena-bg/90 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-arena-green text-lg">⌘</span>
              <span className="font-mono font-bold text-white">bugbrawl<span className="text-arena-muted">.sh</span></span>
              <span className="text-arena-border">|</span>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                GAME OVER
              </span>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-arena-panel border border-arena-border rounded-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-arena-green/5 border border-arena-green/20 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-flag-checkered text-2xl text-arena-muted"></i>
            </div>
            <h2 className="font-mono text-xl font-bold text-white mb-2">Game Complete</h2>
            <p className="font-mono text-sm text-arena-muted mb-6">
              The match has ended. Results are being compiled.
            </p>
            <button
              onClick={handleBackToLobby}
              className="font-mono text-sm text-black font-bold py-3 px-6 rounded-xl cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #00ff41 100%)' }}
            >
              <i className="fa-solid fa-house mr-2"></i> Back to Lobby
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-arena-bg text-arena-text antialiased grid-bg">
      {/* Confetti */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 rounded-sm animate-[confettiFall_4s_linear_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>
      )}

      {/* HEADER */}
      <header className="border-b border-arena-border bg-arena-bg/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-arena-green text-lg">⌘</span>
            <span className="font-mono font-bold text-white hidden sm:inline">bugbrawl<span className="text-arena-muted">.sh</span></span>
            <span className="text-arena-border hidden sm:inline">|</span>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-500/15 text-red-400 border border-red-500/30">
              GAME OVER
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-arena-panel border border-arena-border rounded-lg px-3 py-1.5">
              <span className="font-mono text-xs text-arena-muted">Room:</span>
              <span className="font-mono text-xs font-bold text-arena-green">{roomCode}</span>
            </div>
            <div className="w-8 h-8 rounded-full border border-arena-border bg-arena-panel flex items-center justify-center font-mono font-bold text-arena-green text-sm">
              {user?.username?.charAt(0)?.toUpperCase() || '?'}
            </div>
          </div>
        </div>
      </header>

      {/* HERO WINNER SECTION */}
      <section className="py-8 sm:py-12 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(255,215,0,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}>
        </div>

        <div className="mb-6">
          <p className="font-mono text-xs text-arena-muted tracking-widest uppercase mb-1">// debug session complete</p>
          <h1 className="font-mono text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            GAME <span className="text-arena-green">OVER</span>
          </h1>
          <p className="font-mono text-sm text-arena-muted mt-2">
            {finalLeaderboard.length} players · Room {roomCode}
          </p>
        </div>

        {/* WINNER CARD */}
        {winner ? (
          <div className="inline-flex flex-col items-center">
            <i className="fa-solid fa-crown text-4xl text-yellow-400 mb-3 trophy-anim" 
               style={{ filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.9)) drop-shadow(0 0 4px #ffd700)' }}></i>
            <div className="relative bg-arena-panel border rounded-2xl p-6 sm:p-8 max-w-xs"
                 style={{ boxShadow: '0 0 60px rgba(255,215,0,0.25), 0 0 120px rgba(255,215,0,0.1)', borderColor: 'rgba(255,215,0,0.5)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-xs px-4 py-1 rounded-full font-bold"
                   style={{ background: '#161b22', border: '1px solid rgba(255,215,0,0.5)', color: '#ffd700' }}>
                ★ CHAMPION ★
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 mx-auto mb-4 flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold"
                   style={{ borderColor: '#ffd700', boxShadow: '0 0 16px rgba(255,215,0,0.5)', backgroundColor: '#161b22', color: '#ffd700' }}>
                {winner.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-mono text-xl sm:text-2xl font-extrabold text-white">{winner.username}</h2>
              <p className={`font-mono text-xs mt-1 mb-4 ${winner.username === user?.username ? 'text-arena-green' : 'text-arena-muted'}`}>
                {winner.username === user?.username ? '🏆 You won!' : 'Champion'}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-arena-green">{winner.totalScore}</span>
                <span className="font-mono text-sm text-arena-muted">pts</span>
              </div>
              <div className="mt-3 flex justify-center gap-2 flex-wrap">
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                  <i className="fa-solid fa-crown mr-1"></i>First Place
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="inline-flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-arena-green/10 border-2 border-arena-green/30 flex items-center justify-center mb-3">
              <i className="fa-solid fa-trophy text-2xl text-arena-green"></i>
            </div>
            <p className="font-mono text-sm text-arena-muted">Results determined — check the leaderboard below.</p>
          </div>
        )}
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 space-y-6 sm:space-y-8">
        {/* FINAL RANKINGS */}
        <div className="bg-arena-panel border border-arena-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-arena-border flex items-center justify-between">
            <h2 className="font-mono text-sm font-bold text-white">
              <i className="fa-solid fa-flag-checkered mr-2 text-arena-green"></i>Final Results
            </h2>
            <span className="font-mono text-xs text-arena-muted">{finalLeaderboard.length} players</span>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-12 px-5 py-2.5 border-b border-arena-border bg-arena-bg/50">
            <span className="col-span-1 font-mono text-xs text-arena-muted">#</span>
            <span className="col-span-6 font-mono text-xs text-arena-muted">Player</span>
            <span className="col-span-5 font-mono text-xs text-arena-muted text-right">Score</span>
          </div>

          <div className="divide-y divide-arena-border">
            {finalLeaderboard.map((entry, index) => {
              const rank = index + 1
              const isMe = entry.username === user?.username
              const rowClass = isMe ? 'bg-arena-green/5 border-l-2 border-arena-green' : ''

              return (
                <div key={entry.username} className={`grid grid-cols-12 px-5 py-4 items-center ${rowClass} slide-up`}
                     style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                  <div className="col-span-1">
                    {rank <= 3 ? (
                      <span className="font-mono text-base">{trophyEmoji[rank - 1]}</span>
                    ) : (
                      <span className="font-mono text-sm text-arena-muted font-bold">{rank}</span>
                    )}
                  </div>
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border flex-shrink-0 flex items-center justify-center font-mono font-bold text-sm"
                         style={{
                           backgroundColor: rank <= 3 ? `${avatarColors[rank - 1]}20` : '#161b22',
                           borderColor: rank <= 3 ? avatarColors[rank - 1] : '#30363d',
                           color: rank <= 3 ? avatarColors[rank - 1] : '#c9d1d9'
                         }}>
                      {entry.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-mono text-sm font-bold text-white">{entry.username}</p>
                      <p className={`font-mono text-xs ${isMe ? 'text-arena-green' : 'text-arena-muted'}`}>
                        {isMe ? '● You' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-5 text-right">
                    <p className={`font-mono text-base font-bold ${rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-orange-400' : 'text-white'}`}>
                      {entry.totalScore}
                    </p>
                    <p className="font-mono text-xs text-arena-muted">pts</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleBackToLobby}
            className="flex-1 text-black font-mono font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm cursor-pointer hover:shadow-[0_0_25px_rgba(0,255,65,0.3)] transition-all"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #00ff41 100%)',
            }}
          >
            <i className="fa-solid fa-house"></i> Back to Lobby
          </button>
        </div>
      </main>

      {/* Keyframe styles for confetti and animations */}
      <style>{`
        @keyframes confettiFall {
          to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes trophySpin {
          0% { transform: scale(0.5) rotate(-20deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .trophy-anim { animation: trophySpin 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.5s ease-out both; }
      `}</style>
    </div>
  )
}
