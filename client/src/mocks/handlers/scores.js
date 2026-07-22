import { http, HttpResponse } from 'msw'
import { snippets } from '../data/snippets.js'
import { verifyToken, getRoom, addScore, getLeaderboard, getResults } from '../data/store.js'

function simulateScoring(snippetId, answer) {
  const snippet = snippets.find(s => s.id === snippetId)
  if (!snippet) return null

  const lowerAnswer = (answer || '').toLowerCase()
  if (lowerAnswer.length < 5) {
    return { score: 0, maxScore: snippet.max_score, feedback: 'Jawaban terlalu singkat atau kosong.', bugsFound: [], bugsPartial: [], bugsMissed: [] }
  }

  const bugsFound = []
  const bugsPartial = []
  const bugsMissed = []
  let score = 0

  for (const bug of snippet.bug_descriptions) {
    const hasKeyword = bug.description.split(' ').some(keyword =>
      keyword.length > 3 && lowerAnswer.includes(keyword.toLowerCase())
    )

    if (hasKeyword) {
      const fullMatch = bug.description.split(' ').filter(k => k.length > 4 && lowerAnswer.includes(k.toLowerCase())).length
      const ratio = fullMatch / (bug.description.split(' ').filter(k => k.length > 4).length || 1)

      if (ratio > 0.3) {
        bugsFound.push(bug.id)
        score += bug.points
      } else {
        bugsPartial.push(bug.id)
        score += Math.floor(bug.points * 0.5)
      }
    } else {
      bugsMissed.push(bug.id)
    }
  }

  const feedback = bugsFound.length === snippet.bug_descriptions.length
    ? 'Mantap! Kamu berhasil menemukan semua bug. Analisismu sangat baik.'
    : bugsFound.length > 0
      ? `Bagus! Kamu menemukan ${bugsFound.length} bug. Coba periksa lebih detail untuk bug lainnya.`
      : 'Jawabanmu belum menyebutkan bug yang dimaksud. Coba baca kode lebih teliti.'

  return { score, maxScore: snippet.max_score, feedback, bugsFound, bugsPartial, bugsMissed }
}

export const scoreHandlers = [
  http.post('/api/scores/submit', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(authHeader)
    if (!user) {
      return HttpResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { roomCode, snippetId, answer } = body

    const room = getRoom(roomCode)
    if (!room) {
      return HttpResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    const result = simulateScoring(snippetId, answer)
    if (!result) {
      return HttpResponse.json({ error: 'Snippet not found' }, { status: 404 })
    }

    addScore(roomCode, user.userId, user.username, snippetId, result.score, result.maxScore, result.feedback, result.bugsFound, result.bugsPartial, result.bugsMissed, answer)

    return HttpResponse.json(result)
  }),

  http.get('/api/rooms/:code/leaderboard', ({ params }) => {
    const room = getRoom(params.code)
    if (!room) {
      return HttpResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    return HttpResponse.json(getLeaderboard(params.code))
  }),

  http.get('/api/rooms/:code/results', ({ params }) => {
    const room = getRoom(params.code)
    if (!room) {
      return HttpResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    return HttpResponse.json(getResults(params.code))
  }),
]
