# Bautista Dental Clinic — Customer Queue

A QR-based check-in and queue system for a dental clinic. Patients scan a QR
code, sign in, pick the services they need (and optionally a preferred dentist),
and get a queue number. Staff manage the queue and a waiting-room display shows
who's being served.

## Pages

| Route          | Who          | Purpose                                                        |
| -------------- | ------------ | -------------------------------------------------------------- |
| `/`            | Patients     | Sign-in form (the QR code points here). Returns a ticket #.    |
| `/ticket/[code]` | Patients   | Live ticket status — queue position, "your turn" + dentist.    |
| `/admin`       | Front desk   | Call next, assign/override dentist, complete or cancel tickets.|
| `/display`     | Waiting room | Big "Now Serving" screen for a TV/monitor. Auto-refreshes.     |
| `/qr`          | Staff        | Printable QR poster linking to the sign-in page.               |

## Stack

- **Next.js 16** (App Router) + **React 19** + **Tailwind CSS v4**
- **Prisma 6** with **SQLite** (`prisma/dev.db`) — swap the `datasource`
  provider to `postgresql` for production.
- **Zod** for input validation, **SWR** for live polling, **qrcode.react** for
  the QR poster.

## Getting started

```bash
npm install
npm run db:push    # create the SQLite tables
npm run db:seed    # add dentists + services
npm run dev        # http://localhost:3000
```

Open `/qr` on the front-desk machine, print it, and stick it at reception.
Patients scan it to sign in. Open `/display` fullscreen on a waiting-room screen
and `/admin` on the front-desk computer.

> The QR code encodes whatever host you open `/qr` from. For real phones to
> reach it, run the app on a machine the phones can see — the clinic Wi-Fi (use
> the Network URL printed by `next dev`) or a deployed URL.

## Staff login

The `/admin` page (and the ticket-update API) are protected by a single shared
password. Set `STAFF_PASSWORD` in your environment (`.env` locally, Vercel env
vars in production) and staff sign in at `/admin/login`. The session lasts 12
hours. If `STAFF_PASSWORD` is **unset**, `/admin` stays open (handy for a first
deploy) — set it before real use.

## Useful scripts

```bash
npm run db:reset   # wipe + re-seed the database (clears all tickets)
npm test           # unit tests (validation + ticket logic)
npm run build      # production build
```

## Customizing dentists & services

Edit the lists in `prisma/seed.ts`, then run `npm run db:reset`. Ticket numbers
restart at #001 each day.

## Data model

`Dentist`, `Service`, and `Ticket` (see `prisma/schema.prisma`). A ticket stores
the patient, selected services, an optional **preferred** dentist (patient
request) and an **assigned** dentist (staff choice, can override the request),
and a status: `waiting → serving → completed` (or `cancelled`).
