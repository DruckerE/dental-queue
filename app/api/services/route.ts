import { listServices } from '@/lib/catalog'
import { handleError, ok } from '@/lib/api'

export async function GET() {
  try {
    const services = await listServices()
    return ok(services)
  } catch (error) {
    return handleError(error)
  }
}
