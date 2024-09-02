import { GetServerSidePropsContext, GetServerSideProps } from 'next'
import { getSession } from '@/lib/auth/get-session'

type Options = {
  destination: string
}

export const ssrWithAuth =
  (fn: GetServerSideProps, { destination = '/login' }: Options) =>
  async (ctx: GetServerSidePropsContext) => {
    // check if the user is authenticated
    const session = await getSession(ctx)

    if (!session) {
      return {
        redirect: {
          destination,
          permanent: false,
        },
      }
    }

    return fn(ctx)
  }
