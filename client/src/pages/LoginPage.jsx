import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuthContext } from '../context/AuthContext'
import CodeRain from '../components/CodeRain'
import LoginHero from '../components/LoginHero'
import AuthCard from '../components/AuthCard'

export default function LoginPage() {
  const { isAuthenticated, isCheckingAuth } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      navigate('/lobby', { replace: true })
    }
  }, [isAuthenticated, isCheckingAuth, navigate])

  if (isCheckingAuth) return null

  return (
    <main className="h-screen w-full flex overflow-hidden">
      <CodeRain />
      <LoginHero />
      <AuthCard />
    </main>
  )
}
