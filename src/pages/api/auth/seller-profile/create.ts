import prisma from 'prisma/client'
import { authRouter } from '@/lib/middleware/router'
import {
  CreateSellerProfileInput,
  createSellerProfileSchema,
} from '@/lib/validation/seller-profile/create'
import {
  SELLER_PROFILE_SETUP_STEPS,
  SELLER_PROFILE_SETUP_STEPS_WITHOUT_SKIPPABLE,
} from '@/constants/seller-profile-setup-steps'

export type CreateSellerProfileResult = Awaited<
  ReturnType<typeof createSellerProfile>
>

const getProfileSetupSteps = (sellerProfileBelongsToCurrentUser: boolean) => {
  // we're creating a new profile, so the first step is completed
  const [basicInfoStep] = SELLER_PROFILE_SETUP_STEPS
  basicInfoStep.completedAt = new Date()

  if (sellerProfileBelongsToCurrentUser) return SELLER_PROFILE_SETUP_STEPS

  return SELLER_PROFILE_SETUP_STEPS_WITHOUT_SKIPPABLE
}

const createSellerProfile = async (
  body: CreateSellerProfileInput,
  currentUserId: string
) => {
  const { name, description, belongsToCurrentUser, location, ...otherData } =
    body

  const sellerProfile = await prisma.sellerProfile.create({
    data: {
      name,
      description,
      ...(location && { location: { create: location } }),
      ...otherData,
      ...(belongsToCurrentUser && {
        user: { connect: { id: currentUserId } },
      }),
      ...(!belongsToCurrentUser && {
        provisionalCreatingUser: { connect: { id: currentUserId } },
      }),
      setupSteps: {
        createMany: {
          data: getProfileSetupSteps(belongsToCurrentUser),
        },
      },
    },
    select: {
      id: true,
      setupSteps: true,
    },
  })

  return {
    createdSellerProfileId: sellerProfile.id,
    belongsToCurrentUser,
  }
}

const handler = authRouter().post(async (req, res) => {
  const body = createSellerProfileSchema.parse(req.body)
  const currentUserId = req.session.user.id
  const result = await createSellerProfile(body, currentUserId)

  res.status(201).json(result)
})

export default handler
