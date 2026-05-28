import { notFound } from 'next/navigation'
import { TicketStatusView } from '@/components/TicketStatusView'
import { getBranchBySlug } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

// Patient confirmation screen shown right after sign-in.
export default async function TicketPage(props: PageProps<'/[branch]/ticket/[code]'>) {
  const { branch: slug, code } = await props.params
  const branch = await getBranchBySlug(slug)
  if (!branch) notFound()

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-10">
      <section className="w-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <TicketStatusView
          code={code}
          branchId={branch.id}
          branchSlug={branch.slug}
          branchName={branch.name}
        />
      </section>
    </main>
  )
}
