import { z } from 'zod'
import { phoneNumberStringPatterValidator } from '@/lib/validation/common/phone-number'

export const contactInfoSchema = z.object({
  phoneNumbers: z.array(phoneNumberStringPatterValidator),
  email: z.string().email().optional(),
  links: z.array(z.string().url()),
})

export type ContactInfoInput = z.infer<typeof contactInfoSchema>
