import NextAuth, { NextAuthOptions, User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import client from 'prisma/client'
import bcrypt from 'bcryptjs'
import { ErrorResponse } from '@/lib/errors/ErrorResponse'

export async function getUserByEmailAndPassword(
  email: string,
  password: string
) {
  const user = await client.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      passwordHash: true,
    },
  })

  console.log('found user ==== ', user)

  if (!user) {
    throw new ErrorResponse(401, 'Invalid credential - user/email')
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)

  console.log('isMatch ==== ', isMatch, {
    password,
    userPasswordHash: user.passwordHash,
  })
  if (!isMatch) {
    throw new ErrorResponse(401, 'Invalid credential - email/pass')
  }

  return {
    id: user.id,
  }
}

export const authOptions: NextAuthOptions = {
  debug: false,
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'jsmith@examplu.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('credentials ==== ', credentials)
        if (!credentials) return null
        console.log('credentials is not null!!!!!!')
        // Add logic here to look up the user from the credentials supplied
        const userFromDb = await getUserByEmailAndPassword(
          credentials.email,
          credentials.password
        )

        console.log('userFromDb ==== ', userFromDb)

        return userFromDb as User
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async signIn({ user }) {
      return !!user
    },
    async session({ session, token }) {
      session.user.id = token.id as string

      return session
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: '/app/auth/login',
    error: '/auth-error',
  },
  session: {
    strategy: 'jwt',
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session?.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },
}

export default NextAuth(authOptions)
