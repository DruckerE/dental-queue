import Image from 'next/image'
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
      <section className="w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="bg-slate-900 px-8 py-7 text-center">
          <Image
            src="/logo-wordmark-gold.png"
            alt="Bautista Dental Clinic"
            width={1200}
            height={443}
            priority
            className="mx-auto h-12 w-auto sm:h-14"
          />
        </div>
        <div className="p-8">
          <h1 className="text-center text-xl font-bold text-slate-900">Staff sign-in</h1>
          <p className="mt-1 mb-6 text-center text-sm text-slate-500">Front-desk access only.</p>
          <StaffLogin />
        </div>
      </section>
    </main>
  )
}
