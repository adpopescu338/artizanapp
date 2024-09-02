import { validateAccessToSellerProfile } from '@/lib/auth/seller-profile/validate-access'
import { getSession } from '@/lib/auth/get-session'
import prisma from 'prisma/client'
import { authRouter } from '@/lib/middleware/router'

import { ErrorResponse } from '@/lib/errors/ErrorResponse'
import { FilePurpose, uploadFile } from '@/lib/aws/upload-file'
import { SetupStepName } from '@prisma/client'

export type AddProfileImageResult = Awaited<
  ReturnType<typeof uploadProfileImage>
>

const uploadProfileImage = async (
  sellerProfileId: string,
  currentUserId: string,
  imageBase64: string
) => {
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { id: sellerProfileId },
  })

  if (!sellerProfile) {
    throw new ErrorResponse(404, 'Seller profile not found')
  }

  validateAccessToSellerProfile(sellerProfile, currentUserId)

  const imageUrl = await uploadFile(
    imageBase64,
    FilePurpose.SELLER_PROFILE_IMAGE
  )

  // Update the seller profile with the new image URL
  await prisma.sellerProfile.update({
    where: { id: sellerProfileId },
    data: {
      profileImage: {
        create: {
          url: imageUrl,
        },
      },
      setupSteps: {
        update: {
          where: {
            sellerProfileId_name_unique: {
              sellerProfileId,
              name: SetupStepName.PROFILE_IMAGE,
            },
          },
          data: {
            completedAt: new Date(),
          },
        },
      },
    },
  })

  return { imageUrl }
}

const handler = authRouter().post(async (req, res) => {
  try {
    const { sellerProfileId } = req.query
    const { image } = req.body // the image is sent as base64

    if (typeof image !== 'string') {
      throw new ErrorResponse(400, 'Image is required')
    }

    if (typeof sellerProfileId !== 'string') {
      throw new ErrorResponse(400, 'Seller profile id is required')
    }

    const session = await getSession({ req, res })
    const currentUserId = session!.user.id

    const result = await uploadProfileImage(
      sellerProfileId,
      currentUserId,
      image
    )

    res.status(200).json(result)
  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({ error: 'Failed to upload image' })
  }
})

export default handler
