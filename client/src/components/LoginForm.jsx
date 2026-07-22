import { useState } from 'react'
import Spinner from './Spinner.jsx'

export default function LoginForm({ onSubmit, isLoading, error }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return
    onSubmit(username, password)
  }

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
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00ff41] transition-all font-mono"
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
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="········"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-10 pr-12 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00ff41] transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#00ff41] transition-colors"
            >
              <i className={`fa-${showPassword ? 'solid' : 'regular'} fa-eye text-sm`} />
            </button>
          </div>
        </div>
        {error && (
          <p className="text-red-400 text-xs font-mono bg-red-400/10 border border-red-400/30 rounded px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading || !username.trim() || !password.trim()}
          className="w-full bg-gradient-to-r from-[#7c3aed] to-[#00ff41] text-black font-mono font-bold text-sm py-3.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? <Spinner /> : 'LOGIN'}
        </button>
      </form>
    </div>
  )
}
