import { redirect } from 'next/navigation'
import { StaffLogin } from '@/components/StaffLogin'
import { isAuthed } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Staff sign-in. If already authed (or no password is configured), go straight
// to the queue.
export default async function StaffLoginPage() {
  if (await isAuthed()) {
    redirect('/admin')
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 items-center px-4 py-10">
      <section className="w-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <header className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
            BrightSmile Dental
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Staff sign-in</h1>
          <p className="mt-1 text-sm text-slate-500">Front-desk access only.</p>
        </header>
        <StaffLogin />
      </section>
    </main>
  )
}
