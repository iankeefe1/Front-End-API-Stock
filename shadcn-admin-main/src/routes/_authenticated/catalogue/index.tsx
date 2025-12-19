import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Catalogue } from '@/features/catalogue'

const appsSearchSchema = z.object({
  type: z
    .enum(['all', 'connected', 'notConnected'])
    .optional()
    .catch(undefined),
  filter: z.string().optional().catch(''),
  sort: z.enum(['asc', 'desc']).optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/catalogue/')({
  validateSearch: appsSearchSchema,
  component: Catalogue,
})
