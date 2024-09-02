import z from 'zod'

export const preRegisterSchema = z.object({
  email: z
    .string({
      message: 'Email-ul este necesar',
    })
    .email({
      message: 'Email-ul nu este valid',
    }),
  password: z
    .string({
      message: 'Parola este necesară',
    })
    .min(8, {
      message: 'Parola trebuie să aibă cel puțin 8 caractere',
    }),
  fullName: z
    .string({
      message: 'Numele este necesar',
    })
    .min(3, {
      message: 'Numele trebuie să aibă cel puțin 3 caractere',
    }),
})

export type PreRegisterInput = z.infer<typeof preRegisterSchema>
