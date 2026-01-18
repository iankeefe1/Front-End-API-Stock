import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { CatalogueAdd } from '@/features/catalogue/add'

const appsSearchSchema = z.object({
  type: z
    .enum(['all', 'connected', 'notConnected'])
    .optional()
    .catch(undefined),
  filter: z.string().optional().catch(''),
  sort: z.enum(['asc', 'desc']).optional().catch(undefined),

  // 👇 ADD THESE
  productid: z.number().optional(),
  pagestate: z.enum(['create', 'view', 'edit', 'approval']).optional(),
  approvalid: z.number().optional(),
})

export const Route = createFileRoute('/_authenticated/catalogue/add/')({
  validateSearch: appsSearchSchema,
  component: CatalogueAdd,
})
