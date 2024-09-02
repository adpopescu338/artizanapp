import z from 'zod'

export const verifyOtpForPreregistrationSchema = z.object({
  otp: z.string().length(6),
  preRegisteredUserId: z.string(),
})

export type VerifyOtpForPreregistrationInput = z.infer<
  typeof verifyOtpForPreregistrationSchema
>
