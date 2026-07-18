'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { submitCheckIn } from '@/lib/client'
import type { DentistView, ServiceView } from '@/lib/types'

interface CheckinFormProps {
  branchId: string
  branchSlug: string
  services: ServiceView[]
  dentists: DentistView[]
}

interface FormState {
  patientName: string
  phone: string
  service: string
  preferredDentistId: string
  notes: string
}

const EMPTY: FormState = {
  patientName: '',
  phone: '',
  service: '',
  preferredDentistId: '',
  notes: '',
}

export function CheckinForm({ branchId, branchSlug, services, dentists }: CheckinFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (form.patientName.trim().length < 2) {
      setError('Please enter your name.')
      return
    }
    if (!form.service) {
      setError('Please choose what you need today.')
      return
    }

    setSubmitting(true)
    try {
      const ticket = await submitCheckIn({
        branchId,
        patientName: form.patientName.trim(),
        phone: form.phone.trim() || undefined,
        services: [form.service],
        preferredDentistId: form.preferredDentistId || undefined,
        notes: form.notes.trim() || undefined,
      })
      router.push(`/${branchSlug}/ticket/${ticket.code}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign you in. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="patientName" className="block text-sm font-semibold text-slate-700">
          Full name <span className="text-rose-500">*</span>
        </label>
        <input
          id="patientName"
          type="text"
          autoComplete="name"
          value={form.patientName}
          onChange={(e) => setForm((prev) => ({ ...prev, patientName: e.target.value }))}
          placeholder="Juan dela Cruz"
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
          Mobile number <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          placeholder="0917 000 0000"
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-semibold text-slate-700">
          What do you need today? <span className="text-rose-500">*</span>
        </label>
        <select
          id="service"
          value={form.service}
          onChange={(e) => setForm((prev) => ({ ...prev, service: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        >
          <option value="">Select a service…</option>
          {services.map((service) => (
            <option key={service.id} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="dentist" className="block text-sm font-semibold text-slate-700">
          Preferred dentist <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <select
          id="dentist"
          value={form.preferredDentistId}
          onChange={(e) => setForm((prev) => ({ ...prev, preferredDentistId: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        >
          <option value="">No preference — first available</option>
          {dentists.map((dentist) => (
            <option key={dentist.id} value={dentist.id}>
              {dentist.name}
              {dentist.specialty ? ` — ${dentist.specialty}` : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-semibold text-slate-700">
          Anything we should know? <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={2}
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="e.g. severe toothache, allergic to penicillin"
          className="mt-1 w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>

      {error ? (
        <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-sky-600 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Getting your number…' : 'Get my queue number'}
      </button>
    </form>
  )
}
