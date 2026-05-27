// Pure, framework-free ticket helpers. Kept side-effect free so they are
// trivial to unit test.

export const TICKET_STATUSES = ['waiting', 'serving', 'completed', 'cancelled'] as const

export type TicketStatus = (typeof TICKET_STATUSES)[number]

export const ACTIVE_STATUSES: readonly TicketStatus[] = ['waiting', 'serving']

export function isTicketStatus(value: string): value is TicketStatus {
  return (TICKET_STATUSES as readonly string[]).includes(value)
}

// Display code from a per-day sequential number, e.g. 37 -> "037".
export function formatTicketCode(num: number): string {
  if (!Number.isInteger(num) || num < 0) {
    throw new Error(`Invalid ticket number: ${num}`)
  }
  return String(num).padStart(3, '0')
}

// Midnight (local server time) for the supplied date. Used to scope the daily
// ticket counter so numbers reset each day.
export function startOfDay(date: Date = new Date()): Date {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

// Serialize/parse the selected services stored as a JSON string column.
export function encodeServices(services: readonly string[]): string {
  return JSON.stringify([...services])
}

export function decodeServices(raw: string | null | undefined): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : []
  } catch {
    return []
  }
}
