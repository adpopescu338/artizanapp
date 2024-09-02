import z from 'zod'

// validate phone numbers, from Romania
export const phoneNumberStringPatterValidator = z.string().regex(/^(\+4|)?(07\d{8}|7\d{8})$/)
