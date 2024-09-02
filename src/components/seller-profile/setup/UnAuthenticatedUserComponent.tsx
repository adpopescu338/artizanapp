import { Grid, Typography, Button } from '@mui/material'
import Link from 'next/link'

export const UnAuthenticatedUserComponent = () => {
  return (
    <Grid container justifyContent='center' alignItems='center'>
      <Grid item xs={12}>
        <Typography variant='body1'>
          Pentru a putea adauga profilul unui vânzător, trebuie să fiți logat.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Link href='/app/auth/login'>
          <Button variant='contained' color='primary'>
            Loghează-te
          </Button>
        </Link>
      </Grid>
    </Grid>
  )
}
