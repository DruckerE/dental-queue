import type { ApiResponse, TicketView } from './types'
import type { CheckInInput, UpdateTicketInput } from './validation'

// Browser-side API helpers. Only imports types, so it is safe in client
// components (nothing here pulls the database into the bundle).

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })

  let body: ApiResponse<T> | null = null
  try {
    body = (await res.json()) as ApiResponse<T>
  } catch {
    // Non-JSON response (e.g. unexpected server crash).
  }

  if (!res.ok || !body?.success) {
    throw new Error(body?.error ?? `Request failed (${res.status})`)
  }
  return body.data as T
}

// SWR fetcher: returns the unwrapped `data` payload or throws.
export function fetcher<T>(url: string): Promise<T> {
  return request<T>(url)
}

export function submitCheckIn(input: CheckInInput): Promise<TicketView> {
  return request<TicketView>('/api/tickets', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function patchTicket(id: string, input: UpdateTicketInput): Promise<TicketView> {
  return request<TicketView>(`/api/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}
