import type { NextRequest } from 'next/server'
import { createTicket, listTickets } from '@/lib/tickets'
import { checkInSchema } from '@/lib/validation'
import { isTicketStatus, type TicketStatus } from '@/lib/ticket'
import { handleError, ok } from '@/lib/api'

// GET /api/tickets?status=waiting,serving — today's tickets, optionally filtered.
export async function GET(request: NextRequest) {
  try {
    const raw = request.nextUrl.searchParams.get('status')
    const statuses = raw
      ? raw
          .split(',')
          .map((s) => s.trim())
          .filter(isTicketStatus)
      : undefined
    const tickets = await listTickets(statuses as TicketStatus[] | undefined)
    return ok(tickets)
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/tickets — patient check-in. Returns the created ticket.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const input = checkInSchema.parse(body)
    const ticket = await createTicket(input)
    return ok(ticket, 201)
  } catch (error) {
    return handleError(error)
  }
}
