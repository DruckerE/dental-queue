import { QrPoster } from '@/components/QrPoster'

// Printable QR poster that links to the patient check-in page.
export default function QrPage() {
  return (
    <main className="flex w-full flex-1 items-center justify-center">
      <QrPoster />
    </main>
  )
}
