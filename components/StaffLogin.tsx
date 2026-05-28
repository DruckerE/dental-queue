'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function StaffLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok || !body?.success) {
        throw new Error(body?.error ?? 'Login failed')
      }
      router.replace('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-semibold text-slate-700">
          Username
        </label>
        <input
          id="username"
          type="text"
          autoFocus
          autoComplete="username"
          autoCapitalize="none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>

      {error ? (
        <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
