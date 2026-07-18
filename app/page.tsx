import Image from 'next/image'
import Link from 'next/link'
import { listBranches } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

// Branch picker — shown at the root. Each branch links to its own check-in.
export default async function HomePage() {
  const branches = await listBranches()

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <header className="mb-10 text-center">
        <Image
          src="/logo-gold.png"
          alt="Bautista Dental Clinic"
          width={1200}
          height={444}
          priority
          className="mx-auto mb-4 h-24 w-auto sm:h-28"
        />
        <p className="text-lg text-slate-500">Choose your branch to sign in</p>
      </header>

      <nav className="space-y-3">
        {branches.map((branch) => (
          <Link
            key={branch.id}
            href={`/${branch.slug}`}
            className="flex items-center justify-between rounded-2xl bg-white px-6 py-5 text-lg font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:ring-sky-300"
          >
            {branch.name}
            <span aria-hidden className="text-sky-500">
              →
            </span>
          </Link>
        ))}
        {branches.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 px-6 py-8 text-center text-slate-400">
            No branches configured yet.
          </p>
        ) : null}
      </nav>

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white/60 p-5">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
          For staff
        </p>

        <p className="mb-1.5 text-xs font-medium text-slate-400">Queue display</p>
        <div className="mb-4 space-y-2">
          {branches.map((branch) => (
            <Link
              key={`display-${branch.id}`}
              href={`/${branch.slug}/display`}
              className="flex items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-400 hover:text-sky-700"
            >
              {branch.name}
              <span aria-hidden className="text-slate-400">
                →
              </span>
            </Link>
          ))}
        </div>

        <p className="mb-1.5 text-xs font-medium text-slate-400">QR posters</p>
        <div className="mb-5 space-y-2">
          {branches.map((branch) => (
            <Link
              key={`qr-${branch.id}`}
              href={`/${branch.slug}/qr`}
              className="flex items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-400 hover:text-sky-700"
            >
              {branch.name}
              <span aria-hidden className="text-slate-400">
                →
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/admin"
          className="block rounded-lg bg-slate-800 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-900"
        >
          Staff sign-in
        </Link>
      </section>
    </main>
  )
}
