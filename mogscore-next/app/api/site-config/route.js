import { getContactEmail } from '@/lib/contact'

export async function GET() {
  return Response.json({ contactEmail: getContactEmail() })
}
