import cookie from 'cookie'
import { GetServerSidePropsContext } from 'next'

export interface Options {
  expires?: Date
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  maxAge?: number
  sameSite?: 'strict' | 'lax' | 'none'
}

export enum CookieNames {
  PRE_REGISTERED_USER_ID = 'pruid',
}
const PREFIX = 'anp'

const DEFAULTS: Options = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24, // 1 day
  sameSite: 'strict',
}

export function serialize(
  name: CookieNames,
  value: string | number | boolean,
  options?: Options
) {
  return cookie.serialize(`${PREFIX}.${name}`, String(value), {
    ...DEFAULTS,
    ...options,
  })
}

export function parse(ctx: GetServerSidePropsContext, name: CookieNames) {
  return ctx.req.cookies[`${PREFIX}.${name}`]
}

export function remove(ctx: GetServerSidePropsContext, name: CookieNames) {
  const cookies = cookie.serialize(`${PREFIX}.${name}`, '', {
    ...DEFAULTS,
    maxAge: 0,
  })
  ctx.res.setHeader('Set-Cookie', cookies)
}
