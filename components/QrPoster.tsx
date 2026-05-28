'use client'

import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'

export function QrPoster() {
  // The check-in URL is the site origin. Read it on the client so the QR
  // points at whatever host the staff actually opened (localhost, LAN IP, or
  // a deployed domain).
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.origin)
  }, [])

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div className="print-area rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <Image
          src="/logo.png"
          alt=""
          width={383}
          height={389}
          className="mx-auto mb-3 h-20 w-auto"
        />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Bautista Dental Clinic
        </h1>
        <p className="mt-3 text-xl font-semibold text-sky-600">Scan to sign in</p>
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
