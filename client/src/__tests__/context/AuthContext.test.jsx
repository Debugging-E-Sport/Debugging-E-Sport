import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuthContext } from '../../context/AuthContext'

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

import { api } from '../../api/client'

// Mock localStorage (jsdom in some vitest versions doesn't provide full localStorage)
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()

vi.stubGlobal('localStorage', localStorageMock)

// Helper: wrapper component for renderHook
function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorageMock.clear()
  })

  describe('initial state', () => {
    it('should have null user and not authenticated initially', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper })
      expect(result.current.user).toBeNull()
      expect(result.current.token).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should check auth and complete when localStorage is empty', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper })
      // With empty localStorage, isCheckingAuth should quickly resolve to false
      expect(result.current.isCheckingAuth).toBe(false)
    })
  })

  describe('login', () => {
    it('should login successfully and set user data', async () => {
      const mockUser = { id: '1', username: 'testuser' }
      const mockToken = 'mock-jwt-token'
      api.post.mockResolvedValueOnce({ data: { ...mockUser, token: mockToken } })

      const { result } = renderHook(() => useAuthContext(), { wrapper })

      let success
      await act(async () => {
        success = await result.current.login('testuser', 'password123')
      })

      expect(success).toBe(true)
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.token).toBe(mockToken)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()

      // Check localStorage persistence
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('should handle login failure and set error', async () => {
      const errorMsg = 'Invalid credentials'
      api.post.mockRejectedValueOnce({
        response: { data: { error: errorMsg } },
      })

      const { result } = renderHook(() => useAuthContext(), { wrapper })

      let success
      await act(async () => {
        success = await result.current.login('baduser', 'wrongpass')
      })

      expect(success).toBe(false)
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.error).toBe(errorMsg)
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle network errors with default message', async () => {
      api.post.mockRejectedValueOnce(new Error('Network Error'))

      const { result } = renderHook(() => useAuthContext(), { wrapper })

      let success
      await act(async () => {
        success = await result.current.login('testuser', 'password')
      })

      expect(success).toBe(false)
      expect(result.current.error).toBe('Login failed. Check your credentials.')
    })
  })

  describe('register', () => {
    it('should register successfully', async () => {
      api.post.mockResolvedValueOnce({ data: { message: 'ok' } })

      const { result } = renderHook(() => useAuthContext(), { wrapper })

      let success
      await act(async () => {
        success = await result.current.register('newuser', 'password123')
      })

      expect(success).toBe(true)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle registration failure', async () => {
      const errorMsg = 'Username already exists'
      api.post.mockRejectedValueOnce({
        response: { data: { error: errorMsg } },
      })

      const { result } = renderHook(() => useAuthContext(), { wrapper })

      let success
      await act(async () => {
        success = await result.current.register('existinguser', 'pass')
      })

      expect(success).toBe(false)
      expect(result.current.error).toBe(errorMsg)
    })

    it('should handle registration network error', async () => {
      api.post.mockRejectedValueOnce(new Error('Offline'))

      const { result } = renderHook(() => useAuthContext(), { wrapper })

      let success
      await act(async () => {
        success = await result.current.register('newuser', 'pass')
      })

      expect(success).toBe(false)
      expect(result.current.error).toBe('Registration failed.')
    })
  })

  describe('logout', () => {
    it('should clear auth state on logout', async () => {
      // Login first
      api.post.mockResolvedValueOnce({
        data: { id: '1', username: 'testuser', token: 'token123' },
      })

      const { result } = renderHook(() => useAuthContext(), { wrapper })

      await act(async () => {
        await result.current.login('testuser', 'pass')
      })

      expect(result.current.isAuthenticated).toBe(true)

      // Now logout
      act(() => {
        result.current.logout()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.token).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('bugbrawl_auth')
    })
  })

  describe('persisted auth', () => {
    it('should restore auth from localStorage', async () => {
      const mockUser = { id: '1', username: 'persistedUser' }
      const mockToken = 'persisted-token'

      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({ user: mockUser, token: mockToken })
      )

      api.get.mockResolvedValueOnce({ data: mockUser })

      const { result } = renderHook(() => useAuthContext(), { wrapper })

      // Wait for the effect to run
      await vi.waitFor(() => {
        expect(result.current.isCheckingAuth).toBe(false)
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.token).toBe(mockToken)
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('should clear auth if /auth/me fails', async () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({ user: { id: '1', username: 'bad' }, token: 'expired' })
      )

      api.get.mockRejectedValueOnce(new Error('Unauthorized'))

      const { result } = renderHook(() => useAuthContext(), { wrapper })

      await vi.waitFor(() => {
        expect(result.current.isCheckingAuth).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should clear auth if localStorage has corrupt data', async () => {
      localStorageMock.getItem.mockReturnValue('not-valid-json{')

      const { result } = renderHook(() => useAuthContext(), { wrapper })

      await vi.waitFor(() => {
        expect(result.current.isCheckingAuth).toBe(false)
      })

      expect(localStorageMock.removeItem).toHaveBeenCalled()
    })
  })
})
