import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { ErrorResponse } from '@/lib/errors/ErrorResponse'
import { BaseError } from '@/lib/errors/BaseError'
import { getSession } from '@/lib/auth/get-session'
import { ErrorCode } from '@/lib/errors/error-codes'
import { ZodError } from 'zod'
import { Session } from 'next-auth'

const onError = (error: unknown, req: NextApiRequest, res: NextApiResponse) => {
  const { url, method } = req

  const errorPrefix = `Error at ${method} ${url}:`

  let debuggingErrorMessage = (error as Error).message ?? 'Unknown error'
  let errorMessage = 'Internal Server Error'
  let statusCode = 500
  let internalDebuggingCode = ErrorCode.UNKNOWN

  if (error instanceof ErrorResponse) {
    errorMessage = error.message
    statusCode = error.statusCode
    debuggingErrorMessage = error.getDebugErrorMessage()

    internalDebuggingCode = error.getInternalErrorCode()
  } else if (error instanceof BaseError) {
    debuggingErrorMessage = error.getDebugErrorMessage()
    internalDebuggingCode = error.getInternalErrorCode()
  } else if (error instanceof ZodError) {
    statusCode = 400
    errorMessage = error.errors.map((e) => e.message).join(', ')
    internalDebuggingCode = ErrorCode.INVALID_REQUEST_BODY
  }

  console.error(
    `${internalDebuggingCode} ${errorPrefix} ${debuggingErrorMessage}. Returning the following error to the client: ${errorMessage}`
  )

  res.status(statusCode).json({
    error: errorMessage,
    errorCode: internalDebuggingCode,
  })
}

const errorHandler = { onError }

const authMiddleware = async (
  req: AuthedRequest,
  res: NextApiResponse,
  next: () => void
) => {
  const session = req.session
  if (session) return next()

  throw new ErrorResponse(
    401,
    'Unauthorized',
    undefined,
    ErrorCode.UNAUTHORIZED_REQUEST_CAUGHT_BY_MIDDLEWARE
  )
}

const sessionMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  const session = await getSession({ req, res })

  // assign session to req
  Object.assign(req, { session })

  next()
}

export const commonRouter = () =>
  nc<NoAuthedRequest, NextApiResponse>(errorHandler).use(sessionMiddleware)
export const authRouter = () =>
  nc<AuthedRequest, NextApiResponse>(errorHandler)
    .use(sessionMiddleware)
    .use(authMiddleware)

export type AuthedRequest = NextApiRequest & {
  session: Session
}

export type NoAuthedRequest = NextApiRequest & {
  session?: Session
}
