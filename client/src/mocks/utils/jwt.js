import { verifyToken as storeVerify } from '../data/store.js'

export async function extractUser(request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) return null
  return storeVerify(authHeader)
}

export async function requireAuth(request) {
  const user = await extractUser(request)
  if (!user) {
    return { error: true, response: Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { error: false, user }
}
