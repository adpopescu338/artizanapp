import { BaseError } from './BaseError'
import { ErrorCode } from './error-codes'

export class ErrorResponse extends BaseError {
  public statusCode: number
  constructor(
    statusCode: number,
    exposableMessage: string,
    debugErrorMessage?: string,
    internalCode?: ErrorCode
  ) {
    super(exposableMessage, debugErrorMessage, internalCode)

    this.statusCode = statusCode
  }
}
