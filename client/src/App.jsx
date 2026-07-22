import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import LoginPage from './pages/LoginPage'
import MockStatusPage from './pages/MockStatusPage.jsx'
import { AuthProvider } from './context/AuthContext'

function App() {
  const isMockEnv = import.meta.env.VITE_ENABLE_MSW === 'true'

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-950 text-gray-100">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            {isMockEnv && (
              <Route path="/dev/mock-status" element={<MockStatusPage />} />
            )}
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
