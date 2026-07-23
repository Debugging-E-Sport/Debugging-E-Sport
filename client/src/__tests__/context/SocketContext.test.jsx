import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { SocketProvider, useSocket } from '../../context/SocketContext'

// Mock socket.io-client
const mockOn = vi.fn()
const mockEmit = vi.fn()
const mockDisconnect = vi.fn()
const mockOff = vi.fn()

const mockSocket = {
  on: mockOn,
  emit: mockEmit,
  disconnect: mockDisconnect,
  off: mockOff,
  connected: true,
}

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => mockSocket),
}))

// Mock AuthContext
const mockUseAuthContext = vi.fn()
vi.mock('../../context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
  AuthContext: { Provider: ({ children, value }) => children },
}))

import { io } from 'socket.io-client'

// Helper: wrapper component for renderHook
function wrapper({ children }) {
  return <SocketProvider>{children}</SocketProvider>
}

describe('SocketContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default auth state: authenticated user
    mockUseAuthContext.mockReturnValue({
      user: { id: '1', username: 'player1' },
      isAuthenticated: true,
    })

    // Reset socket mock state
    mockSocket.connected = true
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have default game state values', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      expect(result.current.isConnected).toBe(false)
      expect(result.current.gameState).toBe('idle')
      expect(result.current.currentRound).toBe(0)
      expect(result.current.currentSnippet).toBeNull()
      expect(result.current.timeLeft).toBe(0)
      expect(result.current.leaderboard).toEqual([])
      expect(result.current.scores).toEqual({})
      expect(result.current.players).toEqual([])
    })
  })

  describe('connect', () => {
    it('should create socket connection and join game room', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM123')
      })

      expect(io).toHaveBeenCalled()
      expect(mockOn).toHaveBeenCalledWith('connect', expect.any(Function))
      expect(mockOn).toHaveBeenCalledWith('disconnect', expect.any(Function))
      expect(mockOn).toHaveBeenCalledWith('game:player-joined', expect.any(Function))
      expect(mockOn).toHaveBeenCalledWith('game:started', expect.any(Function))
      expect(mockOn).toHaveBeenCalledWith('game:round-start', expect.any(Function))
      expect(mockOn).toHaveBeenCalledWith('game:score', expect.any(Function))
      expect(mockOn).toHaveBeenCalledWith('game:all-submitted', expect.any(Function))
      expect(mockOn).toHaveBeenCalledWith('game:leaderboard', expect.any(Function))
      expect(mockOn).toHaveBeenCalledWith('game:over', expect.any(Function))
    })

    it('should not connect if not authenticated', () => {
      mockUseAuthContext.mockReturnValue({
        user: null,
        isAuthenticated: false,
      })

      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM123')
      })

      // io should not be called since connect returns early
      expect(io).not.toHaveBeenCalled()
    })

    it('should simulate connect event updating state', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM123')
      })

      // Simulate the connect callback
      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === 'connect'
      )?.[1]

      act(() => {
        connectHandler()
      })

      expect(result.current.isConnected).toBe(true)
    })
  })

  describe('game events', () => {
    it('should handle game:player-joined event', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      const handler = mockOn.mock.calls.find(
        (call) => call[0] === 'game:player-joined'
      )?.[1]

      act(() => {
        handler({ players: [{ username: 'player1' }, { username: 'player2' }] })
      })

      expect(result.current.players).toHaveLength(2)
    })

    it('should handle game:started event', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      const handler = mockOn.mock.calls.find(
        (call) => call[0] === 'game:started'
      )?.[1]

      act(() => {
        handler({ totalRounds: 3 })
      })

      expect(result.current.gameState).toBe('playing')
      expect(result.current.totalRounds).toBe(3)
    })

    it('should handle game:round-start event', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      const handler = mockOn.mock.calls.find(
        (call) => call[0] === 'game:round-start'
      )?.[1]

      act(() => {
        handler({
          round: 2,
          snippet: { id: 'snip1', code: 'console.log("hi")' },
          timeLimit: 60,
        })
      })

      expect(result.current.currentRound).toBe(2)
      expect(result.current.currentSnippet).toEqual({
        id: 'snip1',
        code: 'console.log("hi")',
      })
      expect(result.current.timeLeft).toBe(60)
      expect(result.current.allSubmitted).toBe(false)
    })

    it('should handle game:round-start with default time limit', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      const handler = mockOn.mock.calls.find(
        (call) => call[0] === 'game:round-start'
      )?.[1]

      act(() => {
        handler({ round: 1, snippet: null })
      })

      expect(result.current.timeLeft).toBe(30)
    })

    it('should handle game:score event', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      const handler = mockOn.mock.calls.find(
        (call) => call[0] === 'game:score'
      )?.[1]

      act(() => {
        handler({ username: 'player1', score: 10 })
      })

      expect(result.current.scores.player1).toBe(10)
      expect(result.current.lastScore).toEqual({
        username: 'player1',
        score: 10,
      })
    })

    it('should accumulate scores from multiple score events', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      const handler = mockOn.mock.calls.find(
        (call) => call[0] === 'game:score'
      )?.[1]

      act(() => {
        handler({ username: 'player1', score: 10 })
      })
      act(() => {
        handler({ username: 'player1', score: 15 })
      })

      expect(result.current.scores.player1).toBe(25)
    })

    it('should handle game:all-submitted event', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      const handler = mockOn.mock.calls.find(
        (call) => call[0] === 'game:all-submitted'
      )?.[1]

      act(() => {
        handler()
      })

      expect(result.current.allSubmitted).toBe(true)
    })

    it('should handle game:leaderboard event', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      const handler = mockOn.mock.calls.find(
        (call) => call[0] === 'game:leaderboard'
      )?.[1]

      const lb = [
        { username: 'p1', totalScore: 100 },
        { username: 'p2', totalScore: 80 },
      ]
      act(() => {
        handler(lb)
      })

      expect(result.current.leaderboard).toEqual(lb)
    })

    it('should handle game:over event', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      const handler = mockOn.mock.calls.find(
        (call) => call[0] === 'game:over'
      )?.[1]

      act(() => {
        handler({
          winner: { username: 'winner1' },
          finalLeaderboard: [{ username: 'winner1', totalScore: 200 }],
        })
      })

      expect(result.current.gameState).toBe('over')
      expect(result.current.winner).toEqual({ username: 'winner1' })
      expect(result.current.finalLeaderboard).toHaveLength(1)
    })

    it('should handle disconnect event', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      // First simulate connect
      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === 'connect'
      )?.[1]
      act(() => { connectHandler() })

      expect(result.current.isConnected).toBe(true)

      // Now simulate disconnect
      const disconnectHandler = mockOn.mock.calls.find(
        (call) => call[0] === 'disconnect'
      )?.[1]
      act(() => { disconnectHandler() })

      expect(result.current.isConnected).toBe(false)
    })
  })

  describe('actions', () => {
    it('should submit answer via socket', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      // Simulate connect
      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === 'connect'
      )?.[1]
      act(() => { connectHandler() })

      mockEmit.mockClear()

      act(() => {
        result.current.submitAnswer('ROOM', 'snip1', 'This is a bug')
      })

      expect(mockEmit).toHaveBeenCalledWith('game:submit', {
        roomCode: 'ROOM',
        snippetId: 'snip1',
        answer: 'This is a bug',
      })
    })

    it('should signal ready via socket', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === 'connect'
      )?.[1]
      act(() => { connectHandler() })

      mockEmit.mockClear()

      act(() => {
        result.current.signalReady('ROOM')
      })

      expect(mockEmit).toHaveBeenCalledWith('game:ready', { roomCode: 'ROOM' })
    })

    it('should emit custom events', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === 'connect'
      )?.[1]
      act(() => { connectHandler() })

      mockEmit.mockClear()

      act(() => {
        result.current.emit('custom:event', { data: 'test' })
      })

      expect(mockEmit).toHaveBeenCalledWith('custom:event', { data: 'test' })
    })

    it('should not emit when disconnected', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      // Don't connect first
      mockEmit.mockClear()

      act(() => {
        result.current.emit('test', {})
      })

      expect(mockEmit).not.toHaveBeenCalled()
    })

    it('should leave game and reset state', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === 'connect'
      )?.[1]
      act(() => { connectHandler() })

      // Set some game state
      const startHandler = mockOn.mock.calls.find(
        (call) => call[0] === 'game:started'
      )?.[1]
      act(() => { startHandler({ totalRounds: 3 }) })

      mockEmit.mockClear()
      mockDisconnect.mockClear()

      act(() => {
        result.current.leaveGame('ROOM')
      })

      expect(mockEmit).toHaveBeenCalledWith('game:leave', { roomCode: 'ROOM' })
      expect(mockDisconnect).toHaveBeenCalled()
      expect(result.current.isConnected).toBe(false)
      expect(result.current.gameState).toBe('idle')
      expect(result.current.currentRound).toBe(0)
      expect(result.current.currentSnippet).toBeNull()
      expect(result.current.timeLeft).toBe(0)
      expect(result.current.leaderboard).toEqual([])
      expect(result.current.scores).toEqual({})
    })

    it('should dismiss score toast', () => {
      const { result } = renderHook(() => useSocket(), { wrapper })

      act(() => {
        result.current.connect('ROOM')
      })

      const scoreHandler = mockOn.mock.calls.find(
        (call) => call[0] === 'game:score'
      )?.[1]
      act(() => {
        scoreHandler({ username: 'player1', score: 10 })
      })

      expect(result.current.lastScore).not.toBeNull()

      act(() => {
        result.current.dismissScoreToast()
      })

      expect(result.current.lastScore).toBeNull()
    })
  })
})
