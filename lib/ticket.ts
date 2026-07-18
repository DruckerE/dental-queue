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

// The clinic operates in the Philippines (Asia/Manila, UTC+8, no DST). The
// daily ticket counter and "today" queue filters must roll over at Manila
// midnight — NOT the server's UTC midnight. Otherwise a patient who checks in
// during the early Manila morning is filed under the previous day and vanishes
// from the board once UTC crosses midnight (which is 8 AM in Manila).
const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000

// The UTC instant of the most recent Manila midnight for the supplied time.
export function startOfDay(date: Date = new Date()): Date {
  const manila = new Date(date.getTime() + MANILA_OFFSET_MS)
  const manilaMidnightAsUtc = Date.UTC(
    manila.getUTCFullYear(),
    manila.getUTCMonth(),
    manila.getUTCDate(),
  )
  return new Date(manilaMidnightAsUtc - MANILA_OFFSET_MS)
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
