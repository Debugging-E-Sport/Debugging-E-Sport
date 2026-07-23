import GameHeader from './GameHeader'
import CodeSnippetPanel from './CodeSnippetPanel'
import AnswerPanel from './AnswerPanel'
import LiveLeaderboard from './LiveLeaderboard'
import { ErrorBoundary } from '../ErrorBoundary'
import { useSocket } from '../../context/SocketContext'

export default function GameView({ roomCode, user }) {
  const { gameState, lastScore, dismissScoreToast } = useSocket()

  return (
    <div className="text-arena-text min-h-screen grid-bg flex flex-col">
      <GameHeader roomCode={roomCode} user={user} />
      
      <main className="max-w-[1440px] w-full mx-auto px-6 py-8 flex-1">
        <ErrorBoundary>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: Game Area */}
            <div className="lg:col-span-8 flex flex-col gap-6 animate-[slideInUp_0.5s_ease-out]">
              <CodeSnippetPanel />
              <AnswerPanel />
            </div>

            {/* RIGHT COLUMN: Leaderboard & Stats */}
            <div className="lg:col-span-4 relative">
              <div className="flex flex-col gap-6 animate-[slideInRight_0.6s_ease-out] sticky top-8">
                <LiveLeaderboard />
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </main>

      {/* Score Toast Notification */}
      {lastScore && (
        <div className="fixed bottom-6 right-6 z-50 animate-[slideInUp_0.4s_ease-out]">
          <div className="bg-arena-panel border border-arena-green/50 rounded-xl p-4 shadow-[0_0_30px_rgba(0,255,65,0.2)] max-w-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-arena-green/10 border border-arena-green/30 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-check text-arena-green"></i>
              </div>
              <div className="flex-1">
                <p className="font-mono text-sm font-bold text-white">Answer Scored!</p>
                <p className="font-mono text-2xl font-extrabold text-arena-green mt-1">+{lastScore.score} pts</p>
                <p className="font-mono text-xs text-arena-muted mt-1">{lastScore.feedback}</p>
              </div>
              <button 
                onClick={dismissScoreToast}
                className="text-arena-muted hover:text-white transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-times text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-arena-border bg-arena-bg py-3 text-center mt-auto">
        <p className="font-mono text-xs text-arena-muted">
          Arena Bug Brawl — Powered by <span className="text-arena-green font-bold">DeepSeek AI</span>
        </p>
      </footer>
    </div>
  )
}
