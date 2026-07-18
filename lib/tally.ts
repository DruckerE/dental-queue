// Builds the daily check-in tally as a Word-openable HTML document.
// Word opens an HTML payload served as `application/msword` natively, so no
// external `.docx` library is required.

import type { TicketView } from './types'

export interface TallyInput {
  branchName: string
  date: Date
  tickets: readonly TicketView[]
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

const TIME_FORMAT: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit',
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

// Pure name-only list — what the user sees on screen as the "tally as a list".
export function buildTallyList(tickets: readonly TicketView[]): string[] {
  return tickets.map((t) => t.patientName)
}

// Word-openable HTML. The .doc extension + application/msword Content-Type is
// enough for Word, Pages, and Google Docs to render this as a document.
export function buildTallyDoc({ branchName, date, tickets }: TallyInput): string {
  const formattedDate = new Intl.DateTimeFormat('en-US', DATE_FORMAT).format(date)
  const rows = tickets
    .map((t, index) => {
      const time = new Intl.DateTimeFormat('en-US', TIME_FORMAT).format(new Date(t.createdAt))
      const services = t.services.length > 0 ? t.services.join(', ') : '—'
      return `<tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(t.code)}</td>
        <td>${escapeHtml(t.patientName)}</td>
        <td>${escapeHtml(time)}</td>
        <td>${escapeHtml(services)}</td>
        <td>${escapeHtml(formatStatus(t.status))}</td>
      </tr>`
    })
    .join('\n')

  const body =
    tickets.length === 0
      ? '<p><em>No check-ins yet today.</em></p>'
      : `<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif;">
          <thead>
            <tr>
              <th>#</th>
              <th>Ticket</th>
              <th>Name</th>
              <th>Time</th>
              <th>Services</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>`

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
  <meta charset="utf-8" />
  <title>Daily Tally — ${escapeHtml(branchName)} — ${escapeHtml(formattedDate)}</title>
</head>
<body style="font-family:Calibri,Arial,sans-serif;color:#0f172a;">
  <h1 style="margin:0 0 4px 0;">Daily Check-in Tally</h1>
  <p style="margin:0 0 4px 0;"><strong>Branch:</strong> ${escapeHtml(branchName)}</p>
  <p style="margin:0 0 4px 0;"><strong>Date:</strong> ${escapeHtml(formattedDate)}</p>
  <p style="margin:0 0 16px 0;"><strong>Total check-ins:</strong> ${tickets.length}</p>
  ${body}
</body>
</html>`
}

// File name like "tally-las-pinas-2026-05-31.doc".
export function buildTallyFileName(branchSlug: string, date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `tally-${branchSlug}-${y}-${m}-${d}.doc`
}
