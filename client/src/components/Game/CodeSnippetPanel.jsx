import { useSocket } from '../../context/SocketContext'
import LoadingSkeleton from '../LoadingSkeleton'

const placeholderCode = '// Waiting for the next snippet...\n// The room host will start the game soon.\n\nfunction loading() {\n  return "Stay sharp, debugger! ⚡"\n}'

export default function CodeSnippetPanel() {
  const { currentSnippet, gameState, isConnected } = useSocket()

  // Between rounds — show skeleton
  if (gameState === 'playing' && !currentSnippet) {
    return (
      <section id="code-panel" className="space-y-4">
        <div className="bg-arena-panel border border-arena-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-arena-green/20 flex items-center justify-center">
              <i className="fa-solid fa-spinner fa-spin text-xs text-arena-green"></i>
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-white">Waiting for next round...</p>
              <p className="text-arena-muted text-xs mt-0.5">The next snippet will appear shortly.</p>
            </div>
          </div>
        </div>
        <LoadingSkeleton variant="code" count={8} />
      </section>
    )
  }

  // Empty / waiting for game to start
  if (!currentSnippet) {
    return (
      <section id="code-panel" className="space-y-4">
        <div className="bg-arena-panel border border-arena-border rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-arena-muted">// waiting for game to start</span>
              </div>
              <h2 className="font-mono text-base font-bold text-white leading-snug">Preparing challenge...</h2>
              <p className="text-arena-muted text-xs mt-1">The next code snippet will appear here when the round starts.</p>
            </div>
          </div>
        </div>
        <div className="bg-arena-panel border border-arena-border rounded-xl overflow-hidden">
          <div className="flex items-center px-4 py-2.5 border-b border-arena-border bg-arena-bg">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            </div>
          </div>
          <div className="p-4 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed text-arena-muted">
              <code>{placeholderCode}</code>
            </pre>
          </div>
        </div>
      </section>
    )
  }

  // Split code into lines for line numbering
  const codeLines = (currentSnippet.code || '').split('\n')

  // Determine language from title or default
  const languageTag = currentSnippet.title?.toLowerCase().includes('python') ? 'Python'
    : currentSnippet.title?.toLowerCase().includes('javascript') || currentSnippet.title?.toLowerCase().includes('js') ? 'JavaScript'
    : currentSnippet.title?.toLowerCase().includes('closure') ? 'JavaScript'
    : currentSnippet.title?.toLowerCase().includes('coercion') ? 'JavaScript'
    : 'Code'

  return (
    <section id="code-panel" className="space-y-4">
      {/* Question header */}
      <div className="bg-arena-panel border border-arena-border rounded-xl p-4 glow-green/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-arena-muted">// bug hunt</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{languageTag}</span>
            </div>
            <h2 className="font-mono text-base font-bold text-white leading-snug">{currentSnippet.title || 'Find the bug'}</h2>
            <p className="text-arena-muted text-xs mt-1">{currentSnippet.context || 'Analyze the code and identify the bugs.'}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className="font-mono text-xs text-arena-green font-bold">+{currentSnippet.max_score || '?'} pts</span>
            <span className="font-mono text-xs text-arena-muted">max score</span>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="bg-arena-panel border border-arena-border rounded-xl overflow-hidden">
        {/* Editor titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-arena-border bg-arena-bg">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            <span className="ml-2 font-mono text-xs text-arena-muted">
              {currentSnippet.id ? `challenge_${currentSnippet.id}.${languageTag === 'Python' ? 'py' : 'js'}` : 'challenge.txt'}
            </span>
          </div>
          <span className="font-mono text-xs text-arena-muted">Read-only</span>
        </div>

        {/* Code content */}
        <div className="p-4 overflow-x-auto">
          <pre className="font-mono text-sm leading-relaxed">
            <code>
              {codeLines.map((line, i) => (
                <span key={i} className="flex">
                  <span className="line-num">{i + 1}</span>
                  <span className="text-[#c9d1d9]">{line || ' '}</span>
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </section>
  )
}
