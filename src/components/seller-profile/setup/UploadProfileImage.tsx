import { Typography, Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Form, Formik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { profileImageSchema } from '@/lib/validation/seller-profile/profile-image'
import { useState } from 'react'
import { SubmitButton } from '@/components/form'
import { httpClient } from '@/lib/http-client'
import { useMutation } from 'react-query'
import Swal from 'sweetalert2'

const validationSchema = toFormikValidationSchema(profileImageSchema)

export const UploadProfileImage: React.FC<{
  sellerProfileId: string
  nextStep: () => void
}> = ({ sellerProfileId, nextStep }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const mutation = useMutation(httpClient.addProfileImage)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h6'>Încărcați o imagine de profil</Typography>
        <Typography variant='body1'>
          Această imagine va fi afișată pe profilul dvs. de vânzător. Alegeți o
          imagine care să vă reprezinte bine afacerea.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Formik
          initialValues={{ image: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              await mutation.mutateAsync({
                sellerProfileId,
                imageBase64: values.image,
              })
              nextStep()
            } catch (error) {
              console.error(error)
              Swal.fire({
                title: 'Eroare',
                text: 'A apărut o eroare la încărcarea imaginii. Vă rugăm să încercați din nou.',
                icon: 'error',
              })
            }
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <input
                    accept='image/*'
                    style={{ display: 'none' }}
                    id='raised-button-file'
                    type='file'
                    onChange={(event) => {
                      handleImageChange(event)
                      const file = event.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setFieldValue('image', reader.result)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  <label htmlFor='raised-button-file'>
                    <Button variant='contained' component='span'>
                      Alegeți o imagine
                    </Button>
                  </label>
                </Grid>
                {previewImage && (
                  <Grid item xs={12}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewImage}
                      alt='Preview'
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <SubmitButton text='Încărcați imaginea' />
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  )
}
