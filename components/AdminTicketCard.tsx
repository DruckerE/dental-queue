'use client'

import { useState } from 'react'
import type { DentistView, TicketView } from '@/lib/types'
import type { UpdateTicketInput } from '@/lib/validation'

interface AdminTicketCardProps {
  ticket: TicketView
  dentists: DentistView[]
  onUpdate: (id: string, input: UpdateTicketInput) => Promise<void>
}

function waitedMinutes(createdAt: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(createdAt).getTime()) / 60000))
}

export function AdminTicketCard({ ticket, dentists, onUpdate }: AdminTicketCardProps) {
  const [busy, setBusy] = useState(false)

  async function run(input: UpdateTicketInput) {
    setBusy(true)
    try {
      await onUpdate(ticket.id, input)
    } finally {
      setBusy(false)
    }
  }

  const isWaiting = ticket.status === 'waiting'
  const isServing = ticket.status === 'serving'

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-2xl font-bold text-slate-900">#{ticket.code}</p>
          <p className="font-medium text-slate-800">{ticket.patientName}</p>
          {ticket.phone ? <p className="text-sm text-slate-500">{ticket.phone}</p> : null}
        </div>
        <span className="shrink-0 text-xs text-slate-400">{waitedMinutes(ticket.createdAt)} min</span>
      </div>

      {ticket.services.length ? (
        <p className="mt-2 text-sm text-slate-600">{ticket.services.join(', ')}</p>
      ) : null}

      {ticket.notes ? (
        <p className="mt-1 rounded bg-amber-50 px-2 py-1 text-xs text-amber-800">📝 {ticket.notes}</p>
      ) : null}

      {ticket.preferredDentistName ? (
        <p className="mt-2 text-xs text-slate-500">
          Requested: <span className="font-medium text-slate-700">{ticket.preferredDentistName}</span>
        </p>
      ) : null}

      <label className="mt-3 block text-xs font-semibold text-slate-500">
        Assigned dentist
        <select
          value={ticket.assignedDentistId ?? ''}
          disabled={busy}
          onChange={(e) => run({ assignedDentistId: e.target.value || null })}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-800 outline-none focus:border-sky-500"
        >
          <option value="">Unassigned</option>
          {dentists.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        {isWaiting ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => run({ status: 'serving' })}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Call now
          </button>
        ) : null}

        {isServing ? (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => run({ status: 'completed' })}
              className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
            >
              Complete
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => run({ status: 'waiting' })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Back to queue
            </button>
          </>
        ) : null}

        <button
          type="button"
          disabled={busy}
          onClick={() => run({ status: 'cancelled' })}
          className="ml-auto rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </article>
  )
}
