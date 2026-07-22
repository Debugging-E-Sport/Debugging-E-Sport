import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import LoginPage from './pages/LoginPage'
import SelectRolePage from './pages/SelectRolePage'
import ArenaLobbyPage from './pages/ArenaLobbyPage'
import MockStatusPage from './pages/MockStatusPage.jsx'
import { AuthProvider } from './context/AuthContext'
import { RoomProvider } from './context/RoomContext'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  const isMockEnv = import.meta.env.VITE_ENABLE_MSW === 'true'

  return (
    <AuthProvider>
      <BrowserRouter>
        <RoomProvider>
          <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/select/role" element={<ProtectedRoute><SelectRolePage /></ProtectedRoute>} />
              <Route path="/room/:code" element={<ProtectedRoute><ArenaLobbyPage /></ProtectedRoute>} />
              {isMockEnv && (
                <Route path="/dev/mock-status" element={<MockStatusPage />} />
              )}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </RoomProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
