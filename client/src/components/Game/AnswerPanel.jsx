import { useState } from 'react'
import CodeEditor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/themes/prism-twilight.css' // Dark theme that fits well

const Editor = CodeEditor.default || CodeEditor;

export default function AnswerPanel() {
  const [activeTab, setActiveTab] = useState('answer') // 'answer' or 'explain'
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [code, setCode] = useState("for j in range(0, n-i-1):")
  const [explanation, setExplanation] = useState("The inner loop range(0, n) causes an IndexError because when j reaches n-1, accessing arr[j+1] goes out of bounds. It should be range(0, n-i-1) to avoid comparing already-sorted elements.")

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    setActiveTab('explain')
  }

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
              <label className="block font-mono text-xs text-arena-green mb-2">// line of bug</label>
              <input 
                type="number" 
                defaultValue="7" 
                placeholder="Line number..."
                className="w-full bg-arena-bg border border-arena-border rounded-lg px-3 py-2 font-mono text-sm text-white placeholder-arena-muted focus:outline-none focus:border-arena-green focus:shadow-[0_0_15px_rgba(0,255,65,0.3)] transition-all"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-arena-green mb-2">// bug type</label>
              <select 
                defaultValue="Off-by-one error"
                className="w-full bg-arena-bg border border-arena-border rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-arena-green focus:shadow-[0_0_15px_rgba(0,255,65,0.3)] transition-all"
              >
                <option value="">Select bug type...</option>
                <option value="Off-by-one error">Off-by-one error</option>
                <option value="Null pointer / Index error">Null pointer / Index error</option>
                <option value="Logic error">Logic error</option>
                <option value="Infinite loop">Infinite loop</option>
                <option value="Type error">Type error</option>
                <option value="Memory leak">Memory leak</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs text-arena-green mb-2">// explain the bug</label>
              <div className="w-full bg-[#141414] border border-arena-border rounded-lg transition-all focus-within:border-arena-green focus-within:shadow-[0_0_15px_rgba(0,255,65,0.3)] overflow-hidden min-h-[100px]">
                <Editor
                  value={explanation}
                  onValueChange={text => setExplanation(text)}
                  highlight={text => text}
                  padding={12}
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 12,
                    backgroundColor: 'transparent',
                    minHeight: '100px'
                  }}
                  textareaClassName="focus:outline-none placeholder-arena-muted text-white"
                />
              </div>
            </div>
            <div>
              <label className="block font-mono text-xs text-arena-green mb-2">// fixed code (optional, +bonus pts)</label>
              <div className="w-full bg-[#141414] border border-arena-border rounded-lg transition-all focus-within:border-arena-green focus-within:shadow-[0_0_15px_rgba(0,255,65,0.3)] overflow-hidden">
                <Editor
                  value={code}
                  onValueChange={code => setCode(code)}
                  highlight={code => Prism.highlight(code, Prism.languages.python, 'python')}
                  padding={12}
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 12,
                    backgroundColor: 'transparent',
                  }}
                  textareaClassName="focus:outline-none placeholder-arena-muted text-white"
                />
              </div>
            </div>

            {/* Submit */}
            <button 
              type="submit"
              className="submit-btn w-full text-black font-mono font-bold text-sm py-3.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] shadow-[0_0_15px_rgba(0,255,65,0.2)] hover:shadow-[0_0_25px_rgba(0,255,65,0.6)] animate-[pulse_3s_infinite]"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i> SUBMIT ANSWER
            </button>
            <p className="font-mono text-xs text-arena-muted text-center">Faster submissions earn bonus points ⚡</p>
          </form>
        )}

        {/* AI ANALYSIS PANE */}
        {activeTab === 'explain' && (
          <div className="p-4 space-y-4">
            {!isSubmitted ? (
              <div className="text-center py-8">
                <i className="fa-solid fa-robot text-4xl text-arena-muted mb-3"></i>
                <p className="font-mono text-sm text-arena-muted">Submit your answer to view AI analysis.</p>
              </div>
            ) : (
              <>
                {/* Score */}
                <div className="bg-arena-bg border border-arena-green/30 rounded-lg p-4 text-center">
                  <p className="font-mono text-xs text-arena-muted mb-1">AI Score</p>
                  <p className="font-mono text-5xl font-bold text-arena-green">92</p>
                  <p className="font-mono text-xs text-arena-muted mt-1">/ 100</p>
                  <div className="flex justify-center gap-1 mt-2">
                    <i className="fa-solid fa-star text-yellow-400 text-xs"></i>
                    <i className="fa-solid fa-star text-yellow-400 text-xs"></i>
                    <i className="fa-solid fa-star text-yellow-400 text-xs"></i>
                    <i className="fa-solid fa-star text-yellow-400 text-xs"></i>
                    <i className="fa-regular fa-star text-arena-muted text-xs"></i>
                  </div>
                </div>
                {/* Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-arena-muted">Bug Identified</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-arena-border rounded-full"><div className="h-1.5 bg-arena-green rounded-full" style={{ width: '100%' }}></div></div>
                      <span className="font-mono text-xs text-arena-green">+80pts</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-arena-muted">Explanation Quality</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-arena-border rounded-full"><div className="h-1.5 bg-arena-green rounded-full" style={{ width: '85%' }}></div></div>
                      <span className="font-mono text-xs text-arena-green">+68pts</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-arena-muted">Speed Bonus</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-arena-border rounded-full"><div className="h-1.5 bg-yellow-400 rounded-full" style={{ width: '60%' }}></div></div>
                      <span className="font-mono text-xs text-yellow-400">+36pts</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-arena-muted">Hint Penalty</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-arena-border rounded-full"><div className="h-1.5 bg-red-500 rounded-full" style={{ width: '25%' }}></div></div>
                      <span className="font-mono text-xs text-red-400">-50pts</span>
                    </div>
                  </div>
                </div>
                {/* AI feedback */}
                <div className="bg-arena-purple/10 border border-arena-purple/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fa-solid fa-robot text-arena-purpleLight text-xs"></i>
                    <span className="font-mono text-xs font-bold text-arena-purpleLight">AI Feedback</span>
                  </div>
                  <p className="font-mono text-xs text-arena-muted leading-relaxed">
                    Correct! The off-by-one error in the inner loop causes an <span className="text-white">IndexError</span>. 
                    Your fix using <span className="text-arena-green">n-i-1</span> is optimal — it also improves performance by skipping already-sorted elements. Great work!
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
