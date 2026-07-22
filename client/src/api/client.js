import axios from 'axios'

const API_URL = '/api'
const AUTH_KEY = 'bugbrawl_auth'

export const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem(AUTH_KEY)
  if (raw) {
    try {
      const { token } = JSON.parse(raw)
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch { /* ignore */ }
  }
  return config
})

export { AUTH_KEY }
