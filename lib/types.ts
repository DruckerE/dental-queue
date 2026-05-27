import type { TicketStatus } from './ticket'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Plain serializable view models shared between server and client code.
// Keeping them here (free of Prisma imports) means client components can import
// the types without pulling the database client into the browser bundle.

export interface TicketView {
  id: string
  number: number
  code: string
  patientName: string
  phone: string | null
  services: string[]
  notes: string | null
  status: TicketStatus
  preferredDentistId: string | null
  preferredDentistName: string | null
  assignedDentistId: string | null
  assignedDentistName: string | null
  createdAt: string
  calledAt: string | null
  completedAt: string | null
}

export interface DentistView {
  id: string
  name: string
  specialty: string | null
}

export interface ServiceView {
  id: string
  name: string
}
