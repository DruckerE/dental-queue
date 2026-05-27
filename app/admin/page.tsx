import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AdminBoard } from '@/components/AdminBoard'
import { LogoutButton } from '@/components/LogoutButton'
import { listDentists } from '@/lib/catalog'
import { isAuthed, isAuthRequired } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Staff queue management screen (protected when STAFF_PASSWORD is set).
export default async function AdminPage() {
  if (!(await isAuthed())) {
    redirect('/admin/login')
  }

  const dentists = await listDentists()

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Queue management</h1>
          <p className="text-sm text-slate-500">BrightSmile Dental — front desk</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/display"
            target="_blank"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Open display ↗
          </Link>
          {isAuthRequired() ? <LogoutButton /> : null}
        </div>
      </header>

      <AdminBoard dentists={dentists} />
    </main>
  )
}
