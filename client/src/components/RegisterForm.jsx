import { useState } from 'react'
import Spinner from './Spinner.jsx'

export default function RegisterForm({ onSubmit, isLoading, error, onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return
    const ok = await onSubmit(username, password)
    if (ok) {
      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
      }, 1500)
    }
  }

  return (
    <div>
      <h2 className="font-mono text-xl font-bold text-white mb-7">
        Join the arena, debugger
      </h2>

      {success && (
        <div className="mb-5 font-mono text-sm text-[#00ff41] bg-[#00ff41]/10 border border-[#00ff41]/30 rounded px-3 py-3 flex items-center gap-2">
          <i className="fa-solid fa-circle-check" />
          <div>
            <p className="font-semibold">Account created!</p>
            <p className="text-xs text-[#00ff41]/70">Switching to login...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 mb-7">
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
              placeholder="pick.your.handle"
              disabled={success}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00ff41] transition-all font-mono disabled:opacity-50"
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
              disabled={success}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00ff41] transition-all font-mono disabled:opacity-50"
            />
          </div>
        </div>
        {error && (
          <p className="text-red-400 text-xs font-mono bg-red-400/10 border border-red-400/30 rounded px-3 py-2">
            {error}
          </p>
        )}
      </form>
      <div className="mt-7">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || success || !username.trim() || !password.trim()}
          className="w-full bg-gradient-to-r from-[#7c3aed] to-[#00ff41] text-black font-mono font-bold text-sm py-3.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span>&gt; _</span> {isLoading ? <Spinner /> : 'CREATE ACCOUNT'}
        </button>
      </div>
    </div>
  )
}
