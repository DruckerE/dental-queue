import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckinForm } from '@/components/CheckinForm'
import { getBranchBySlug, listDentists, listServices } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

// Patient-facing check-in screen for a specific branch (the QR code target).
export default async function CheckinPage(props: PageProps<'/[branch]'>) {
  const { branch: slug } = await props.params
  const branch = await getBranchBySlug(slug)
  if (!branch) notFound()

  const [services, dentists] = await Promise.all([listServices(), listDentists()])

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      <header className="mb-10 text-center">
        <Image
          src="/logo-gold.png"
          alt="Bautista Dental Clinic"
          width={1200}
          height={444}
          priority
          className="mx-auto mb-4 h-24 w-auto sm:h-28"
        />
        <p className="text-base font-semibold uppercase tracking-wide text-sky-600">
          {branch.name} Branch
        </p>
        <p className="mx-auto mt-2 max-w-sm text-lg text-slate-500">
          Sign in below to join the queue — we&apos;ll give you a number to watch on the screen.
        </p>
      </header>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <CheckinForm
          branchId={branch.id}
          branchSlug={branch.slug}
          services={services}
          dentists={dentists}
        />
      </section>

      <footer className="mt-8 flex justify-center gap-4 text-xs text-slate-400">
        <Link href={`/${branch.slug}/display`} className="hover:text-slate-600">
          Queue screen
        </Link>
        <span>·</span>
        <Link href="/" className="hover:text-slate-600">
          All branches
        </Link>
      </footer>
    </main>
  )
}
