import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AdminBoard } from '@/components/AdminBoard'
import { LogoutButton } from '@/components/LogoutButton'
import { listBranches, listDentists } from '@/lib/catalog'
import { isAuthed, isAuthRequired } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Staff queue management screen (protected when STAFF_PASSWORD is set).
// One admin manages every branch via the in-board branch switcher.
export default async function AdminPage() {
  if (!(await isAuthed())) {
    redirect('/admin/login')
  }

  const [branches, dentists] = await Promise.all([listBranches(), listDentists()])

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-gold.png"
            alt="Bautista Dental Clinic"
            width={1200}
            height={444}
            className="h-10 w-auto sm:h-12"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Queue management</h1>
            <p className="text-sm text-slate-500">Front desk · all branches</p>
          </div>
        </div>
        {isAuthRequired() ? <LogoutButton /> : null}
      </header>

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          QR posters
        </p>
        <div className="flex flex-wrap gap-2">
          {branches.map((branch) => (
            <Link
              key={branch.id}
              href={`/${branch.slug}/qr`}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-400 hover:text-sky-700"
            >
              {branch.name} →
            </Link>
          ))}
        </div>
      </section>

      <AdminBoard branches={branches} dentists={dentists} />
    </main>
  )
}
