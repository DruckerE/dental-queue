import Link from 'next/link'
import { AdminBoard } from '@/components/AdminBoard'
import { listDentists } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

// Staff queue management screen.
export default async function AdminPage() {
  const dentists = await listDentists()

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Queue management</h1>
          <p className="text-sm text-slate-500">BrightSmile Dental — front desk</p>
        </div>
        <Link
          href="/display"
          target="_blank"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Open display ↗
        </Link>
      </header>

      <AdminBoard dentists={dentists} />
    </main>
  )
}
