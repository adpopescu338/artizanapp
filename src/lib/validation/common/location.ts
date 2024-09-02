import z from 'zod'

export const locationSchema = z.object({
  formattedAddress: z.string().min(1),
  lat: z.number(),
  long: z.number(),
})

export type LocationInput = z.infer<typeof locationSchema>
