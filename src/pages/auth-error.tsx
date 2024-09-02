import { useRouter } from 'next/router'
import { FC } from 'react'

const AuthError: FC = () => {
  const router = useRouter()

  const { error } = router.query

  return <div>AuthError: {error?.toString()}</div>
}

export default AuthError
