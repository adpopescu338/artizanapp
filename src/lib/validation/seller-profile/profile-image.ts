import z from 'zod'

export const profileImageSchema = z.object({
  imageBase64: z.string(),
})

export type ProfileImageInput = z.infer<typeof profileImageSchema>
