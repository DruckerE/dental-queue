import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import type { ApiResponse } from './types'

export function ok<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status })
}

export function fail(error: string, status = 400): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ success: false, error }, { status })
}

// Turns thrown errors into a consistent JSON response. ZodError -> 400 with the
// first readable message; everything else -> 500 without leaking internals.
export function handleError(error: unknown): NextResponse<ApiResponse<never>> {
  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? 'Invalid request'
    return fail(message, 400)
  }
  console.error('API error:', error)
  return fail('Something went wrong. Please try again.', 500)
}
