import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../api/client'

const RoomContext = createContext(null)

export function RoomProvider({ children }) {
  const [currentRoom, setCurrentRoom] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const createRoom = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.post('/rooms')
      setCurrentRoom(res.data)
      navigate(`/room/${res.data.code}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room')
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  const joinRoom = useCallback(async (code) => {
    if (!code) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.post(`/rooms/${code}/join`)
      setCurrentRoom(res.data)
      navigate(`/room/${code}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join room')
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  const fetchRoom = useCallback(async (code) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.get(`/rooms/${code}`)
      setCurrentRoom(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch room')
      navigate('/select/role') // redirect if room not found
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  return (
    <RoomContext.Provider value={{ currentRoom, isLoading, error, createRoom, joinRoom, fetchRoom }}>
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  const context = useContext(RoomContext)
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider')
  }
  return context
}
