import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Input, SubmitButton } from '@/components/form'
import { Form, Formik, FieldArray } from 'formik'
import { httpClient } from '@/lib/http-client'
import { useMutation } from 'react-query'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import {
  ContactInfoInput,
  contactInfoSchema,
} from '@/lib/validation/seller-profile/contact-info'
import React, { useMemo } from 'react'
import Swal from 'sweetalert2'
import { AddContactInfoResult } from '@/pages/api/auth/seller-profile/[sellerProfileId]/add-contact-info'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

const validationSchema = toFormikValidationSchema(contactInfoSchema)

const initialValues: ContactInfoInput = {
  phoneNumbers: [],
  email: '',
  links: [],
}

export const ContactDetails: React.FC<{
  sellerProfileId: string
  nextStep: () => void
  sellerProfileBelongsToCurrentUser: boolean
}> = ({ sellerProfileBelongsToCurrentUser, sellerProfileId, nextStep }) => {
  const mutation = useMutation(httpClient.addContactInfo)

  return (
    <Grid container gap={2}>
      <Grid item xs={12}>
        <Typography>
          {sellerProfileBelongsToCurrentUser
            ? 'Puteți adăuga datele de contact acum, sau mai târziu.'
            : 'Puteți adăuga datele de contact acum. Ulterior, nu veți mai avea acces pentru a edita acest profil.'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            console.log(values)
            try {
              const result = await mutation.mutateAsync({
                sellerProfileId,
                data: values,
              })
              console.log(result)
              nextStep()
            } catch (error) {
              console.error(error)
              Swal.fire({
                title: 'Eroare',
                text: 'A apărut o eroare la adăugarea datelor de contact.',
                icon: 'error',
              })
            }
          }}
        >
          {({ values }) => (
            <Form>
              <Grid container gap={2}>
                <FieldArray name='phoneNumbers'>
                  {({ push, remove }) => (
                    <Grid item xs={12}>
                      <Typography variant='h6'>Numere de telefon</Typography>
                      {values.phoneNumbers.map((_, index) => (
                        <Grid container key={index} alignItems='center'>
                          <Grid item xs={10}>
                            <Input
                              name={`phoneNumbers.${index}`}
                              label={`Număr de telefon ${index + 1}`}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton onClick={() => remove(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                      <IconButton onClick={() => push('')}>
                        <AddIcon /> Adaugă număr de telefon
                      </IconButton>
                    </Grid>
                  )}
                </FieldArray>
                <Grid item xs={12}>
                  <Input name='email' label='Email' type='email' />
                </Grid>
                <FieldArray name='links'>
                  {({ push, remove }) => (
                    <Grid item xs={12}>
                      <Typography variant='h6'>Link-uri</Typography>
                      {values.links.map((_, index) => (
                        <Grid container key={index} alignItems='center'>
                          <Grid item xs={10}>
                            <Input
                              name={`links.${index}`}
                              label={`Link ${index + 1}`}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton onClick={() => remove(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                      <IconButton onClick={() => push('')}>
                        <AddIcon /> Adaugă link
                      </IconButton>
                    </Grid>
                  )}
                </FieldArray>
                <Grid item xs={12}>
                  <SubmitButton text='Salvează' />
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  )
}
