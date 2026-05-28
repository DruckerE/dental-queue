import { cookies } from 'next/headers'
import { createHash, timingSafeEqual } from 'node:crypto'

// Username + shared password staff login. The username is not secret (defaults
// to "admin_bautista"); the password is read from STAFF_PASSWORD and is never
// stored in the repo. The session cookie holds a hash of both, so it
// self-invalidates if either changes and never stores the raw secret.

export const STAFF_COOKIE = 'staff_auth'
const SALT = 'dental-queue::staff'
const SESSION_MAX_AGE = 60 * 60 * 12 // 12 hours
const DEFAULT_USERNAME = 'admin_bautista'

function hash(value: string): string {
  return createHash('sha256').update(`${value}${SALT}`).digest('hex')
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

export function staffUsername(): string {
  return (process.env.STAFF_USERNAME ?? DEFAULT_USERNAME).trim()
}

function staffPassword(): string {
  return process.env.STAFF_PASSWORD ?? ''
}

// Auth is only enforced once a password is configured. Without it, /admin stays
// open so a fresh deploy isn't accidentally locked out.
export function isAuthRequired(): boolean {
  return Boolean(staffPassword())
}

// Session token ties to both username and password.
export function staffToken(): string {
  return hash(`${staffUsername()}:${staffPassword()}`)
}

export function verifyCredentials(username: string, password: string): boolean {
  if (!isAuthRequired()) return false
  const okUser = safeEqual(hash(username.trim()), hash(staffUsername()))
  const okPass = safeEqual(hash(password), hash(staffPassword()))
  return okUser && okPass
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
