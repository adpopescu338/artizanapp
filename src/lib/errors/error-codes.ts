export enum ErrorCode {
  UNKNOWN = 'UNKNOWN',
  AUTH_FAILED = 'AUTH_FAILED',
  UNAUTHORIZED_REQUEST_CAUGHT_BY_MIDDLEWARE = 'UNAUTHORIZED_REQUEST_CAUGHT_BY_MIDDLEWARE',
  USER_NOT_FOUND_FOR_PRE_REG_OTP_VERIFICATION = 'USER_NOT_FOUND_FOR_PRE_REG_OTP_VERIFICATION',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INVALID_REQUEST_BODY = 'INVALID_REQUEST_BODY',
}
