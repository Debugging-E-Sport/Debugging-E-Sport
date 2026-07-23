import { useSocket } from '../../context/SocketContext'
import { useAuthContext } from '../../context/AuthContext'

export default function LiveLeaderboard() {
  const { leaderboard, allSubmitted, scores, players } = useSocket()
  const { user } = useAuthContext()

  const rankClasses = {
    1: 'rank-1',
    2: 'rank-2',
    3: 'rank-3',
  }

  const rankEmoji = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  }

  const avatarColors = ['#00ff41', '#7c3aed', '#facc15', '#f85149', '#58a6ff', '#f0883e']

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
            <div className="px-4 py-8 text-center">
              <p className="font-mono text-xs text-arena-muted">Waiting for scores...</p>
              <p className="font-mono text-xs text-arena-muted mt-1">Leaderboard updates after each round.</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => {
              const rank = index + 1
              const isMe = entry.username === user?.username
              const topBg = rank === 1 ? 'bg-yellow-400/5' : rank === 2 ? 'bg-gray-400/5' : rank === 3 ? 'bg-orange-400/5' : ''
              const borderClass = isMe ? 'border-l-2 border-arena-green bg-arena-green/5' : ''

              return (
                <div key={entry.username} className={`flex items-center gap-3 px-4 py-3 ${topBg} ${borderClass}`}>
                  <span className={`font-mono text-sm font-bold ${rankClasses[rank] || 'text-arena-muted'} w-5 text-center`}>
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
      {players.length > 0 && (
        <div className="bg-arena-panel border border-arena-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold text-white">Players Online</span>
            <span className="font-mono text-xs text-arena-green">{players.length} connected</span>
          </div>
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
        </div>
      )}
    </section>
  )
}
