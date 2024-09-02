import z from 'zod'
import { locationSchema } from '../common/location'

// validate phone numbers, from Romania
const phoneNumberStringPatterValidator = z.string().regex(/^(\+4|)?(07\d{8}|7\d{8})$/)

export const createSellerProfileSchema = z.object({
  name: z.string().min(1),
  shortDescription: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  location: locationSchema.optional(),
  belongsToCurrentUser: z.boolean()
})

export type CreateSellerProfileInput = z.infer<typeof createSellerProfileSchema>
