import { getSession } from '@/lib/auth/get-session'
import { GetServerSideProps } from 'next/types'
import prisma from 'prisma/client'

const SellerProfilePage: React.FC<Awaited<ReturnType<typeof getProps>>> = ({
  sellerProfile,
  sellerProfileBelongsToCurrentUser,
  sellerProfileProvisionallyBelongsToCurrentUser,
  currentUserHasEditAccess,
}) => {
  return (
    <div>
      <h1>{sellerProfile.name}</h1>
    </div>
  )
}

const getProps = async (
  sellerProfileId: string,
  session: Awaited<ReturnType<typeof getSession>>
) => {
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: {
      id: sellerProfileId,
    },
    include: {
      profileImage: true,
      location: true,
      publicPhoneNumbers: true,
    },
  })

  if (!sellerProfile) {
    throw new Error('Seller profile not found')
  }

  const sellerProfileBelongsToCurrentUser = Boolean(
    sellerProfile.userId && sellerProfile.userId === session?.user?.id
  )
  const sellerProfileProvisionallyBelongsToCurrentUser = Boolean(
    sellerProfile.provisionalCreatingUserId &&
      sellerProfile.provisionalCreatingUserId === session?.user?.id
  )

  const currentUserHasEditAccess = Boolean(
    sellerProfileBelongsToCurrentUser ||
      sellerProfileProvisionallyBelongsToCurrentUser
  )

  return {
    sellerProfile,
    sellerProfileBelongsToCurrentUser,
    sellerProfileProvisionallyBelongsToCurrentUser,
    currentUserHasEditAccess,
  }
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { sellerProfileId } = ctx.params as { sellerProfileId: string }

  const session = await getSession(ctx)

  try {
    const props = await getProps(sellerProfileId, session)
    return {
      props,
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export default SellerProfilePage
