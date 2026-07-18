import type { NextRequest } from 'next/server'
import { listTickets } from '@/lib/tickets'
import { prisma } from '@/lib/prisma'
import { buildTallyDoc, buildTallyFileName } from '@/lib/tally'
import { isAuthed } from '@/lib/auth'
import { fail, handleError } from '@/lib/api'

// GET /api/tickets/tally?branchId=... — returns a Word-openable .doc of today's
// check-ins for the given branch. Scoped to today only; refreshes automatically
// the next day because the underlying query filters by startOfDay().
export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthed())) {
      return fail('Unauthorized', 401)
    }

    const branchId = request.nextUrl.searchParams.get('branchId')
    if (!branchId) {
      return fail('Missing branchId', 400)
    }

    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      select: { name: true, slug: true },
    })
    if (!branch) {
      return fail('Branch not found', 404)
    }

    const tickets = await listTickets(branchId)
    const now = new Date()
    const doc = buildTallyDoc({ branchName: branch.name, date: now, tickets })
    const filename = buildTallyFileName(branch.slug, now)

    return new Response(doc, {
      status: 200,
      headers: {
        'Content-Type': 'application/msword; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    return handleError(error)
  }
}
