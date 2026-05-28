'use client'

import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'

interface QrPosterProps {
  branchSlug: string
  branchName: string
}

export function QrPoster({ branchSlug, branchName }: QrPosterProps) {
  // The QR points at this branch's check-in page on whatever host the staff
  // opened (localhost, LAN IP, or the deployed domain).
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(`${window.location.origin}/${branchSlug}`)
  }, [branchSlug])

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div className="print-area rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <Image
          src="/logo-gold.png"
          alt="Bautista Dental Clinic"
          width={1200}
          height={444}
          className="mx-auto mb-4 h-20 w-auto"
        />
        <p className="text-xl font-semibold text-sky-600">Scan to sign in</p>
        <p className="mt-1 text-lg font-semibold text-slate-700">{branchName} Branch</p>
        <p className="mt-1 text-slate-500">Point your phone camera here to join the queue.</p>

        <div className="my-8 flex justify-center">
          {url ? (
            <QRCodeSVG
              value={url}
              size={260}
              level="M"
              marginSize={2}
              className="rounded-xl ring-1 ring-slate-200"
            />
          ) : (
            <div className="h-[260px] w-[260px] animate-pulse rounded-xl bg-slate-100" />
          )}
        </div>

        <ol className="mx-auto mt-6 max-w-xs space-y-1 text-left text-sm text-slate-600">
          <li>1. Open your phone camera.</li>
          <li>2. Scan the code above.</li>
          <li>3. Fill in your details and get a number.</li>
        </ol>
      </div>

      <button
        type="button"
        onClick={() => window.print()}
        className="no-print mt-6 w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700"
      >
        Print poster
      </button>
    </div>
  )
}
