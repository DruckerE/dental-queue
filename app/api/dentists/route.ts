import { listDentists } from '@/lib/catalog'
import { handleError, ok } from '@/lib/api'

export async function GET() {
  try {
    const dentists = await listDentists()
    return ok(dentists)
  } catch (error) {
    return handleError(error)
  }
}
