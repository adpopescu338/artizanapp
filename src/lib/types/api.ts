import { ErrorCode } from '../errors/error-codes'

export type ApiError = {
  error: string
  errorCode: ErrorCode
}
