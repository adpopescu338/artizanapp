import { generateOtp } from '@/lib/auth/generate-otp'
import { hashPassword } from '@/lib/auth/hash-password'
import { emailer } from '@/lib/emails'
import { ErrorCode } from '@/lib/errors/error-codes'
import { ErrorResponse } from '@/lib/errors/ErrorResponse'
import { commonRouter } from '@/lib/middleware/router'
import {
  PreRegisterInput,
  preRegisterSchema,
} from '@/lib/validation/pre-register'
import prisma from 'prisma/client'

const preRegister = async (body: PreRegisterInput) => {
  body.email = body.email.toLowerCase().trim()

  if (process.env.NODE_ENV !== 'development') {
    // remove +anything before @
    body.email = body.email.replace(/\+.*(?=@)/, '')
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  })

  if (existingUser) {
    throw new ErrorResponse(
      400,
      `User with email ${body.email} already exists`,
      undefined,
      ErrorCode.USER_ALREADY_EXISTS
    )
  }

  const payload = {
    fullName: body.fullName,
    channel: body.email,
    passwordHash: await hashPassword(body.password),
    otp: generateOtp(),
  }

  const preRegisteredUser = await prisma.preRegisteredUser.upsert({
    where: {
      channel: body.email,
    },
    create: payload,
    update: {
      ...payload,
      createdAt: new Date(),
      otpIssuedAt: new Date(),
    },
    select: {
      id: true,
      fullName: true,
      otp: true,
      channel: true,
    },
  })

  await emailer.sendOtpCommunication({
    otp: preRegisteredUser.otp,
    name: preRegisteredUser.fullName,
    email: preRegisteredUser.channel,
  })

  return {
    preRegisteredUserId: preRegisteredUser.id,
    ...(process.env.NODE_ENV === 'development' && {
      otp: preRegisteredUser.otp,
    }),
  }
}

export type PreRegisterResponse = Awaited<ReturnType<typeof preRegister>>

const handler = commonRouter().post(async (req, res) => {
  const body = preRegisterSchema.parse(req.body)

  const preRegisteredUser = await preRegister(body)

  res.json(preRegisteredUser)
})

export default handler
