import { z } from 'zod'
import { TICKET_STATUSES } from './ticket'

// Patient check-in payload.
export const checkInSchema = z.object({
  branchId: z.string().trim().min(1, 'Missing branch'),
  patientName: z.string().trim().min(2, 'Please enter your name').max(80),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .transform((v) => (v ? v : undefined)),
  services: z.array(z.string().trim().min(1)).min(1, 'Pick at least one service').max(10),
  preferredDentistId: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined)),
  notes: z
    .string()
    .trim()
    .max(300)
    .optional()
    .transform((v) => (v ? v : undefined)),
})

export type CheckInInput = z.infer<typeof checkInSchema>

// Staff updates to a ticket.
export const updateTicketSchema = z
  .object({
    status: z.enum(TICKET_STATUSES).optional(),
    assignedDentistId: z.string().trim().nullable().optional(),
  })
  .refine((data) => data.status !== undefined || data.assignedDentistId !== undefined, {
    message: 'Provide a status or a dentist assignment',
  })

export type UpdateTicketInput = z.infer<typeof updateTicketSchema>
