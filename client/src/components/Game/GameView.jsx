import GameHeader from './GameHeader'
import CodeSnippetPanel from './CodeSnippetPanel'
import AnswerPanel from './AnswerPanel'
import LiveLeaderboard from './LiveLeaderboard'
import { ErrorBoundary } from '../ErrorBoundary'

export default function GameView({ roomCode, user }) {
  return (
    <div className="text-arena-text min-h-screen grid-bg flex flex-col">
      <GameHeader roomCode={roomCode} user={user} />
      
      <main className="max-w-[1440px] w-full mx-auto px-4 py-5 grid grid-cols-12 gap-5 flex-1">
        <ErrorBoundary>
          <CodeSnippetPanel />
          <AnswerPanel />
          <LiveLeaderboard />
        </ErrorBoundary>
      </main>
    </div>
  )
}
