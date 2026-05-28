import { describe, expect, it } from 'vitest'
import { checkInSchema, updateTicketSchema } from '../lib/validation'

describe('checkInSchema', () => {
  it('accepts a valid check-in', () => {
    const result = checkInSchema.parse({
      branchId: 'branch_1',
      patientName: 'Juan dela Cruz',
      services: ['Teeth Cleaning'],
    })
    expect(result.branchId).toBe('branch_1')
    expect(result.patientName).toBe('Juan dela Cruz')
    expect(result.services).toEqual(['Teeth Cleaning'])
    expect(result.phone).toBeUndefined()
  })

  it('rejects a missing branch', () => {
    expect(() => checkInSchema.parse({ patientName: 'Juan', services: ['x'] })).toThrow()
  })

  it('rejects a too-short name', () => {
    expect(() =>
      checkInSchema.parse({ branchId: 'b1', patientName: 'J', services: ['x'] }),
    ).toThrow()
  })

  it('rejects an empty service list', () => {
    expect(() =>
      checkInSchema.parse({ branchId: 'b1', patientName: 'Juan', services: [] }),
    ).toThrow()
  })

  it('normalizes empty optional strings to undefined', () => {
    const result = checkInSchema.parse({
      branchId: 'b1',
      patientName: 'Juan',
      services: ['x'],
      phone: '   ',
      preferredDentistId: '',
    })
    expect(result.phone).toBeUndefined()
    expect(result.preferredDentistId).toBeUndefined()
  })
})

describe('updateTicketSchema', () => {
  it('accepts a status update', () => {
    expect(updateTicketSchema.parse({ status: 'serving' }).status).toBe('serving')
  })

  it('accepts a null dentist assignment', () => {
    expect(updateTicketSchema.parse({ assignedDentistId: null }).assignedDentistId).toBeNull()
  })

  it('rejects an unknown status', () => {
    expect(() => updateTicketSchema.parse({ status: 'sleeping' })).toThrow()
  })

  it('rejects an empty update', () => {
    expect(() => updateTicketSchema.parse({})).toThrow()
  })
})
