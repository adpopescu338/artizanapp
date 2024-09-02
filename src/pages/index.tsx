import styles from '@/styles/Home.module.css'
import Button from '@mui/material/Button'
import Link from 'next/link'
import { SignupIntent } from './signup'
import { Grid, Typography } from '@mui/material'

export default function Home() {
  return (
    <Grid container spacing={2} textAlign='center'>
      <Grid item xs={12}>
        <Typography variant='h5'>Bine ai venit pe Artizanapp!</Typography>
      </Grid>
      <Grid item xs={12}>
        <Link href={`/signup?intent=${'sell' satisfies SignupIntent}`}>
          <Button variant='contained' color='primary'>
            Vreau să afișez produsele mele pe Artizanapp
          </Button>
        </Link>
      </Grid>

      <Grid item xs={12}>
        <Link href={`/signup?intent=${'advertise' satisfies SignupIntent}`}>
          <Button variant='contained' color='primary'>
            Vreau să adaug profilul unui vânzător pe Artizanapp
          </Button>
        </Link>
      </Grid>
    </Grid>
  )
}
