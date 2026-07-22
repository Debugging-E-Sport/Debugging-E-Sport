import { http, HttpResponse } from 'msw'
import { snippets } from '../data/snippets.js'

export const snippetHandlers = [
  http.get('/api/snippets/random', () => {
    const idx = Math.floor(Math.random() * snippets.length)
    const snippet = snippets[idx]
    return HttpResponse.json({
      id: snippet.id,
      title: snippet.title,
      context: snippet.context,
      code: snippet.code,
      max_score: snippet.max_score,
    })
  }),

  http.get('/api/snippets/:id', ({ params }) => {
    const id = parseInt(params.id, 10)
    const snippet = snippets.find(s => s.id === id)
    if (!snippet) {
      return HttpResponse.json({ error: 'Snippet not found' }, { status: 404 })
    }

    return HttpResponse.json({
      id: snippet.id,
      title: snippet.title,
      context: snippet.context,
      code: snippet.code,
      max_score: snippet.max_score,
    })
  }),

  http.get('/api/snippets', () => {
    return HttpResponse.json(
      snippets.map(s => ({ id: s.id, title: s.title }))
    )
  }),
]
