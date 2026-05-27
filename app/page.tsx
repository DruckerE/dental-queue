import Image from 'next/image'
import Link from 'next/link'
import { CheckinForm } from '@/components/CheckinForm'
import { listDentists, listServices } from '@/lib/catalog'

// Always read the live catalog so newly added dentists/services appear without
// a rebuild.
export const dynamic = 'force-dynamic'

// Patient-facing check-in screen — the destination of the QR code.
export default async function CheckinPage() {
  const [services, dentists] = await Promise.all([listServices(), listDentists()])

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      <header className="mb-10 text-center">
        <Image
          src="/logo.png"
          alt="Bautista Dental Clinic logo"
          width={383}
          height={389}
          priority
          className="mx-auto mb-3 h-28 w-auto sm:h-32"
        />
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Bautista Dental Clinic
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-lg text-slate-500">
          Sign in below to join the queue — we&apos;ll give you a number to watch on the screen.
        </p>
      </header>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <CheckinForm services={services} dentists={dentists} />
      </section>

      <footer className="mt-8 flex justify-center gap-4 text-xs text-slate-400">
        <Link href="/display" className="hover:text-slate-600">
          Waiting-room display
        </Link>
        <span>·</span>
        <Link href="/admin" className="hover:text-slate-600">
          Staff
        </Link>
        <span>·</span>
        <Link href="/qr" className="hover:text-slate-600">
          QR poster
        </Link>
      </footer>
    </main>
  )
}
