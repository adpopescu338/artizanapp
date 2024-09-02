import NextAuth from 'next-auth'

interface NextAuthUser {
  /** The user's postal address. */
  id: string
  email: string
  emailVerified: boolean
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: NextAuthUser
    status: 'authenticated' | 'unauthenticated' | 'loading'
  }
  interface User extends NextAuthUser {
    id: string
  }
}
