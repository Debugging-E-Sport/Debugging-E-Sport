import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useAuthContext } from './AuthContext'
import { useToast } from './ToastContext'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user, isAuthenticated, token } = useAuthContext()
  const toast = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [gameState, setGameState] = useState('idle') // idle, waiting, playing, over
  const [currentRound, setCurrentRound] = useState(0)
  const [totalRounds, setTotalRounds] = useState(0)
  const [currentSnippet, setCurrentSnippet] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [scores, setScores] = useState({})
  const [allSubmitted, setAllSubmitted] = useState(false)
  const [players, setPlayers] = useState([])
  const [winner, setWinner] = useState(null)
  const [finalLeaderboard, setFinalLeaderboard] = useState([])
  const [lastScore, setLastScore] = useState(null) // for toast notification

  const socketRef = useRef(null)
  const currentRoomRef = useRef(null)
  const timerRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const connect = useCallback((roomCode) => {
    if (!isAuthenticated || !user) return

    // Idempotency guard: if already connected to this room, no-op
    if (currentRoomRef.current === roomCode && socketRef.current?.connected) {
      return () => {} // no-op cleanup
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin
    const socket = io(`${socketUrl}/game`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })

    socketRef.current = socket
    currentRoomRef.current = roomCode

    socket.on('connect', () => {
      setIsConnected(true)
      socket.emit('game:join', { roomCode, username: user.username })
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      clearTimer()
    })

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message)
      toast.error('Connection lost. Trying to reconnect...')
      setIsConnected(false)
    })

    // --- Game Events ---
    socket.on('game:player-joined', (data) => {
      setPlayers(data.players || [])
    })

    socket.on('game:player-left', (data) => {
      setPlayers((prev) => prev.filter((p) => p.username !== data.username))
      toast.info(`${data.username} left the room`)
    })

    socket.on('game:started', (data) => {
      setGameState('playing')
      setTotalRounds(data.totalRounds)
    })

    socket.on('game:round-start', (data) => {
      setCurrentRound(data.round)
      setCurrentSnippet(data.snippet)
      setAllSubmitted(false)

      clearTimer()

      const limit = data.timeLimit || 30
      setTimeLeft(limit)

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    })

    socket.on('game:score', (data) => {
      setLastScore(data)
      setScores((prev) => ({
        ...prev,
        [data.username]: (prev[data.username] || 0) + data.score,
      }))
    })

    socket.on('game:all-submitted', () => {
      setAllSubmitted(true)
    })

    socket.on('game:leaderboard', (data) => {
      setLeaderboard(data || [])
    })

    socket.on('game:round-end', () => {
      clearTimer()
    })

    socket.on('game:over', (data) => {
      clearTimer()
      setGameState('over')
      setWinner(data.winner)
      setFinalLeaderboard(data.finalLeaderboard || [])
    })

    return () => {
      clearTimer()
      socket.off()
      socket.disconnect()
      socketRef.current = null
      currentRoomRef.current = null
    }
  }, [isAuthenticated, user, clearTimer])

  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data)
    }
  }, [])

  const submitAnswer = useCallback((roomCode, snippetId, answer) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('game:submit', { roomCode, snippetId, answer })
    }
  }, [])

  const signalReady = useCallback((roomCode) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('game:ready', { roomCode })
    }
  }, [])

  const leaveGame = useCallback((roomCode) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('game:leave', { roomCode })
    }
    clearTimer()
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
    currentRoomRef.current = null
    setIsConnected(false)
    setGameState('idle')
    setCurrentRound(0)
    setCurrentSnippet(null)
    setTimeLeft(0)
    setLeaderboard([])
    setScores({})
    setLastScore(null)
  }, [clearTimer])

  const dismissScoreToast = useCallback(() => {
    setLastScore(null)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer()
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [clearTimer])

  const contextValue = {
    // Connection
    isConnected,
    socket: socketRef.current,
    connect,
    emit,
    leaveGame,

    // Game state
    gameState,
    currentRound,
    totalRounds,
    currentSnippet,
    timeLeft,
    leaderboard,
    scores,
    allSubmitted,
    players,
    winner,
    finalLeaderboard,
    lastScore,
    dismissScoreToast,

    // Actions
    submitAnswer,
    signalReady,
  }

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
