import { authOptions } from '@/pages/api/auth/next-auth/[...nextauth]'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'

export const getSession = async (
  ctx: Pick<GetServerSidePropsContext, 'req' | 'res'>
) => {
  return await getServerSession(ctx.req, ctx.res, authOptions)
}
