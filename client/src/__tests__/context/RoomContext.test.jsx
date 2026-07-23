import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { RoomProvider, useRoom } from '../../context/RoomContext'

// Mock the api client
vi.mock('../../api/client', () => {
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
  }
  return {
    api: mockApi,
    AUTH_KEY: 'bugbrawl_auth',
  }
})

// Mock react-router useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

import { api } from '../../api/client'

// Helper: wrapper component for renderHook
function wrapper({ children }) {
  return (
    <MemoryRouter>
      <RoomProvider>{children}</RoomProvider>
    </MemoryRouter>
  )
}

describe('RoomContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigate.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have null room initially', () => {
      const { result } = renderHook(() => useRoom(), { wrapper })
      expect(result.current.currentRoom).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('createRoom', () => {
    it('should create room and navigate to it', async () => {
      const mockRoom = {
        id: '1',
        code: 'ABC123',
        host: 'testuser',
        players: ['testuser'],
        status: 'waiting',
      }
      api.post.mockResolvedValueOnce({ data: mockRoom })

      const { result } = renderHook(() => useRoom(), { wrapper })

      await act(async () => {
        await result.current.createRoom()
      })

      expect(result.current.currentRoom).toEqual(mockRoom)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(mockNavigate).toHaveBeenCalledWith('/room/ABC123')
      expect(api.post).toHaveBeenCalledWith('/rooms')
    })

    it('should handle create room failure', async () => {
      const errorMsg = 'Room creation failed'
      api.post.mockRejectedValueOnce({
        response: { data: { error: errorMsg } },
      })

      const { result } = renderHook(() => useRoom(), { wrapper })

      await act(async () => {
        await result.current.createRoom()
      })

      expect(result.current.error).toBe(errorMsg)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.currentRoom).toBeNull()
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should handle create room network error', async () => {
      api.post.mockRejectedValueOnce(new Error('Network down'))

      const { result } = renderHook(() => useRoom(), { wrapper })

      await act(async () => {
        await result.current.createRoom()
      })

      expect(result.current.error).toBe('Failed to create room')
    })
  })

  describe('joinRoom', () => {
    it('should join room and navigate', async () => {
      const mockRoom = {
        id: '2',
        code: 'XYZ789',
        host: 'hostuser',
        players: ['hostuser', 'newPlayer'],
        status: 'waiting',
      }
      api.post.mockResolvedValueOnce({ data: mockRoom })

      const { result } = renderHook(() => useRoom(), { wrapper })

      await act(async () => {
        await result.current.joinRoom('XYZ789')
      })

      expect(result.current.currentRoom).toEqual(mockRoom)
      expect(result.current.isLoading).toBe(false)
      expect(mockNavigate).toHaveBeenCalledWith('/room/XYZ789')
      expect(api.post).toHaveBeenCalledWith('/rooms/XYZ789/join')
    })

    it('should not join room with empty code', async () => {
      const { result } = renderHook(() => useRoom(), { wrapper })

      await act(async () => {
        await result.current.joinRoom('')
      })

      expect(api.post).not.toHaveBeenCalled()
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle join room failure', async () => {
      const errorMsg = 'Room not found'
      api.post.mockRejectedValueOnce({
        response: { data: { error: errorMsg } },
      })

      const { result } = renderHook(() => useRoom(), { wrapper })

      await act(async () => {
        await result.current.joinRoom('BADCODE')
      })

      expect(result.current.error).toBe(errorMsg)
      expect(result.current.isLoading).toBe(false)
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should handle join room network error', async () => {
      api.post.mockRejectedValueOnce(new Error('Offline'))

      const { result } = renderHook(() => useRoom(), { wrapper })

      await act(async () => {
        await result.current.joinRoom('ANY')
      })

      expect(result.current.error).toBe('Failed to join room')
    })
  })

  describe('fetchRoom', () => {
    it('should fetch room successfully', async () => {
      const mockRoom = {
        id: '3',
        code: 'ROOM1',
        host: 'host',
        players: ['host', 'player2'],
        status: 'playing',
      }
      api.get.mockResolvedValueOnce({ data: mockRoom })

      const { result } = renderHook(() => useRoom(), { wrapper })

      await act(async () => {
        await result.current.fetchRoom('ROOM1')
      })

      expect(result.current.currentRoom).toEqual(mockRoom)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(api.get).toHaveBeenCalledWith('/rooms/ROOM1')
    })

    it('should handle fetch room failure and redirect', async () => {
      const errorMsg = 'Room not found'
      api.get.mockRejectedValueOnce({
        response: { data: { error: errorMsg } },
      })

      const { result } = renderHook(() => useRoom(), { wrapper })

      await act(async () => {
        await result.current.fetchRoom('GONE')
      })

      expect(result.current.error).toBe(errorMsg)
      expect(result.current.isLoading).toBe(false)
      expect(mockNavigate).toHaveBeenCalledWith('/select/role')
    })

    it('should handle fetch room network error', async () => {
      api.get.mockRejectedValueOnce(new Error('Timed out'))

      const { result } = renderHook(() => useRoom(), { wrapper })

      await act(async () => {
        await result.current.fetchRoom('ROOM')
      })

      expect(result.current.error).toBe('Failed to fetch room')
      expect(mockNavigate).toHaveBeenCalledWith('/select/role')
    })
  })

  describe('useRoom error', () => {
    it('should throw if used outside RoomProvider', () => {
      // Suppress error output for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => useRoom())
      }).toThrow('useRoom must be used within a RoomProvider')

      consoleError.mockRestore()
    })
  })
})
