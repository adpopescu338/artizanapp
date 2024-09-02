import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Input, SubmitButton } from '@/components/form'
import { Form, Formik } from 'formik'
import { httpClient } from '@/lib/http-client'
import { useMutation } from 'react-query'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Button from '@mui/material/Button'
import { signIn } from 'next-auth/react'
import {
  PreRegisterInput,
  preRegisterSchema,
} from '@/lib/validation/pre-register'
import { verifyOtpForPreregistrationSchema } from '@/lib/validation/verify-otp-for-pre-registration'
import { ErrorCode } from '@/lib/errors/error-codes'
import { OtpInput } from '@/components/form/OtpInput'

const validationSchema = toFormikValidationSchema(preRegisterSchema)

const initialValues: PreRegisterInput = {
  email: '',
  password: '',
  fullName: '',
}

export type SignupIntent = 'sell' | 'buy' | 'advertise'

const explanation = {
  sell: 'Pentru a putea afișa produsele tale pe Artizanapp, trebuie să-ți creezi un cont și să-ți verifici adresa de email.',
  advertise:
    'Pentru a putea adauga profilul unui vânzător, trebuie să-ți creezi un cont și să-ți verifici adresa de email.',
} as Record<SignupIntent, string>

/**
 * @description The signup page. Inform the user that we need to create an account first to be able to display products on the app, and verify the email, then we can jump to creating a seller profile
 */
const SignupPage = () => {
  const { query } = useRouter()
  let intent = query.intent as SignupIntent
  if (!Object.keys(explanation).includes(intent)) {
    intent = 'sell'
  }

  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [details, setDetails] = useState<PreRegisterInput | null>(null)
  const [preRegisteredUserId, setPreRegisteredUserId] = useState('')

  if (step === 'details') {
    return (
      <Details
        setPreRegisteredUserId={setPreRegisteredUserId}
        intent={intent}
        setDetails={setDetails}
        nextStep={() => setStep('otp')}
      />
    )
  }

  return (
    <Otp
      goBack={() => setStep('details')}
      preRegisteredUserId={preRegisteredUserId}
      email={details!.email}
      password={details!.password}
      intent={intent}
    />
  )
}

const otpValidationSchema = toFormikValidationSchema(
  verifyOtpForPreregistrationSchema
)

const Otp: React.FC<{
  goBack: () => void
  preRegisteredUserId: string
  email: string
  password: string
  intent: SignupIntent
}> = ({ goBack, preRegisteredUserId, email, password, intent }) => {
  const verifyOtpMutation = useMutation(httpClient.verifyOtpForPreregistration)

  return (
    <Grid container spacing={1} gap={2} textAlign='center'>
      <Grid item xs={12}>
        <Typography variant='h5'>Verificare cod OTP</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='body1'>
          Un cod OTP a fost trimis pe email. Te rugăm să-l introduci mai jos.
        </Typography>
      </Grid>
      <Formik
        initialValues={{
          otp: '',
          preRegisteredUserId,
        }}
        validationSchema={otpValidationSchema}
        onSubmit={async (values) => {
          console.log(values)
          try {
            const result = await verifyOtpMutation.mutateAsync(values)
            await signIn('credentials', {
              email,
              password,
              callbackUrl: '/seller-profile/setup?intent=' + intent,
            })
          } catch (e) {
            console.error(e)
            Swal.fire({
              title: 'Eroare',
              text: 'Codul introdus este greșit. Te rugăm să încerci din nou.',
              icon: 'error',
            })
          }
        }}
      >
        <Form
          style={{
            margin: 'auto',
          }}
        >
          <Grid item xs={12} textAlign='center'>
            <OtpInput fieldName='otp' />
          </Grid>

          <SubmitButton text='Verifică codul' />
        </Form>
      </Formik>
      <Grid item xs={12}>
        <Button onClick={goBack}>Înapoi</Button>
      </Grid>
    </Grid>
  )
}

const Details: React.FC<{
  intent: SignupIntent
  setDetails: (details: PreRegisterInput) => void
  nextStep: () => void
  setPreRegisteredUserId: (id: string) => void
}> = ({ intent, setDetails, nextStep, setPreRegisteredUserId }) => {
  const preRegisterMutation = useMutation(httpClient.preRegister)
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant='h5'>Înregistrare</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='body1'>{explanation[intent]}</Typography>
      </Grid>

      <Grid item xs={12}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const result = await preRegisterMutation.mutateAsync(values)
              setDetails(values)
              nextStep()
              setPreRegisteredUserId(result.preRegisteredUserId)
            } catch (e) {
              const error = e as any
              console.error(error)

              Swal.fire({
                title: 'Eroare',
                text: getPreRegisterErrorMessage(error),
                icon: 'error',
              })
            }
          }}
        >
          <Form>
            <Grid container spacing={2} margin='auto'>
              <Input name='email' label='Email' type='email' />
              <Input name='password' label='Parolă' type='password' />
              <Input name='fullName' label='Nume complet' />
              <SubmitButton text='Înregistrează-te' />
            </Grid>
          </Form>
        </Formik>
      </Grid>
    </Grid>
  )
}

const getPreRegisterErrorMessage = (error: any) => {
  const code = error.response?.data?.errorCode as ErrorCode | undefined

  switch (code) {
    case ErrorCode.USER_ALREADY_EXISTS:
      return 'Un utilizator cu această adresă de email există deja'
    default:
      return 'A apărut o eroare. Te rugăm să încerci din nou.'
  }
}

export default SignupPage
