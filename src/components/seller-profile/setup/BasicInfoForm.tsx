import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Input, SubmitButton } from '@/components/form'
import { Form, Formik } from 'formik'
import { httpClient } from '@/lib/http-client'
import { useMutation } from 'react-query'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import {
  CreateSellerProfileInput,
  createSellerProfileSchema,
} from '@/lib/validation/seller-profile/create'
import { Checkbox } from '@/components/form/Checkbox'
import { useMemo } from 'react'
import { LocationAutocomplete } from '@/components/form/LocationAutocomplete'
import Swal from 'sweetalert2'
import { SignupIntent } from '@/pages/signup'
import type { CreateSellerProfileResult } from '@/pages/api/auth/seller-profile/create'

export const validationSchema = toFormikValidationSchema(
  createSellerProfileSchema
)

const initialValues: CreateSellerProfileInput = {
  name: '',
  shortDescription: '',
  description: '',
  location: undefined,
  belongsToCurrentUser: false,
}

export const BasicInfoForm: React.FC<{
  intent: SignupIntent
  nextStep: (args: CreateSellerProfileResult) => void
}> = ({ intent, nextStep }) => {
  const mutation = useMutation(httpClient.createSellerProfile)
  const computedInitialValues = useMemo(() => {
    if (intent === 'advertise') {
      return {
        ...initialValues,
        belongsToCurrentUser: true,
      }
    }

    return initialValues
  }, [intent])

  return (
    <Grid container gap={2}>
      <Grid item xs={12}>
        <Typography variant='body1' sx={{ mb: 2, textAlign: 'center' }}>
          {intent === 'advertise'
            ? 'Puteți adăuga detalii de bază ale profilului, dar după aceasta nu veți mai avea acces la profil.'
            : 'Puteți adăuga detalii ale profilului vânzătorului. Veți avea acces continuu la acest profil.'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Formik
          initialValues={computedInitialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const result = await mutation.mutateAsync(values)

              nextStep(result)
            } catch (error) {
              console.error(error)
              Swal.fire({
                title: 'Error',
                text: 'A apărut o eroare la crearea profilului. Vă rugăm să încercați mai târziu.',
                icon: 'error',
              })
            }
          }}
        >
          <Form>
            <Grid container gap={2}>
              <Input name='name' label='Nume' />
              <Input name='description' label='Descriere' />
              <Input
                name='shortDescription'
                label='Despre producător'
                multiline
              />
              <LocationAutocomplete label='Locație' />
              <Checkbox
                name='belongsToCurrentUser'
                label='Eu sunt producătorul pentru acest profil'
              />
              <SubmitButton text='Trimite' />
            </Grid>
          </Form>
        </Formik>
      </Grid>
    </Grid>
  )
}
