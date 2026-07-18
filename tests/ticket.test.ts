import { describe, expect, it } from 'vitest'
import {
  ACTIVE_STATUSES,
  decodeServices,
  encodeServices,
  formatTicketCode,
  isTicketStatus,
  startOfDay,
} from '../lib/ticket'

describe('formatTicketCode', () => {
  it('zero-pads to three digits', () => {
    expect(formatTicketCode(1)).toBe('001')
    expect(formatTicketCode(37)).toBe('037')
    expect(formatTicketCode(412)).toBe('412')
  })

  it('does not truncate numbers above 999', () => {
    expect(formatTicketCode(1234)).toBe('1234')
  })

  it('throws on invalid input', () => {
    expect(() => formatTicketCode(-1)).toThrow()
    expect(() => formatTicketCode(1.5)).toThrow()
  })
})

describe('services encode/decode', () => {
  it('round-trips an array', () => {
    const services = ['Cleaning', 'Whitening']
    expect(decodeServices(encodeServices(services))).toEqual(services)
  })

  it('returns an empty array for null/invalid JSON', () => {
    expect(decodeServices(null)).toEqual([])
    expect(decodeServices('not json')).toEqual([])
    expect(decodeServices('{"a":1}')).toEqual([])
  })

  it('drops non-string entries', () => {
    expect(decodeServices('["ok", 5, null]')).toEqual(['ok'])
  })
})

describe('isTicketStatus', () => {
  it('accepts known statuses and rejects others', () => {
    expect(isTicketStatus('waiting')).toBe(true)
    expect(isTicketStatus('serving')).toBe(true)
    expect(isTicketStatus('banana')).toBe(false)
  })
})

describe('startOfDay', () => {
  it('rolls over at Manila midnight (UTC+8), not UTC midnight', () => {
    // 15:42 UTC is 23:42 the same day in Manila, whose day began at
    // 16:00 UTC the previous day.
    const d = startOfDay(new Date('2026-05-27T15:42:09Z'))
    expect(d.toISOString()).toBe('2026-05-26T16:00:00.000Z')
  })

  it('keeps an early-morning Manila check-in on the current Manila day', () => {
    // 22:30 UTC is 06:30 the NEXT day in Manila; it must not be filed under
    // the previous UTC day.
    const d = startOfDay(new Date('2026-05-27T22:30:00Z'))
    expect(d.toISOString()).toBe('2026-05-27T16:00:00.000Z')
  })
})

describe('ACTIVE_STATUSES', () => {
  it('contains only waiting and serving', () => {
    expect([...ACTIVE_STATUSES]).toEqual(['waiting', 'serving'])
  })
})
