import type { NextRequest } from 'next/server'
import { updateTicket } from '@/lib/tickets'
import { updateTicketSchema } from '@/lib/validation'
import { handleError, ok } from '@/lib/api'

// PATCH /api/tickets/:id — staff update (status and/or dentist assignment).
export async function PATCH(request: NextRequest, ctx: RouteContext<'/api/tickets/[id]'>) {
  try {
    const { id } = await ctx.params
    const body = await request.json().catch(() => ({}))
    const input = updateTicketSchema.parse(body)
    const ticket = await updateTicket(id, input)
    return ok(ticket)
  } catch (error) {
    return handleError(error)
  }
}
