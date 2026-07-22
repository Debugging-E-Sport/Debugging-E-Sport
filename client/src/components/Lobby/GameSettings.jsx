import { useState } from 'react'

export default function GameSettings() {
  const [difficulty, setDifficulty] = useState('medium')
  const [spectatorsEnabled, setSpectatorsEnabled] = useState(true)

  const diffClass = (level) => {
    const base = 'flex-1 py-2 rounded-lg font-mono text-xs border transition-all cursor-pointer '
    if (difficulty === level) {
      if (level === 'easy') return base + 'border-green-500 bg-arena-bg text-green-400'
      if (level === 'medium') return base + 'border-yellow-500 bg-arena-bg text-yellow-400'
      if (level === 'hard') return base + 'border-red-500 bg-arena-bg text-red-400'
    }
    return base + 'border-transparent bg-arena-bg text-arena-muted hover:border-arena-border hover:text-white'
  }

  return (
    <div id="pane-settings" className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-mono text-xs text-arena-green mb-2">// difficulty</label>
          <div className="flex gap-2">
            <button onClick={() => setDifficulty('easy')} className={diffClass('easy')}>Easy</button>
            <button onClick={() => setDifficulty('medium')} className={diffClass('medium')}>Medium</button>
            <button onClick={() => setDifficulty('hard')} className={diffClass('hard')}>Hard</button>
          </div>
        </div>
        <div>
          <label className="block font-mono text-xs text-arena-green mb-2">// time per question</label>
          <select className="w-full bg-arena-bg border border-arena-border rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-arena-green cursor-pointer">
            <option>60 seconds</option>
            <option defaultValue>90 seconds</option>
            <option>120 seconds</option>
            <option>180 seconds</option>
          </select>
        </div>
        <div>
          <label className="block font-mono text-xs text-arena-green mb-2">// number of questions</label>
          <select className="w-full bg-arena-bg border border-arena-border rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-arena-green cursor-pointer">
            <option>3 questions</option>
            <option defaultValue>5 questions</option>
            <option>8 questions</option>
            <option>10 questions</option>
          </select>
        </div>
        <div>
          <label className="block font-mono text-xs text-arena-green mb-2">// language focus</label>
          <select className="w-full bg-arena-bg border border-arena-border rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-arena-green cursor-pointer">
            <option>Mixed</option>
            <option>JavaScript</option>
            <option defaultValue>Python</option>
            <option>Java</option>
            <option>C++</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block font-mono text-xs text-arena-green mb-2">// allow spectators</label>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSpectatorsEnabled(!spectatorsEnabled)}
              className={`w-11 h-6 rounded-full relative transition-all cursor-pointer ${spectatorsEnabled ? 'bg-arena-green' : 'bg-arena-border'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all ${spectatorsEnabled ? 'right-1' : 'left-1'}`}></span>
            </button>
            <span className="font-mono text-sm text-white">{spectatorsEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
