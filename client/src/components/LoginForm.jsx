import { useState } from 'react'
import Spinner from './Spinner.jsx'

export default function LoginForm({ onSubmit, isLoading, error }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return
    onSubmit(username, password)
  }

  const hasError = !!error

  return (
    <div>
      <h2 className="font-mono text-xl font-bold text-white mb-7">
        Welcome back, debugger
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-mono text-xs text-[#00ff41] mb-1.5">
            {'//'} username
          </label>
          <div className="relative">
            <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 text-sm" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your.handle"
              className={`w-full bg-[#0d1117] border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00ff41] transition-all font-mono ${
                hasError ? 'border-red-500/50 focus:border-red-400' : 'border-[#30363d]'
              }`}
            />
          </div>
        </div>
        <div>
          <label className="block font-mono text-xs text-[#00ff41] mb-1.5">
            {'//'} password
          </label>
          <div className="relative">
            <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 text-sm" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="········"
              className={`w-full bg-[#0d1117] border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00ff41] transition-all font-mono ${
                hasError ? 'border-red-500/50 focus:border-red-400' : 'border-[#30363d]'
              }`}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !username.trim() || !password.trim()}
          className="w-full bg-gradient-to-r from-[#7c3aed] to-[#00ff41] text-black font-mono font-bold text-sm py-3.5 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]"
        >
          {isLoading ? (
            <>
              <Spinner /> SIGNING IN...
            </>
          ) : (
            'LOGIN'
          )}
        </button>
      </form>
    </div>
  )
}
