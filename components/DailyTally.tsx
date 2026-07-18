'use client'

import type { BranchView, TicketView } from '@/lib/types'

interface DailyTallyProps {
  branch: BranchView | undefined
  tickets: readonly TicketView[]
}

// On-screen daily check-in tally + .doc download. Auto-clears next day because
// the parent only feeds us today's tickets (server query is scoped to
// startOfDay()).
export function DailyTally({ branch, tickets }: DailyTallyProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Daily tally <span className="text-slate-400">({tickets.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            {branch ? `${branch.name} · ` : ''}
            {today} · resets at midnight
          </p>
        </div>
        {branch ? (
          <a
            href={`/api/tickets/tally?branchId=${branch.id}`}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Download .doc
          </a>
        ) : null}
      </header>

      {tickets.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-400">
          No check-ins yet today.
        </p>
      ) : (
        <ol className="list-decimal space-y-1 pl-6 text-sm text-slate-700">
          {tickets.map((t) => (
            <li key={t.id}>
              <span className="font-medium">{t.patientName}</span>
              <span className="ml-2 text-xs text-slate-400">#{t.code}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
