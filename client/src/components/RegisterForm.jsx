import { useState } from 'react'
import Spinner from './Spinner.jsx'

export default function RegisterForm({ onSubmit, isLoading, error, onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    if (!username.trim() || !password.trim()) {
      setLocalError('Username and password are required.')
      return
    }
    if (password.length < 4) {
      setLocalError('Password must be at least 4 characters.')
      return
    }
    const ok = await onSubmit(username, password)
    if (ok) {
      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
      }, 1500)
    }
  }

  const displayError = localError || error
  const hasError = !!displayError

  return (
    <div>
      <h2 className="font-mono text-xl font-bold text-white mb-7">
        Join the arena, debugger
      </h2>

      {success && (
        <div className="mb-5 font-mono text-sm text-[#00ff41] bg-[#00ff41]/10 border border-[#00ff41]/30 rounded px-3 py-3 flex items-center gap-2 animate-[slideInUp_0.3s_ease-out]">
          <i className="fa-solid fa-circle-check" />
          <div>
            <p className="font-semibold">Account created!</p>
            <p className="text-xs text-[#00ff41]/70">Switching to login...</p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="mb-5 font-mono text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-3 flex items-start gap-2 animate-[slideInUp_0.3s_ease-out]">
          <i className="fa-solid fa-circle-exclamation mt-0.5 flex-shrink-0"></i>
          <p>{displayError}</p>
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
              className={`w-full bg-[#0d1117] border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none transition-all font-mono disabled:opacity-50 ${
                hasError
                  ? 'border-red-500/50 focus:border-red-400'
                  : 'border-[#30363d] focus:border-[#00ff41]'
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
              disabled={success}
              className={`w-full bg-[#0d1117] border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none transition-all font-mono disabled:opacity-50 ${
                hasError
                  ? 'border-red-500/50 focus:border-red-400'
                  : 'border-[#30363d] focus:border-[#00ff41]'
              }`}
            />
          </div>
        </div>
      </form>
      <div className="mt-7">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || success || !username.trim() || !password.trim()}
          className="w-full bg-gradient-to-r from-[#7c3aed] to-[#00ff41] text-black font-mono font-bold text-sm py-3.5 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]"
        >
          <span>&gt; _</span> {isLoading ? <Spinner /> : 'CREATE ACCOUNT'}
        </button>
      </div>
    </div>
  )
}
