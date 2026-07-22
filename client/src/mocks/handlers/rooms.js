import { http, HttpResponse } from 'msw'
import { verifyToken, createRoom, getRoom, joinRoom, startRoom } from '../data/store.js'

export const roomHandlers = [
  http.post('/api/rooms', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(authHeader)
    if (!user) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const room = createRoom(user.userId, user.username)
    return HttpResponse.json(room, { status: 201 })
  }),

  http.post('/api/rooms/:code/join', async ({ request, params }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(authHeader)
    if (!user) {
      return HttpResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const result = joinRoom(params.code, user.userId, user.username)
    if (result.error) {
      return HttpResponse.json({ error: result.error }, { status: result.status })
    }

    return HttpResponse.json(result.room)
  }),

  http.get('/api/rooms/:code', async ({ params }) => {
    const room = getRoom(params.code)
    if (!room) {
      return HttpResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    return HttpResponse.json(room)
  }),

  http.post('/api/rooms/:code/start', async ({ request, params }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(authHeader)
    if (!user) {
      return HttpResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const room = getRoom(params.code)
    if (!room) {
      return HttpResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (room.host_id !== user.userId) {
      return HttpResponse.json({ error: 'Only host can start the game' }, { status: 403 })
    }

    const updated = startRoom(params.code)
    return HttpResponse.json(updated)
  }),
]
