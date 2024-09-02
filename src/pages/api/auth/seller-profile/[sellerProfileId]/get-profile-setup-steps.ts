import prisma from 'prisma/client'
import { authRouter } from '@/lib/middleware/router'
import { ErrorResponse } from '@/lib/errors/ErrorResponse'
import { validateAccessToSellerProfile } from '@/lib/auth/seller-profile/validate-access'

export type GetProfileSetupStepsResult = Awaited<
  ReturnType<typeof getProfileSetupSteps>
>

const getProfileSetupSteps = async (
  sellerProfileId: string,
  currentUserId: string
) => {
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { id: sellerProfileId },
    select: { setupSteps: true, provisionalCreatingUserId: true, userId: true },
  })

  if (!sellerProfile) {
    throw new ErrorResponse(
      404,
      `Seller profile with id ${sellerProfileId} not found`
    )
  }

  validateAccessToSellerProfile(sellerProfile, currentUserId)

  return sellerProfile.setupSteps
}

const handler = authRouter().get(async (req, res) => {
  const { sellerProfileId } = req.query

  if (typeof sellerProfileId !== 'string') {
    throw new ErrorResponse(400, 'Invalid seller profile id')
  }

  const result = await getProfileSetupSteps(sellerProfileId, req.session.user.id)

  res.json(result)
})

export default handler
