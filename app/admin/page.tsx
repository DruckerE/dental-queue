import Image from 'next/image'
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
        <div className="flex items-center gap-3">
          <Image
            src="/logo-wordmark-gold-light.png"
            alt="Bautista Dental Clinic"
            width={1200}
            height={599}
            className="h-10 w-auto sm:h-12"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Queue management</h1>
            <p className="text-sm text-slate-500">Front desk</p>
          </div>
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
