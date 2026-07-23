import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { snippets } from '../src/mocks/data/snippets.js'

const httpServer = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const path = url.pathname

  if (req.method === 'POST' && path.match(/^\/api\/rooms\/([^/]+)\/start$/)) {
    const code = path.split('/')[3]
    const room = gameRooms[code]
    if (!room) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: 'Room not found' }))
    }
    
    room.status = 'playing'
    room.currentRound = 0
    io.of('/game').to(code).emit('game:started', {
      totalRounds: room.totalRounds,
      roundDuration: 30,
    })
    setTimeout(() => startRound(code), 2000)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ status: 'playing', started_at: new Date().toISOString() }))
  }

  if (req.method === 'GET' && path.match(/^\/api\/rooms\/([^/]+)\/results$/)) {
    const code = path.split('/')[3]
    const room = gameRooms[code]
    if (!room) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: 'Room not found' }))
    }

    const leaderboard = Object.entries(room.scores)
      .map(([, val]) => ({ username: val.username, totalScore: val.totalScore }))
      .sort((a, b) => b.totalScore - a.totalScore)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({
      winner: leaderboard[0] || null,
      finalLeaderboard: leaderboard,
      rounds: []
    }))
  }
})
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
})

const gameRooms = {}

function broadcastPlayers(code) {
  const room = gameRooms[code]
  if (!room) return
  io.to(code).emit('game:player-joined', {
    players: room.players.map(p => ({ username: p.username })),
    playerCount: room.players.length,
  })
}

const game = io.of('/game')

game.on('connection', (socket) => {
  let currentUser = null
  let currentRoom = null

  socket.on('game:join', ({ roomCode, username }) => {
    if (!gameRooms[roomCode]) {
      gameRooms[roomCode] = { players: [], status: 'waiting', scores: {}, currentRound: 0, totalRounds: 3 }
    }

    const room = gameRooms[roomCode]
    if (room.status !== 'waiting') {
      socket.emit('error', { message: 'Game already started' })
      return
    }

    currentUser = { id: socket.id, username }
    currentRoom = roomCode
    room.players.push(currentUser)
    room.scores[socket.id] = { username, totalScore: 0 }

    socket.join(roomCode)
    broadcastPlayers(roomCode)
  })

  socket.on('game:leave', ({ roomCode }) => {
    const room = gameRooms[roomCode]
    if (room) {
      room.players = room.players.filter(p => p.id !== socket.id)
      delete room.scores[socket.id]
      broadcastPlayers(roomCode)
    }
    socket.leave(roomCode)
    currentRoom = null
  })

  socket.on('game:start', ({ roomCode }) => {
    const room = gameRooms[roomCode]
    if (!room) return
    room.status = 'playing'
    room.currentRound = 0

    io.of('/game').to(roomCode).emit('game:started', {
      totalRounds: room.totalRounds,
      roundDuration: 30,
    })

    setTimeout(() => startRound(roomCode), 2000)
  })

  socket.on('game:submit', ({ roomCode, snippetId, answer }) => {
    const room = gameRooms[roomCode]
    if (!room) return

    const snippet = snippets.find(s => s.id === snippetId)
    if (!snippet) return

    const lowerAnswer = (answer || '').toLowerCase()
    let score = 0
    const bugsFound = []
    const bugsPartial = []
    const bugsMissed = []

    if (lowerAnswer.length >= 5) {
      for (const bug of snippet.bug_descriptions) {
        const keywords = bug.description.split(' ').filter(k => k.length > 3)
        const matched = keywords.filter(k => lowerAnswer.includes(k.toLowerCase()))
        if (matched.length / keywords.length > 0.3) {
          bugsFound.push(bug.id)
          score += bug.points
        } else if (matched.length > 0) {
          bugsPartial.push(bug.id)
          score += Math.floor(bug.points * 0.5)
        } else {
          bugsMissed.push(bug.id)
        }
      }
    }

    const feedback = bugsFound.length === snippet.bug_descriptions.length
      ? 'Mantap! Kamu menemukan semua bug!'
      : bugsFound.length > 0
        ? `Bagus! Kamu menemukan ${bugsFound.length} bug.`
        : 'Jawaban belum menyebutkan bug yang dimaksud.'

    room.scores[socket.id].totalScore += score

    socket.emit('game:score', {
      username: currentUser?.username || 'unknown',
      score,
      maxScore: snippet.max_score,
      feedback,
      bugsFound,
      bugsPartial,
      bugsMissed,
    })
  })

  socket.on('game:ready', ({ roomCode }) => {
    const room = gameRooms[roomCode]
    if (!room) return
    room.readyCount = (room.readyCount || 0) + 1

    if (room.readyCount >= room.players.length) {
      room.readyCount = 0
      io.of('/game').to(roomCode).emit('game:all-submitted', { round: room.currentRound })

      const leaderboard = Object.entries(room.scores)
        .map(([, val]) => ({ username: val.username, totalScore: val.totalScore }))
        .sort((a, b) => b.totalScore - a.totalScore)

      io.of('/game').to(roomCode).emit('game:leaderboard', leaderboard)
      io.of('/game').to(roomCode).emit('game:round-end', { round: room.currentRound })

      setTimeout(() => {
        room.currentRound++
        if (room.currentRound >= room.totalRounds) {
          io.of('/game').to(roomCode).emit('game:over', {
            winner: leaderboard[0] || null,
            finalLeaderboard: leaderboard,
          })
        } else {
          startRound(roomCode)
        }
      }, 3000)
    }
  })

  socket.on('disconnect', () => {
    if (currentRoom) {
      const room = gameRooms[currentRoom]
      if (room) {
        room.players = room.players.filter(p => p.id !== socket.id)
        delete room.scores[socket.id]
        io.of('/game').to(currentRoom).emit('game:player-left', {
          username: currentUser?.username || 'unknown',
          playerCount: room.players.length,
        })
      }
    }
  })
})

function startRound(roomCode) {
  const room = gameRooms[roomCode]
  if (!room) return

  const snippet = snippets[room.currentRound % snippets.length]
  io.of('/game').to(roomCode).emit('game:round-start', {
    round: room.currentRound + 1,
    snippet: {
      id: snippet.id,
      title: snippet.title,
      context: snippet.context,
      code: snippet.code,
    },
    timeLimit: 30,
  })
}

const PORT = process.env.SOCKET_PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`[mock-socket] Socket.IO mock server running on ws://localhost:${PORT}/game`)
})
