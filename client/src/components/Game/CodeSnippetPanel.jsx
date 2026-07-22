import { useState } from 'react'

export default function CodeSnippetPanel() {
  const [hintUsed, setHintUsed] = useState(false)

  return (
    <section id="code-panel" className="space-y-4">
      
      {/* Question header */}
      <div className="bg-arena-panel border border-arena-border rounded-xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-arena-muted">// question 3</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Python</span>
            </div>
            <h2 className="font-mono text-base font-bold text-white leading-snug">Find the bug in this sorting algorithm</h2>
            <p className="text-arena-muted text-xs mt-1">This function should return a sorted list, but it's producing incorrect results for certain inputs.</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className="font-mono text-xs text-arena-green font-bold">+200 pts</span>
            <span className="font-mono text-xs text-arena-muted">base score</span>
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
            <span className="ml-2 font-mono text-xs text-arena-muted">buggy_sort.py</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setHintUsed(true)}
              disabled={hintUsed}
              className={`flex items-center gap-1.5 font-mono text-xs text-arena-yellow transition-colors border border-arena-border rounded px-2.5 py-1 ${
                hintUsed ? 'hint-used' : 'hover:text-yellow-300 hover:border-yellow-500/50 cursor-pointer'
              }`}
            >
              <i className="fa-solid fa-lightbulb text-xs"></i> Hint <span className="text-arena-muted">(-50pts)</span>
            </button>
            <span className="font-mono text-xs text-arena-muted">Read-only</span>
          </div>
        </div>

        {/* Code content */}
        <div className="p-4 overflow-x-auto">
          <pre className="font-mono text-sm leading-relaxed">
            <code>
              <span className="flex"><span className="line-num">1</span><span className="code-comment"># Bug Brawl Challenge — Round 3</span></span>
              <span className="flex"><span className="line-num">2</span><span className="code-comment"># Fix the bug in this bubble sort implementation</span></span>
              <span className="flex"><span className="line-num">3</span></span>
              <span className="flex"><span className="line-num">4</span><span className="code-kw">def </span><span className="code-fn">bubble_sort</span>(<span className="code-var">arr</span>):</span>
              <span className="flex"><span className="line-num">5</span>    <span className="code-var">n</span> = <span className="code-fn">len</span>(<span className="code-var">arr</span>)</span>
              <span className="flex"><span className="line-num">6</span>    <span className="code-kw">for </span><span className="code-var">i</span><span className="code-kw"> in </span><span className="code-fn">range</span>(<span className="code-var">n</span>):</span>
              <span className="flex bug-line"><span className="line-num">7</span>        <span className="code-kw">for </span><span className="code-var">j</span><span className="code-kw"> in </span><span className="code-fn">range</span>(<span className="code-num">0</span>, <span className="code-var">n</span>):  <span className="code-comment" style={{ color: '#f85149' }}>▲ BUG</span></span>
              <span className="flex"><span className="line-num">8</span>            <span className="code-kw">if </span><span className="code-var">arr</span>[<span className="code-var">j</span>] &gt; <span className="code-var">arr</span>[<span className="code-var">j</span> + <span className="code-num">1</span>]:</span>
              <span className="flex"><span className="line-num">9</span>                <span className="code-var">arr</span>[<span className="code-var">j</span>], <span className="code-var">arr</span>[<span className="code-var">j</span> + <span className="code-num">1</span>] = <span className="code-var">arr</span>[<span className="code-var">j</span> + <span className="code-num">1</span>], <span className="code-var">arr</span>[<span className="code-var">j</span>]</span>
              <span className="flex"><span className="line-num">10</span>    <span className="code-kw">return </span><span className="code-var">arr</span></span>
              <span className="flex"><span className="line-num">11</span></span>
              <span className="flex"><span className="line-num">12</span><span className="code-comment"># Test cases</span></span>
              <span className="flex"><span className="line-num">13</span><span className="code-fn">print</span>(<span className="code-fn">bubble_sort</span>([<span className="code-num">5</span>, <span className="code-num">1</span>, <span className="code-num">4</span>, <span className="code-num">2</span>, <span className="code-num">8</span>]))</span>
              <span className="flex"><span className="line-num">14</span><span className="code-comment"># Expected: [1, 2, 4, 5, 8]</span></span>
              <span className="flex"><span className="line-num">15</span><span className="code-comment"># Got: IndexError: list index out of range</span></span>
            </code>
          </pre>
        </div>

        {/* Hint box */}
        {hintUsed && (
          <div className="border-t border-arena-border bg-yellow-500/5 px-4 py-3">
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-lightbulb text-yellow-400 text-xs mt-0.5"></i>
              <div>
                <p className="font-mono text-xs font-bold text-yellow-400 mb-1">Hint (-50 pts deducted)</p>
                <p className="font-mono text-xs text-arena-muted">
                  The inner loop's range causes an <span className="text-white">index out of bounds</span> error. 
                  Think about how many comparisons you actually need as the outer loop progresses.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Output */}
      <div className="bg-arena-bg border border-red-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <i className="fa-solid fa-triangle-exclamation text-red-400 text-xs"></i>
          <span className="font-mono text-xs font-bold text-red-400">Runtime Error</span>
        </div>
        <pre className="font-mono text-xs text-red-300 leading-relaxed">
{`Traceback (most recent call last):
  File "buggy_sort.py", line 8, in bubble_sort
    if arr[j] > arr[j + 1]:
`}
<span className="text-red-400">IndexError: list index out of range</span>
        </pre>
      </div>

    </section>
  )
}
