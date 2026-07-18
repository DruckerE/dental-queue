import { describe, expect, it } from 'vitest'
import { buildTallyDoc, buildTallyFileName, buildTallyList } from '../lib/tally'
import type { TicketView } from '../lib/types'

function ticket(overrides: Partial<TicketView> = {}): TicketView {
  return {
    id: 'tk_1',
    number: 1,
    code: '001',
    patientName: 'Juan Dela Cruz',
    phone: null,
    services: ['Cleaning'],
    notes: null,
    status: 'waiting',
    branchId: 'br_1',
    preferredDentistId: null,
    preferredDentistName: null,
    assignedDentistId: null,
    assignedDentistName: null,
    createdAt: '2026-05-31T09:15:00.000Z',
    calledAt: null,
    completedAt: null,
    ...overrides,
  }
}

describe('buildTallyList', () => {
  it('returns patient names in the given order', () => {
    const tickets = [
      ticket({ patientName: 'Ana' }),
      ticket({ patientName: 'Beto' }),
      ticket({ patientName: 'Carla' }),
    ]
    expect(buildTallyList(tickets)).toEqual(['Ana', 'Beto', 'Carla'])
  })

  it('returns an empty list when there are no tickets', () => {
    expect(buildTallyList([])).toEqual([])
  })
})

describe('buildTallyDoc', () => {
  const date = new Date('2026-05-31T12:00:00')

  it('includes the branch name, date heading, and total count', () => {
    const doc = buildTallyDoc({
      branchName: 'Las Piñas',
      date,
      tickets: [ticket(), ticket({ id: 'tk_2', number: 2, code: '002', patientName: 'Maria' })],
    })
    expect(doc).toContain('Las Piñas')
    expect(doc).toContain('Total check-ins:</strong> 2')
    expect(doc).toContain('Juan Dela Cruz')
    expect(doc).toContain('Maria')
  })

  it('renders an empty-state message when no tickets are present', () => {
    const doc = buildTallyDoc({ branchName: 'Test', date, tickets: [] })
    expect(doc).toContain('No check-ins yet today')
    expect(doc).not.toContain('<tbody>')
  })

  it('escapes HTML in patient names to prevent injection', () => {
    const doc = buildTallyDoc({
      branchName: 'Test',
      date,
      tickets: [ticket({ patientName: '<script>alert(1)</script>' })],
    })
    expect(doc).not.toContain('<script>alert(1)</script>')
    expect(doc).toContain('&lt;script&gt;')
  })

  it('falls back to em-dash when a ticket has no services', () => {
    const doc = buildTallyDoc({
      branchName: 'Test',
      date,
      tickets: [ticket({ services: [] })],
    })
    expect(doc).toContain('—')
  })
})

describe('buildTallyFileName', () => {
  it('uses slug and zero-padded date', () => {
    const name = buildTallyFileName('las-pinas', new Date(2026, 4, 31))
    expect(name).toBe('tally-las-pinas-2026-05-31.doc')
  })

  it('zero-pads single-digit months and days', () => {
    const name = buildTallyFileName('alabang', new Date(2026, 0, 3))
    expect(name).toBe('tally-alabang-2026-01-03.doc')
  })
})
