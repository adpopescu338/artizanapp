import { ErrorResponse } from '@/lib/errors/ErrorResponse'
import { SellerProfile } from '@prisma/client'

export const validateAccessToSellerProfile = (
  sellerProfile: Pick<SellerProfile, 'userId' | 'provisionalCreatingUserId'>,
  currentUserId: string
) => {
  const hasAccess =
    sellerProfile.userId === currentUserId ||
    sellerProfile.provisionalCreatingUserId === currentUserId

  if (!hasAccess) {
    throw new ErrorResponse(
      403,
      'You are not allowed to update this seller profile'
    )
  }
}
