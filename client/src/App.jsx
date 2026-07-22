import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import LoginPage from './pages/LoginPage'
import LobbyPage from './pages/LobbyPage'
import MockStatusPage from './pages/MockStatusPage.jsx'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute.jsx'



function App() {
  const isMockEnv = import.meta.env.VITE_ENABLE_MSW === 'true'

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="h-screen bg-gray-950 text-gray-100 overflow-hidden flex flex-col">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/lobby" element={<ProtectedRoute><LobbyPage /></ProtectedRoute>} />
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
