'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { fetcher } from '@/lib/client'
import type { TicketView } from '@/lib/types'

interface TicketStatusViewProps {
  code: string
  branchId: string
  branchSlug: string
  branchName: string
}

interface TicketStatusPayload {
  ticket: TicketView
  ahead: number
}

const STATUS_META: Record<
  TicketView['status'],
  { label: string; tone: string; headline: string }
> = {
  waiting: {
    label: 'In the queue',
    tone: 'bg-amber-50 text-amber-700 ring-amber-200',
    headline: 'You’re in the queue',
  },
  serving: {
    label: 'Now serving',
    tone: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    headline: 'It’s your turn!',
  },
  completed: {
    label: 'Completed',
    tone: 'bg-slate-100 text-slate-600 ring-slate-200',
    headline: 'Visit complete',
  },
  cancelled: {
    label: 'Cancelled',
    tone: 'bg-rose-50 text-rose-700 ring-rose-200',
    headline: 'Ticket cancelled',
  },
}

export function TicketStatusView({
  code,
  branchId,
  branchSlug,
  branchName,
}: TicketStatusViewProps) {
  const { data, error, isLoading } = useSWR<TicketStatusPayload>(
    `/api/tickets/code/${code}?branchId=${branchId}`,
    fetcher,
    { refreshInterval: 4000 },
  )

  if (isLoading) {
    return <p className="text-center text-slate-500">Loading your ticket…</p>
  }

  if (error || !data) {
    return (
      <div className="text-center">
        <p className="text-slate-600">
          We couldn&apos;t find ticket <span className="font-mono font-semibold">#{code}</span>.
        </p>
        <Link
          href={`/${branchSlug}`}
          className="mt-4 inline-block font-semibold text-sky-600 hover:text-sky-700"
        >
          ← Back to sign-in
        </Link>
      </div>
    )
  }

  const { ticket, ahead } = data
  const meta = STATUS_META[ticket.status]
  const dentist = ticket.assignedDentistName ?? ticket.preferredDentistName

  return (
    <div className="text-center">
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${meta.tone}`}
      >
        {meta.label}
      </span>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">{meta.headline}</h1>
      <p className="mt-1 text-slate-500">Hi {ticket.patientName.split(' ')[0]}, your number is</p>

      <p className="my-4 font-mono text-7xl font-black tracking-tight text-sky-600">
        #{ticket.code}
      </p>

      {ticket.status === 'waiting' ? (
        <p className="text-lg text-slate-700">
          {ahead === 0 ? (
            <span className="font-semibold text-emerald-600">You&apos;re next!</span>
          ) : (
            <>
              <span className="font-bold">{ahead}</span> {ahead === 1 ? 'person' : 'people'} ahead of
              you
            </>
          )}
        </p>
      ) : null}

      {ticket.status === 'serving' ? (
        <p className="text-lg font-semibold text-emerald-700">
          Please proceed{dentist ? ` to ${dentist}` : ' to the desk'}.
        </p>
      ) : null}

      {ticket.status === 'completed' ? (
        <p className="text-slate-600">Thank you for visiting Bautista Dental Clinic!</p>
      ) : null}

      <dl className="mt-8 space-y-3 rounded-xl bg-slate-50 p-5 text-left text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Branch</dt>
          <dd className="text-right font-medium text-slate-800">{branchName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Services</dt>
          <dd className="text-right font-medium text-slate-800">
            {ticket.services.length ? ticket.services.join(', ') : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Dentist</dt>
          <dd className="text-right font-medium text-slate-800">
            {dentist ?? 'First available'}
            {ticket.assignedDentistName && ticket.preferredDentistName ? '' : ''}
          </dd>
        </div>
      </dl>

      <p className="mt-6 text-xs text-slate-400">
        Keep this screen open — it updates automatically. Watch for{' '}
        <span className="font-mono font-semibold">#{ticket.code}</span> on the waiting-room display.
      </p>
    </div>
  )
}
