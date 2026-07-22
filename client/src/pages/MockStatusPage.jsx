import { useState, useEffect, useCallback } from 'react'
import { io } from 'socket.io-client'

const ENDPOINTS = [
  { method: 'POST', path: '/api/auth/register', body: { username: 'test_' + Date.now(), password: '123456' }, label: 'Register new user' },
  { method: 'POST', path: '/api/auth/login', body: { username: 'alice', password: '123456' }, label: 'Login as alice' },
  { method: 'GET', path: '/api/auth/me', auth: true, label: 'Get current user' },
  { method: 'POST', path: '/api/rooms', auth: true, label: 'Create room' },
  { method: 'POST', path: '/api/snippets/random', auth: false, methodOverride: 'GET', label: 'Get random snippet' },
  { method: 'GET', path: '/api/snippets', label: 'List all snippets' },
  { method: 'GET', path: '/api/snippets/1', label: 'Get snippet #1' },
]

function StatusBadge({ status }) {
  const colors = {
    pending: 'bg-gray-600',
    loading: 'bg-yellow-500 animate-pulse',
    success: 'bg-emerald-500',
    error: 'bg-red-500',
  }
  const labels = { pending: '—', loading: '...', success: 'OK', error: 'FAIL' }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono text-white ${colors[status]}`}>
      <span className={`inline-block w-2 h-2 rounded-full ${status === 'loading' ? 'bg-yellow-200' : status === 'success' ? 'bg-emerald-200' : status === 'error' ? 'bg-red-200' : 'bg-gray-300'}`} />
      {labels[status]}
    </span>
  )
}

export default function MockStatusPage() {
  const [token, setToken] = useState(null)
  const [testResults, setTestResults] = useState({})
  const [currentTest, setCurrentTest] = useState(null)
  const [lastResponse, setLastResponse] = useState(null)
  const [socketEvents, setSocketEvents] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const [socket, setSocket] = useState(null)

  const runTest = useCallback(async (endpoint) => {
    const key = `${endpoint.method} ${endpoint.path}`
    setTestResults(prev => ({ ...prev, [key]: 'loading' }))
    setCurrentTest(key)

    try {
      const headers = { 'Content-Type': 'application/json' }
      if (endpoint.auth && token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const effectiveMethod = endpoint.methodOverride || endpoint.method
      const init = { method: effectiveMethod, headers }

      if (effectiveMethod !== 'GET' && endpoint.body) {
        init.body = JSON.stringify(endpoint.body)
      }

      const res = await fetch(endpoint.path, init)
      const data = await res.json()
      setLastResponse({ key, method: effectiveMethod, path: endpoint.path, status: res.status, data })

      if (res.ok) {
        setTestResults(prev => ({ ...prev, [key]: 'success' }))
        if (endpoint.path === '/api/auth/login' && data.token) {
          setToken(data.token)
        }
      } else {
        setTestResults(prev => ({ ...prev, [key]: 'error' }))
      }
    } catch (err) {
      setTestResults(prev => ({ ...prev, [key]: 'error' }))
      setLastResponse({ key, method: endpoint.methodOverride || endpoint.method, path: endpoint.path, status: 0, data: { error: err.message } })
    }

    setCurrentTest(null)
  }, [token])

  const runAllTests = useCallback(async () => {
    const newResults = {}
    for (const ep of ENDPOINTS) {
      const key = `${ep.method} ${ep.path}`
      newResults[key] = 'pending'
    }
    setTestResults(newResults)

    const loginEp = ENDPOINTS.find(e => e.path === '/api/auth/login')
    await runTest(loginEp)

    for (const ep of ENDPOINTS) {
      if (ep.path !== '/api/auth/login') {
        await new Promise(r => setTimeout(r, 100))
        await runTest(ep)
      }
    }
  }, [runTest])

  const connectSocket = useCallback(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'
    const s = io(`${SOCKET_URL}/game`, { timeout: 5000 })

    s.on('connect', () => {
      setSocketConnected(true)
      setSocketEvents(prev => [...prev.slice(-49), { type: 'connected', data: { url: SOCKET_URL }, time: new Date().toLocaleTimeString() }])
    })

    s.on('disconnect', () => {
      setSocketConnected(false)
      setSocketEvents(prev => [...prev.slice(-49), { type: 'disconnected', data: {}, time: new Date().toLocaleTimeString() }])
    })

    s.onAny((event, ...args) => {
      setSocketEvents(prev => [...prev.slice(-49), { type: event, data: args[0] || {}, time: new Date().toLocaleTimeString() }])
    })

    setSocket(s)
  }, [])

  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
      setSocketConnected(false)
    }
  }, [socket])

  const simulateSubscribe = useCallback(() => {
    if (!socket || !socketConnected) return
    const testRoom = 'MOCK01'
    socket.emit('game:join', { roomCode: testRoom, username: 'dev_tester' })
    setSocketEvents(prev => [...prev.slice(-49), { type: 'emit', data: { event: 'game:join', payload: { roomCode: testRoom } }, time: new Date().toLocaleTimeString() }])
  }, [socket, socketConnected])

  const simulateGameFlow = useCallback(() => {
    if (!socket || !socketConnected) return
    const testRoom = 'MOCK01'
    socket.emit('game:join', { roomCode: testRoom, username: 'host_dev' })
    setSocketEvents(prev => [...prev.slice(-49), { type: 'emit', data: { event: 'game:join', payload: { roomCode: testRoom } }, time: new Date().toLocaleTimeString() }])

    setTimeout(() => {
      setSocketEvents(prev => [...prev.slice(-49), { type: 'emit', data: { event: 'game:start', payload: { roomCode: testRoom } }, time: new Date().toLocaleTimeString() }])
    }, 500)

    setTimeout(() => {
      setSocketEvents(prev => [...prev.slice(-49), { type: 'emit', data: { event: 'game:submit', payload: { roomCode: testRoom, snippetId: 1, answer: 'Type coercion' } }, time: new Date().toLocaleTimeString() }])
    }, 4000)

    setTimeout(() => {
      setSocketEvents(prev => [...prev.slice(-49), { type: 'emit', data: { event: 'game:ready', payload: { roomCode: testRoom } }, time: new Date().toLocaleTimeString() }])
    }, 5000)
  }, [socket, socketConnected])

  const clearSocketLogs = useCallback(() => setSocketEvents([]), [])

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect()
    }
  }, [socket])

  const passed = Object.values(testResults).filter(s => s === 'success').length
  const total = ENDPOINTS.length

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mock Status Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Environment: <span className="text-emerald-400 font-mono">MOCK (MSW Active)</span>
          </p>
        </div>
        <div className="flex gap-3">
          <a href="/" className="text-gray-400 hover:text-white text-sm underline">Back to App</a>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                REST API
                <span className="text-xs text-gray-500">
                  ({passed}/{total} pass)
                </span>
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={runAllTests}
                  className="px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors"
                >
                  Test All REST
                </button>
              </div>
            </div>

            <div className="space-y-1 max-h-80 overflow-y-auto">
              {ENDPOINTS.map((ep) => {
                const key = `${ep.method} ${ep.path}`
                const status = testResults[key] || 'pending'
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${ep.methodOverride || ep.method === 'GET' ? 'bg-blue-900 text-blue-300' : 'bg-purple-900 text-purple-300'}`}>
                        {ep.methodOverride || ep.method}
                      </span>
                      <span className="font-mono text-sm text-gray-300">{ep.path}</span>
                      <span className="text-xs text-gray-500 hidden group-hover:inline">{ep.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={currentTest === key ? 'loading' : status} />
                      <button
                        onClick={() => runTest(ep)}
                        className="text-xs text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                      >
                        Retest
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
            <h2 className="text-lg font-semibold mb-3">Response Inspector</h2>
            {lastResponse ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${lastResponse.method === 'GET' ? 'bg-blue-900 text-blue-300' : 'bg-purple-900 text-purple-300'}`}>
                    {lastResponse.method}
                  </span>
                  <span className="font-mono text-sm text-gray-300">{lastResponse.path}</span>
                  <span className={`text-xs font-mono ${lastResponse.status >= 200 && lastResponse.status < 300 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {lastResponse.status > 0 ? lastResponse.status : 'ERR'}
                  </span>
                </div>
                <pre className="bg-gray-950 rounded p-3 text-xs text-green-400 font-mono overflow-x-auto max-h-60 overflow-y-auto">
                  {JSON.stringify(lastResponse.data, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Click &quot;Retest&quot; on any endpoint to see the response.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
            <h2 className="text-lg font-semibold mb-3">Socket.IO</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-block w-3 h-3 rounded-full ${socketConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className="text-sm text-gray-300">
                {socketConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {!socketConnected ? (
                <button
                  onClick={connectSocket}
                  className="px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors"
                >
                  Connect
                </button>
              ) : (
                <>
                  <button
                    onClick={simulateSubscribe}
                    className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                  >
                    Join Room
                  </button>
                  <button
                    onClick={simulateGameFlow}
                    className="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors"
                  >
                    Simulate Game
                  </button>
                  <button
                    onClick={disconnectSocket}
                    className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
                  >
                    Disconnect
                  </button>
                </>
              )}
              {socketEvents.length > 0 && (
                <button
                  onClick={clearSocketLogs}
                  className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Clear Logs
                </button>
              )}
            </div>
          </div>

          {socketEvents.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <h3 className="text-sm font-semibold mb-2 flex items-center justify-between">
                Event Log
                <span className="text-xs text-gray-500 font-normal">{socketEvents.length} events</span>
              </h3>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {[...socketEvents].reverse().map((evt, i) => {
                  const isReceived = !['emit', 'connected', 'disconnected'].includes(evt.type)
                  return (
                    <div key={i} className="text-xs font-mono flex gap-2">
                      <span className="text-gray-600 w-16 shrink-0">{evt.time}</span>
                      <span className={isReceived ? 'text-green-400' : evt.type === 'disconnected' ? 'text-red-400' : 'text-yellow-400'}>
                        {isReceived ? '\u2190' : '\u2192'} {isReceived ? evt.type : `emit:${evt.data?.event || evt.type}`}
                      </span>
                      {evt.data && evt.type !== 'connected' && evt.type !== 'disconnected' && (
                        <span className="text-gray-500 truncate">
                          {JSON.stringify(isReceived ? evt.data : evt.data.payload || evt.data).slice(0, 60)}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
