import { TicketStatusView } from '@/components/TicketStatusView'

// Patient confirmation screen shown right after sign-in.
export default async function TicketPage(props: PageProps<'/ticket/[code]'>) {
  const { code } = await props.params

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-10">
      <section className="w-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <TicketStatusView code={code} />
      </section>
    </main>
  )
}
