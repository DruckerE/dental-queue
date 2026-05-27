import { cookies } from 'next/headers'
import { createHash, timingSafeEqual } from 'node:crypto'

// Single shared staff password (set via STAFF_PASSWORD). The session cookie
// holds a hash of the password, so it self-invalidates when the password
// changes and never stores the raw secret. Stateless — no session table.

export const STAFF_COOKIE = 'staff_auth'
const SALT = 'dental-queue::staff'
const SESSION_MAX_AGE = 60 * 60 * 12 // 12 hours

function hash(value: string): string {
  return createHash('sha256').update(`${value}${SALT}`).digest('hex')
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

// Auth is only enforced once a password is configured. Without it, /admin stays
// open so a fresh deploy isn't accidentally locked out.
export function isAuthRequired(): boolean {
  return Boolean(process.env.STAFF_PASSWORD)
}

export function staffToken(): string {
  return hash(process.env.STAFF_PASSWORD ?? '')
}

export function verifyPassword(input: string): boolean {
  if (!isAuthRequired()) return false
  return safeEqual(hash(input), staffToken())
}

export async function isAuthed(): Promise<boolean> {
  if (!isAuthRequired()) return true
  const token = (await cookies()).get(STAFF_COOKIE)?.value
  return token ? safeEqual(token, staffToken()) : false
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE,
}
