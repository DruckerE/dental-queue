import { getTicketByCode, waitingAhead } from '@/lib/tickets'
import { handleError, fail, ok } from '@/lib/api'

// GET /api/tickets/code/:code?branchId=... — one branch ticket plus its current
// queue position. Used by the patient confirmation screen to poll live status.
export async function GET(request: Request, ctx: RouteContext<'/api/tickets/code/[code]'>) {
  try {
    const { code } = await ctx.params
    const branchId = new URL(request.url).searchParams.get('branchId')
    if (!branchId) {
      return fail('Missing branchId', 400)
    }
    const ticket = await getTicketByCode(branchId, code)
    if (!ticket) {
      return fail('Ticket not found', 404)
    }
    const ahead = ticket.status === 'waiting' ? await waitingAhead(branchId, ticket.number) : 0
    return ok({ ticket, ahead })
  } catch (error) {
    return handleError(error)
  }
}
