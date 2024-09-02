import prisma from 'prisma/client'
import { authRouter } from '@/lib/middleware/router'
import {
  ContactInfoInput,
  contactInfoSchema,
} from '@/lib/validation/seller-profile/contact-info'
import { ErrorResponse } from '@/lib/errors/ErrorResponse'
import { SetupStepName } from '@prisma/client'
import { validateAccessToSellerProfile } from '@/lib/auth/seller-profile/validate-access'

export type AddContactInfoResult = Awaited<ReturnType<typeof addContactInfo>>

const addContactInfo = async (
  sellerProfileId: string,
  currentUserId: string,
  body: ContactInfoInput
) => {
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: {
      id: sellerProfileId,
    },
    include: {
      publicPhoneNumbers: true,
    },
  })

  if (!sellerProfile) {
    throw new ErrorResponse(
      404,
      `Seller profile with id ${sellerProfileId} not found`
    )
  }

  validateAccessToSellerProfile(sellerProfile, currentUserId)

  const { phoneNumbers } = body

  const originalPhoneNumber = sellerProfile.publicPhoneNumbers
  const phoneNumbersToAdd = phoneNumbers.filter(
    (phoneNumber) => !originalPhoneNumber.some((p) => p.number === phoneNumber)
  )
  const phoneNumbersToRemoveIds = originalPhoneNumber
    .filter(
      (phoneNumber) => !phoneNumbers.some((p) => p === phoneNumber.number)
    )
    .map((phoneNumber) => ({ id: phoneNumber.id }))

  const result = await prisma.sellerProfile.update({
    where: {
      id: sellerProfileId,
    },
    data: {
      links: {
        set: body.links,
      },
      publicEmailAddress: body.email,
      publicPhoneNumbers: {
        delete: phoneNumbersToRemoveIds,
        create: phoneNumbersToAdd.map((phoneNumber) => ({
          number: phoneNumber,
        })),
      },
      setupSteps: {
        update: {
          where: {
            sellerProfileId_name_unique: {
              sellerProfileId: sellerProfileId,
              name: SetupStepName.CONTACT_DETAILS,
            },
          },
          data: {
            completedAt: new Date(),
          },
        },
      },
    },
    include: {
      publicPhoneNumbers: {
        select: {
          id: true,
          number: true,
        },
      },
    },
  })

  return {
    sellerProfileId: result.id,
    phoneNumbers: result.publicPhoneNumbers,
  }
}

const handler = authRouter().post(async (req, res) => {
  const { sellerProfileId } = req.query

  if (typeof sellerProfileId !== 'string') {
    throw new ErrorResponse(400, 'sellerProfileId must be a string')
  }

  const body = contactInfoSchema.parse(req.body)

  const currentUserId = req.session.user.id

  const result = await addContactInfo(
    sellerProfileId as string,
    currentUserId,
    body
  )

  res.status(200).json(result)
})

export default handler
