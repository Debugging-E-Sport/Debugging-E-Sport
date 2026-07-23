import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuthContext } from '../context/AuthContext'
import CodeRain from '../components/CodeRain'
import LoginHero from '../components/LoginHero'
import AuthCard from '../components/AuthCard'
import Spinner from '../components/Spinner'

export default function LoginPage() {
  const { isAuthenticated, isCheckingAuth } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      navigate('/select/role', { replace: true })
    }
  }, [isAuthenticated, isCheckingAuth, navigate])

  // Full-screen loading while checking auth
  if (isCheckingAuth) {
    return (
      <main className="h-screen w-full flex items-center justify-center bg-arena-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-arena-green/10 border-2 border-arena-green/30 flex items-center justify-center">
            <i className="fa-solid fa-spinner fa-spin text-2xl text-arena-green"></i>
          </div>
          <p className="font-mono text-sm text-arena-muted">Initializing session...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="h-screen w-full flex overflow-hidden">
      <CodeRain />
      <LoginHero />
      <AuthCard />
    </main>
  )
}
