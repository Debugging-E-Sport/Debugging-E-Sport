import GameHeader from './GameHeader'
import CodeSnippetPanel from './CodeSnippetPanel'
import AnswerPanel from './AnswerPanel'
import LiveLeaderboard from './LiveLeaderboard'
import { ErrorBoundary } from '../ErrorBoundary'

export default function GameView({ roomCode, user }) {
  return (
    <div className="text-arena-text min-h-screen grid-bg flex flex-col">
      <GameHeader roomCode={roomCode} user={user} />
      
      <main className="max-w-[1440px] w-full mx-auto px-6 py-8 flex-1">
        <ErrorBoundary>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: Game Area (Lebar & Lega) */}
            <div className="lg:col-span-8 flex flex-col gap-6 animate-[slideInUp_0.5s_ease-out]">
              <CodeSnippetPanel />
              <AnswerPanel />
            </div>

            {/* RIGHT COLUMN: Leaderboard & Stats */}
            <div className="lg:col-span-4 flex flex-col gap-6 animate-[slideInRight_0.6s_ease-out]">
              <LiveLeaderboard />
            </div>
          </div>
        </ErrorBoundary>
      </main>
    </div>
  )
}
