import { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { api, AUTH_KEY } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const saveAuth = useCallback((userData, tokenValue) => {
    setUser(userData)
    setToken(tokenValue)
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user: userData, token: tokenValue }))
  }, [])

  const clearAuth = useCallback(() => {
    setUser(null)
    setToken(null)
    setError(null)
    localStorage.removeItem(AUTH_KEY)
  }, [])

  const login = useCallback(async (username, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.post('/auth/login', { username, password })
      saveAuth({ id: res.data.id, username: res.data.username }, res.data.token)
      return true
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Check your credentials.'
      setError(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [saveAuth])

  const register = useCallback(async (username, password) => {
    setIsLoading(true)
    setError(null)
    try {
      await api.post('/auth/register', { username, password })
      return true
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed.'
      setError(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearAuth()
  }, [clearAuth])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const raw = localStorage.getItem(AUTH_KEY)

      if (!raw) {
        setIsCheckingAuth(false)
        return
      }

      let stored
      try { stored = JSON.parse(raw) } catch {
        clearAuth()
        setIsCheckingAuth(false)
        return
      }

      if (!stored.token) {
        clearAuth()
        setIsCheckingAuth(false)
        return
      }

      try {
        const res = await api.get('/auth/me')
        if (!cancelled) saveAuth({ id: res.data.id, username: res.data.username }, stored.token)
      } catch {
        if (!cancelled) clearAuth()
      } finally {
        if (!cancelled) setIsCheckingAuth(false)
      }
    })()

    return () => { cancelled = true }
  }, [saveAuth, clearAuth])

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider value={{
      user, token, isLoading, error, isCheckingAuth, isAuthenticated,
      login, register, logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be inside AuthProvider')
  return ctx
}
