'use client'

import Image from 'next/image'
import useSWR from 'swr'
import { fetcher } from '@/lib/client'
import type { TicketView } from '@/lib/types'

interface DisplayBoardProps {
  branchId: string
  branchName: string
}

export function DisplayBoard({ branchId, branchName }: DisplayBoardProps) {
  const { data } = useSWR<TicketView[]>(
    `/api/tickets?branchId=${branchId}&status=waiting,serving`,
    fetcher,
    { refreshInterval: 3000 },
  )

  const tickets = data ?? []
  // Most recently called first so the latest "now serving" is prominent.
  const serving = tickets
    .filter((t) => t.status === 'serving')
    .sort((a, b) => (b.calledAt ?? '').localeCompare(a.calledAt ?? ''))
  const waiting = tickets.filter((t) => t.status === 'waiting')

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto] gap-6 bg-slate-900 p-6 text-white sm:p-10">
      <header className="text-center">
        <Image
          src="/logo-gold.png"
          alt="Bautista Dental Clinic"
          width={1200}
          height={444}
          className="mx-auto mb-3 h-20 w-auto drop-shadow-lg sm:h-24"
        />
        <p className="text-base font-semibold uppercase tracking-[0.4em] text-sky-400 sm:text-lg">
          {branchName} — Now Serving
        </p>
      </header>

      <main className="flex flex-col items-center justify-center">
        {serving.length === 0 ? (
          <p className="text-3xl font-medium text-slate-500">Please wait — we&apos;ll call you soon.</p>
        ) : (
          <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
            {serving.map((t) => (
              <div
                key={t.id}
                className="rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 p-8 text-center shadow-2xl"
              >
                <p className="font-mono text-7xl font-black leading-none sm:text-8xl">#{t.code}</p>
                <p className="mt-3 text-xl font-medium text-sky-100">{t.patientName}</p>
                {t.assignedDentistName ? (
                  <p className="mt-1 text-lg text-sky-200">→ {t.assignedDentistName}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer>
        <p className="mb-2 text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
          Up next
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {waiting.length === 0 ? (
            <span className="text-slate-500">No one waiting</span>
          ) : (
            waiting.slice(0, 8).map((t) => (
              <span
                key={t.id}
                className="rounded-xl bg-slate-800 px-5 py-3 font-mono text-2xl font-bold text-slate-200"
              >
                #{t.code}
              </span>
            ))
          )}
        </div>
      </footer>
    </div>
  )
}
