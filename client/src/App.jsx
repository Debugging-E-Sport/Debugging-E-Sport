import { BrowserRouter, Routes, Route } from 'react-router'
import MockStatusPage from './pages/MockStatusPage.jsx'

function App() {
  const isMockEnv = import.meta.env.VITE_ENABLE_MSW === 'true'

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {isMockEnv && (
            <Route path="/dev/mock-status" element={<MockStatusPage />} />
          )}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function HomePage() {
  const isMockEnv = import.meta.env.VITE_ENABLE_MSW === 'true'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Bug Brawl</h1>
      <p className="text-gray-400">Frontend development ready.</p>
      {isMockEnv && (
        <a href="/dev/mock-status" className="text-emerald-400 hover:text-emerald-300 underline mt-4">
          Open Mock Status Dashboard
        </a>
      )}
      {!isMockEnv && (
        <p className="text-amber-400 text-sm mt-2">
          MSW disabled. Using real server.
        </p>
      )}
    </div>
  )
}

export default App
