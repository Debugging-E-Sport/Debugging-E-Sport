import { useState } from 'react'
import LoginForm from './LoginForm.jsx'
import RegisterForm from './RegisterForm.jsx'
import { useAuthContext } from '../context/AuthContext'
import Spinner from './Spinner.jsx'

export default function AuthCard() {
  const [activeTab, setActiveTab] = useState('login')
  const { login, register, isLoading, error, isCheckingAuth } = useAuthContext()

  const handleRegisterSuccess = () => {
    setActiveTab('login')
  }

  if (isCheckingAuth) {
    return (
      <section className="w-full lg:w-[45%] h-full flex items-center justify-center p-6 relative z-20">
        <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl p-8 flex flex-col items-center justify-center gap-4 min-h-[400px]">
          <Spinner />
          <p className="font-mono text-sm text-arena-muted">Checking session...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full lg:w-[45%] h-full flex items-center justify-center p-6 relative z-20">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl p-8 glow-green/30">
        <div className="flex border-b border-[#30363d] mb-7">
          <TabButton active={activeTab === 'login'} onClick={() => setActiveTab('login')}>
            Login
          </TabButton>
          <TabButton active={activeTab === 'register'} onClick={() => setActiveTab('register')}>
            Register
          </TabButton>
        </div>

        {/* Global auth error (shown at top of card) */}
        {error && (
          <div className="mb-5 font-mono text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-3 flex items-start gap-2 animate-[slideInUp_0.3s_ease-out]">
            <i className="fa-solid fa-circle-exclamation mt-0.5 flex-shrink-0"></i>
            <p>{error}</p>
          </div>
        )}

        {activeTab === 'login' && (
          <LoginForm onSubmit={login} isLoading={isLoading} error={error} />
        )}

        {activeTab === 'register' && (
          <RegisterForm
            onSubmit={register}
            isLoading={isLoading}
            error={error}
            onSuccess={handleRegisterSuccess}
          />
        )}
      </div>
    </section>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 pb-3 font-mono text-sm font-semibold transition-colors hover:text-[#00ff41] border-b-2 ${
        active
          ? 'text-[#00ff41] border-[#00ff41]'
          : 'text-white/50 border-transparent'
      }`}
    >
      {children}
    </button>
  )
}
