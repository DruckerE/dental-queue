'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { submitCheckIn } from '@/lib/client'
import type { DentistView, ServiceView } from '@/lib/types'

interface CheckinFormProps {
  services: ServiceView[]
  dentists: DentistView[]
}

interface FormState {
  patientName: string
  phone: string
  services: string[]
  preferredDentistId: string
  notes: string
}

const EMPTY: FormState = {
  patientName: '',
  phone: '',
  services: [],
  preferredDentistId: '',
  notes: '',
}

export function CheckinForm({ services, dentists }: CheckinFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Immutable toggle of a selected service name.
  function toggleService(name: string) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(name)
        ? prev.services.filter((s) => s !== name)
        : [...prev.services, name],
    }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (form.patientName.trim().length < 2) {
      setError('Please enter your name.')
      return
    }
    if (form.services.length === 0) {
      setError('Please pick at least one service.')
      return
    }

    setSubmitting(true)
    try {
      const ticket = await submitCheckIn({
        patientName: form.patientName.trim(),
        phone: form.phone.trim() || undefined,
        services: form.services,
        preferredDentistId: form.preferredDentistId || undefined,
        notes: form.notes.trim() || undefined,
      })
      router.push(`/ticket/${ticket.code}`)
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

      <fieldset>
        <legend className="text-sm font-semibold text-slate-700">
          What do you need today? <span className="text-rose-500">*</span>
        </legend>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {services.map((service) => {
            const selected = form.services.includes(service.name)
            return (
              <button
                type="button"
                key={service.id}
                onClick={() => toggleService(service.name)}
                aria-pressed={selected}
                className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
                  selected
                    ? 'border-sky-500 bg-sky-50 text-sky-800 ring-2 ring-sky-200'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-sky-300'
                }`}
              >
                {selected ? '✓ ' : ''}
                {service.name}
              </button>
            )
          })}
        </div>
      </fieldset>

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
