import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import LoginPage from './pages/LoginPage'
import MockStatusPage from './pages/MockStatusPage.jsx'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function LobbyPlaceholder() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-100">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold font-mono text-[#00ff41]">Lobby</h1>
        <p className="text-white/50">Coming soon — game lobby will be here.</p>
        <a href="/dev/mock-status" className="text-[#00ff41]/70 hover:text-[#00ff41] underline text-sm">
          Open Mock Status Dashboard
        </a>
      </div>
    </div>
  )
}

function App() {
  const isMockEnv = import.meta.env.VITE_ENABLE_MSW === 'true'

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="h-screen bg-gray-950 text-gray-100 overflow-hidden flex flex-col">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/lobby" element={<ProtectedRoute><LobbyPlaceholder /></ProtectedRoute>} />
            {isMockEnv && (
              <Route path="/dev/mock-status" element={<MockStatusPage />} />
            )}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
