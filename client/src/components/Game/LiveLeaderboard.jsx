import { useSocket } from '../../context/SocketContext'
import { useAuthContext } from '../../context/AuthContext'
import LoadingSkeleton from '../LoadingSkeleton'

export default function LiveLeaderboard() {
  const { leaderboard, players, isConnected, gameState } = useSocket()
  const { user } = useAuthContext()

  const rankEmoji = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  }

  const avatarColors = ['#00ff41', '#7c3aed', '#facc15', '#f85149', '#58a6ff', '#f0883e']

  // Loading: before game starts
  if (gameState === 'idle' || !isConnected) {
    return (
      <section id="leaderboard-panel" className="space-y-6">
        <LoadingSkeleton variant="leaderboard" count={3} />
      </section>
    )
  }

  return (
    <section id="leaderboard-panel" className="space-y-6">
      {/* Leaderboard card */}
      <div className="bg-arena-panel border border-arena-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-arena-border">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-trophy text-yellow-400 text-sm"></i>
            <span className="font-mono text-sm font-bold text-white">Leaderboard</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-arena-green">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="live-dot absolute"></span>
              <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-arena-green"></span>
            </span>
            LIVE
          </div>
        </div>

        <div className="divide-y divide-arena-border" id="lb-list">
          {leaderboard.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-arena-green/5 border border-arena-green/20 flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-trophy text-xl text-arena-muted"></i>
              </div>
              <p className="font-mono text-sm text-arena-muted">No scores yet</p>
              <p className="font-mono text-xs text-arena-muted mt-1">Leaderboard updates after each round.</p>
              <p className="font-mono text-xs text-arena-muted/60 mt-2">Be the first to submit an answer!</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => {
              const rank = index + 1
              const isMe = entry.username === user?.username
              const topBg = rank === 1 ? 'bg-yellow-400/5' : rank === 2 ? 'bg-gray-400/5' : rank === 3 ? 'bg-orange-400/5' : ''
              const borderClass = isMe ? 'border-l-2 border-arena-green bg-arena-green/5' : ''

              return (
                <div key={entry.username} className={`flex items-center gap-3 px-4 py-3 ${topBg} ${borderClass}`}>
                  <span className={`font-mono text-sm font-bold w-5 text-center ${
                    rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-orange-400' : 'text-arena-muted'
                  }`}>
                    {rank <= 3 ? rankEmoji[rank] : rank}
                  </span>
                  <div 
                    className="w-8 h-8 rounded-full border flex-shrink-0 flex items-center justify-center font-mono font-bold text-sm"
                    style={{ 
                      backgroundColor: `${avatarColors[rank % avatarColors.length]}20`,
                      borderColor: rank <= 3 ? (rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : '#cd7f32') : '#30363d',
                      color: avatarColors[rank % avatarColors.length]
                    }}
                  >
                    {entry.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-bold text-white truncate">{entry.username}</p>
                    <p className={`font-mono text-xs ${isMe ? 'text-arena-green' : 'text-arena-muted'}`}>
                      {isMe ? '● You' : `Rank #${rank}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono text-sm font-bold ${isMe ? 'text-arena-green score-flash' : 'text-white'}`}>
                      {entry.totalScore}
                    </p>
                    <p className="font-mono text-xs text-arena-muted">pts</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Players online */}
      <div className="bg-arena-panel border border-arena-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs font-bold text-white">Players Online</span>
          <span className="font-mono text-xs text-arena-green">{players.length} connected</span>
        </div>
        {players.length === 0 ? (
          <div className="text-center py-4">
            <p className="font-mono text-xs text-arena-muted">Waiting for players to connect...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {players.map((p) => {
              const isMe = p.username === user?.username
              return (
                <div key={p.username} className="flex items-center gap-3">
                  <div 
                    className="w-7 h-7 rounded-full border border-arena-border flex-shrink-0 flex items-center justify-center font-mono font-bold text-xs"
                    style={{ backgroundColor: '#161b22', color: '#00ff41' }}
                  >
                    {p.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-mono text-xs text-white flex-1 truncate">
                    {p.username} {isMe && <span className="text-arena-green">(you)</span>}
                  </span>
                  <span className="relative inline-flex h-2 w-2">
                    <span className="relative inline-block h-2 w-2 rounded-full bg-arena-green"></span>
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
