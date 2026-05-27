import { getTicketByCode, waitingAhead } from '@/lib/tickets'
import { handleError, fail, ok } from '@/lib/api'

// GET /api/tickets/code/:code — single ticket plus its current queue position.
// Used by the patient confirmation screen to poll for live status.
export async function GET(_request: Request, ctx: RouteContext<'/api/tickets/code/[code]'>) {
  try {
    const { code } = await ctx.params
    const ticket = await getTicketByCode(code)
    if (!ticket) {
      return fail('Ticket not found', 404)
    }
    const ahead = ticket.status === 'waiting' ? await waitingAhead(ticket.number) : 0
    return ok({ ticket, ahead })
  } catch (error) {
    return handleError(error)
  }
}
