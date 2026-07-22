import { authHandlers } from './auth.js'
import { roomHandlers } from './rooms.js'
import { snippetHandlers } from './snippets.js'
import { scoreHandlers } from './scores.js'

export const handlers = [
  ...authHandlers,
  ...roomHandlers,
  ...snippetHandlers,
  ...scoreHandlers,
]
