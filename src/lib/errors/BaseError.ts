import { ErrorCode } from './error-codes'

export class BaseError extends Error {
  private debugErrorMessage?: string
  private internalCode?: ErrorCode

  constructor(
    exposableMessage: string,
    debugErrorMessage?: string,
    internalCode?: ErrorCode
  ) {
    super(exposableMessage)

    this.debugErrorMessage = debugErrorMessage
    this.internalCode = internalCode
  }

  public getDebugErrorMessage() {
    return this.debugErrorMessage || this.message
  }

  public getInternalErrorCode() {
    return this.internalCode || ErrorCode.UNKNOWN
  }
}
