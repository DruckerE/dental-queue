import { notFound } from 'next/navigation'
import { QrPoster } from '@/components/QrPoster'
import { getBranchBySlug } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

// Printable QR poster linking to a branch's check-in page.
export default async function QrPage(props: PageProps<'/[branch]/qr'>) {
  const { branch: slug } = await props.params
  const branch = await getBranchBySlug(slug)
  if (!branch) notFound()

  return (
    <main className="flex w-full flex-1 items-center justify-center">
      <QrPoster branchSlug={branch.slug} branchName={branch.name} />
    </main>
  )
}
