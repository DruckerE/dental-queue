import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import {
  STAFF_COOKIE,
  isAuthRequired,
  sessionCookieOptions,
  staffToken,
  verifyCredentials,
} from '@/lib/auth'
import { fail, handleError, ok } from '@/lib/api'

const loginSchema = z.object({
  username: z.string().min(1, 'Enter your username'),
  password: z.string().min(1, 'Enter your password'),
})

// POST /api/auth/login — exchange staff credentials for a session cookie.
export async function POST(request: NextRequest) {
  try {
    if (!isAuthRequired()) {
      return fail('Staff login is not configured. Set STAFF_PASSWORD to enable it.', 503)
    }
    const body = await request.json().catch(() => ({}))
    const { username, password } = loginSchema.parse(body)

    if (!verifyCredentials(username, password)) {
      return fail('Incorrect username or password', 401)
    }

    const jar = await cookies()
    jar.set(STAFF_COOKIE, staffToken(), sessionCookieOptions)
    return ok({ authed: true })
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/auth/login — log out.
export async function DELETE() {
  const jar = await cookies()
  jar.delete(STAFF_COOKIE)
  return ok({ authed: false })
}
