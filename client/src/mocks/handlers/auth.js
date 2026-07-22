import { http, HttpResponse } from 'msw'
import { users } from '../data/users.js'
import { createToken, verifyToken } from '../data/store.js'

export const authHandlers = [
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return HttpResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    const exists = users.find(u => u.username === username)
    if (exists) {
      return HttpResponse.json({ error: 'Username already exists' }, { status: 409 })
    }

    const newUser = { id: users.length + 1, username, password }
    users.push(newUser)

    return HttpResponse.json({ id: newUser.id, username: newUser.username }, { status: 201 })
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json()
    const { username, password } = body

    const user = users.find(u => u.username === username && u.password === password)
    if (!user) {
      return HttpResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    const token = await createToken(user.id, user.username)
    return HttpResponse.json({ id: user.id, token, username: user.username })
  }),

  http.get('/api/auth/me', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(authHeader)
    if (!user) {
      return HttpResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    return HttpResponse.json({ id: user.userId, username: user.username })
  }),
]
