import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useSocket } from '../../context/SocketContext'
import { useToast } from '../../context/ToastContext'

export default function AnswerPanel() {
  const { code: roomCode } = useParams()
  const { currentSnippet, submitAnswer, signalReady, allSubmitted, lastScore, dismissScoreToast, isConnected } = useSocket()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState('answer')
  const [explanation, setExplanation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [myScore, setMyScore] = useState(null)
  const [aiError, setAiError] = useState(false)

  // Reset form when new snippet arrives (next round)
  useEffect(() => {
    if (currentSnippet?.id) {
      setHasSubmitted(false)
      setExplanation('')
      setMyScore(null)
      setAiError(false)
      setIsSubmitting(false)
    }
  }, [currentSnippet?.id])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!explanation.trim() || !currentSnippet?.id || isSubmitting) return

    if (!isConnected) {
      toast.warning('Not connected to server. Your answer may not be submitted.')
    }

    setIsSubmitting(true)
    setAiError(false)

    try {
      submitAnswer(roomCode, currentSnippet.id, explanation.trim())
      setHasSubmitted(true)

      // Simulate a brief delay then switch to AI analysis
      setTimeout(() => {
        setIsSubmitting(false)
        setActiveTab('explain')
      }, 800)
    } catch {
      setIsSubmitting(false)
      setAiError(true)
      toast.error('Failed to submit answer. Please try again.')
    }
  }

  const handleReady = () => {
    signalReady(roomCode)
    setHasSubmitted(false)
    setExplanation('')
    setBugType('')
    setMyScore(lastScore)
    setAiError(false)
    dismissScoreToast()
  }

  const showScore = myScore || lastScore

  return (
    <section id="answer-panel" className="space-y-4">
      
      {/* Answer Tabs */}
      <div className="bg-arena-panel border border-arena-border rounded-xl overflow-hidden">
        <div className="flex border-b border-arena-border">
          <button 
            onClick={() => setActiveTab('answer')} 
            className={`flex-1 py-2.5 px-3 font-mono text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'answer' 
                ? 'ans-tab-active border-r border-arena-border' 
                : 'text-arena-muted hover:text-white border-r border-arena-border'
            }`}
          >
            <i className="fa-solid fa-pen-to-square mr-1.5"></i>Your Answer
          </button>
          <button 
            onClick={() => setActiveTab('explain')} 
            className={`flex-1 py-2.5 px-3 font-mono text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'explain' 
                ? 'ans-tab-active' 
                : 'text-arena-muted hover:text-white'
            }`}
          >
            <i className="fa-solid fa-brain mr-1.5"></i>AI Analysis
          </button>
        </div>

        {/* ANSWER PANE */}
        {activeTab === 'answer' && (
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <div>
              <label className="block font-mono text-xs text-arena-green mb-2">// explain the bug</label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Describe the bug you found, why it happens, and how to fix it..."
                rows={5}
                className="w-full bg-[#141414] border border-arena-border rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder-arena-muted focus:outline-none focus:border-arena-green focus:shadow-[0_0_15px_rgba(0,255,65,0.3)] transition-all resize-none"
              />
            </div>

            {/* AI error banner */}
            {aiError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-start gap-2">
                <i className="fa-solid fa-robot text-red-400 mt-0.5"></i>
                <div>
                  <p className="font-mono text-xs font-bold text-red-400">AI Scoring Unavailable</p>
                  <p className="font-mono text-xs text-red-400/70 mt-0.5">
                    The scoring service is temporarily unavailable. Your answer has been submitted and will be scored when the service recovers.
                  </p>
                </div>
              </div>
            )}

            {/* Submit */}
            <button 
              type="submit"
              disabled={!explanation.trim() || !currentSnippet?.id || isSubmitting}
              className="submit-btn w-full font-mono font-extrabold text-sm py-3.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-xs"></i> SCORING...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane text-xs"></i> SUBMIT ANSWER
                </>
              )}
            </button>
            <p className="font-mono text-xs text-arena-muted text-center">Faster submissions earn bonus points ⚡</p>
          </form>
        )}

        {/* AI ANALYSIS PANE */}
        {activeTab === 'explain' && (
          <div className="p-4 space-y-4">
            {!hasSubmitted ? (
              <div className="text-center py-8">
                <i className="fa-solid fa-robot text-4xl text-arena-muted mb-3"></i>
                <p className="font-mono text-sm text-arena-muted">Submit your answer to view AI analysis.</p>
              </div>
            ) : showScore ? (
              <>
                {/* Score */}
                <div className="bg-arena-bg border border-arena-green/30 rounded-lg p-4 text-center">
                  <p className="font-mono text-xs text-arena-muted mb-1">AI Score</p>
                  <p className="font-mono text-5xl font-bold text-arena-green">{showScore.score || 0}</p>
                  <p className="font-mono text-xs text-arena-muted mt-1">/ {showScore.maxScore || 100}</p>
                  {showScore.score > 0 && (
                    <div className="flex justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fa-${i < Math.ceil((showScore.score / (showScore.maxScore || 100)) * 5) ? 'solid' : 'regular'} fa-star ${i < Math.ceil((showScore.score / (showScore.maxScore || 100)) * 5) ? 'text-yellow-400' : 'text-arena-muted'} text-xs`}></i>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bug Results */}
                <div className="space-y-2">
                  {showScore.bugsFound?.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-arena-muted">Bugs Found</span>
                      <span className="font-mono text-xs text-arena-green font-bold">{showScore.bugsFound.length} 🎯</span>
                    </div>
                  )}
                  {showScore.bugsPartial?.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-arena-muted">Partial Matches</span>
                      <span className="font-mono text-xs text-yellow-400 font-bold">{showScore.bugsPartial.length} ⚠️</span>
                    </div>
                  )}
                  {showScore.bugsMissed?.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-arena-muted">Missed</span>
                      <span className="font-mono text-xs text-red-400 font-bold">{showScore.bugsMissed.length} ✗</span>
                    </div>
                  )}
                </div>

                {/* AI feedback */}
                <div className="bg-arena-purple/10 border border-arena-purple/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fa-solid fa-robot text-arena-purpleLight text-xs"></i>
                    <span className="font-mono text-xs font-bold text-arena-purpleLight">AI Feedback</span>
                  </div>
                  <p className="font-mono text-xs text-arena-muted leading-relaxed">
                    {showScore.feedback || 'Your answer has been scored. Review the results above.'}
                  </p>
                </div>

                {/* Ready button */}
                {!allSubmitted && (
                  <button
                    onClick={handleReady}
                    className="w-full bg-arena-green/10 border border-arena-green/30 rounded-lg py-2.5 font-mono text-sm text-arena-green font-bold hover:bg-arena-green/20 transition-all cursor-pointer"
                  >
                    <i className="fa-solid fa-check mr-2"></i> Ready for Next Round
                  </button>
                )}

                {allSubmitted && (
                  <div className="text-center py-2">
                    <p className="font-mono text-xs text-arena-green animate-pulse">
                      <i className="fa-solid fa-clock mr-1"></i> All players submitted — waiting for next round...
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <i className="fa-solid fa-spinner fa-spin text-2xl text-arena-green mb-3"></i>
                <p className="font-mono text-sm text-arena-muted">Scoring in progress...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
