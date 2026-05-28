import { notFound } from 'next/navigation'
import { DisplayBoard } from '@/components/DisplayBoard'
import { getBranchBySlug } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

// Big waiting-room screen for a branch. Meant to run fullscreen on a TV.
export default async function DisplayPage(props: PageProps<'/[branch]/display'>) {
  const { branch: slug } = await props.params
  const branch = await getBranchBySlug(slug)
  if (!branch) notFound()

  return <DisplayBoard branchId={branch.id} branchName={branch.name} />
}
