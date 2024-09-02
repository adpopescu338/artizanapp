import { ErrorCode } from '@/lib/errors/error-codes'
import { ErrorResponse } from '@/lib/errors/ErrorResponse'
import { commonRouter } from '@/lib/middleware/router'
import { verifyOtpForPreregistrationSchema } from '@/lib/validation/verify-otp-for-pre-registration'
import prisma from 'prisma/client'

export type VerifyOtpForPreregistration = {
  createdUserId: string
}

const handler = commonRouter().post(async (req, res) => {
  const data = verifyOtpForPreregistrationSchema.parse(req.body)

  const preregisteredUser = await prisma.preRegisteredUser.findFirst({
    where: {
      id: data.preRegisteredUserId,
    },
  })

  if (!preregisteredUser) {
    throw new ErrorResponse(
      400,
      `Couldn't find pre-registered user`,
      undefined,
      ErrorCode.USER_NOT_FOUND_FOR_PRE_REG_OTP_VERIFICATION
    )
  }

  const [user] = await prisma.$transaction([
    prisma.user.create({
      data: {
        preRegisteredAt: preregisteredUser.createdAt,
        email: preregisteredUser.channel,
        passwordHash: preregisteredUser.passwordHash,
        emailVerified: true,
        profile: {
          create: {
            fullName: preregisteredUser.fullName,
          },
        },
      },
      select: {
        id: true,
      },
    }),
    prisma.preRegisteredUser.delete({
      where: {
        id: preregisteredUser.id,
      },
    }),
  ])

  const response: VerifyOtpForPreregistration = {
    createdUserId: user.id,
  }

  console.log('preregisteredUser ==== ', preregisteredUser)
  console.log('response ==== ', response)

  res.status(200).json(response)
})

export default handler
