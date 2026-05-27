'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { AdminTicketCard } from '@/components/AdminTicketCard'
import { fetcher, patchTicket } from '@/lib/client'
import type { DentistView, TicketView } from '@/lib/types'
import type { UpdateTicketInput } from '@/lib/validation'

interface AdminBoardProps {
  dentists: DentistView[]
}

export function AdminBoard({ dentists }: AdminBoardProps) {
  const { data, error, isLoading, mutate } = useSWR<TicketView[]>('/api/tickets', fetcher, {
    refreshInterval: 3000,
  })

  const handleUpdate = useCallback(
    async (id: string, input: UpdateTicketInput) => {
      await patchTicket(id, input)
      await mutate()
    },
    [mutate],
  )

  const tickets = data ?? []
  const waiting = tickets.filter((t) => t.status === 'waiting')
  const serving = tickets.filter((t) => t.status === 'serving')
  const done = tickets.filter((t) => t.status === 'completed' || t.status === 'cancelled')

  async function callNext() {
    const next = waiting[0]
    if (next) await handleUpdate(next.id, { status: 'serving' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3 text-sm">
          <Stat label="Waiting" value={waiting.length} tone="text-amber-600" />
          <Stat label="Serving" value={serving.length} tone="text-emerald-600" />
          <Stat label="Done today" value={done.length} tone="text-slate-500" />
        </div>
        <button
          type="button"
          onClick={callNext}
          disabled={waiting.length === 0}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-40"
        >
          Call next ({waiting[0]?.code ?? '—'})
        </button>
      </div>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Couldn&apos;t load the queue. Retrying…
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Column title="Now serving" count={serving.length}>
          {serving.map((t) => (
            <AdminTicketCard key={t.id} ticket={t} dentists={dentists} onUpdate={handleUpdate} />
          ))}
          {serving.length === 0 ? <Empty text="No one being served." /> : null}
        </Column>

        <Column title="Waiting" count={waiting.length}>
          {waiting.map((t) => (
            <AdminTicketCard key={t.id} ticket={t} dentists={dentists} onUpdate={handleUpdate} />
          ))}
          {waiting.length === 0 ? (
            <Empty text={isLoading ? 'Loading…' : 'Queue is empty.'} />
          ) : null}
        </Column>
      </div>
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <span className="rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
      <span className={`text-lg font-bold ${tone}`}>{value}</span>{' '}
      <span className="text-slate-500">{label}</span>
    </span>
  )
}

function Column({
  title,
  count,
  children,
}: {
  title: string
  count: number
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title} <span className="text-slate-400">({count})</span>
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-400">
      {text}
    </p>
  )
}
