import { SignJWT, jwtVerify } from 'jose'

const MOCK_SECRET = new TextEncoder().encode('bugbrawl-mock-secret-key-2026')
const TOKEN_EXPIRY = '1h'

const store = {
  rooms: {},
}

export function resetStore() {
  store.rooms = {}
}

export async function createToken(userId, username) {
  return new SignJWT({ id: userId, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(MOCK_SECRET)
}

export async function verifyToken(token) {
  if (!token) return null
  const parsed = token.startsWith('Bearer ') ? token.slice(7) : token
  try {
    const { payload } = await jwtVerify(parsed, MOCK_SECRET)
    return { userId: payload.id, username: payload.username }
  } catch {
    return null
  }
}

export function createRoom(hostId, hostUsername) {
  const code = generateCode()
  const room = {
    id: Date.now(),
    code,
    host_id: hostId,
    host_username: hostUsername,
    status: 'waiting',
    players: [{ id: hostId, username: hostUsername }],
    scores: {},
    rounds: [],
    currentRound: 0,
    created_at: new Date().toISOString(),
  }
  store.rooms[code] = room
  return room
}

export function getRoom(code) {
  return store.rooms[code] || null
}

export function joinRoom(code, userId, username) {
  const room = store.rooms[code]
  if (!room) return { error: 'Room not found', status: 404 }
  if (room.status !== 'waiting') return { error: 'Game already started', status: 400 }
  const exists = room.players.find(p => p.id === userId)
  if (!exists) {
    room.players.push({ id: userId, username })
  }
  return { room }
}

export function startRoom(code) {
  const room = store.rooms[code]
  if (!room) return null
  room.status = 'playing'
  room.started_at = new Date().toISOString()
  return room
}

export function addScore(roomCode, userId, username, snippetId, score, maxScore, feedback, bugsFound, bugsPartial, bugsMissed, answer) {
  const room = store.rooms[roomCode]
  if (!room) return null
  if (!room.scores[userId]) {
    room.scores[userId] = { userId, username, totalScore: 0, submissions: [] }
  }
  room.scores[userId].totalScore += score
  room.scores[userId].submissions.push({
    snippetId,
    score,
    maxScore,
    feedback,
    bugsFound,
    bugsPartial,
    bugsMissed,
    answer,
  })
  return room.scores[userId]
}

export function getLeaderboard(code) {
  const room = store.rooms[code]
  if (!room) return []
  return Object.values(room.scores)
    .map(s => ({ username: s.username, totalScore: s.totalScore }))
    .sort((a, b) => b.totalScore - a.totalScore)
}

export function getResults(code) {
  const room = store.rooms[code]
  if (!room) return null
  const leaderboard = getLeaderboard(code)
  return {
    winner: leaderboard[0] || null,
    finalLeaderboard: leaderboard,
    rounds: room.rounds,
  }
}

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}
