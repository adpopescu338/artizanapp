import React from 'react'
import { Box, Typography, Container, Grid, Link } from '@mui/material'

export const Footer: React.FC = () => {
  return (
    <Box
      component='footer'
      bgcolor='primary.main'
      color='#ffffff'
      sx={{
        padding: '20px 0',
        marginTop: 'auto',
      }}
    >
      <Container maxWidth='lg'>
        <Grid container spacing={4} justifyContent='center'>
          <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
            <Typography variant='h6' color='#ffffff' gutterBottom>
              Compania Ta
            </Typography>
            <Typography variant='body2' color='#ffffff'>
              © {new Date().getFullYear()} Compania Ta. Toate drepturile
              rezervate.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
            <Typography variant='h6' color='#ffffff' gutterBottom>
              Link-uri rapide
            </Typography>
            <Link
              href='/'
              color="#ffffff"
              variant='body2'
              display='block'
              gutterBottom
            >
              Acasă
            </Link>
            <Link
              href='/about'
              color='#ffffff'
              variant='body2'
              display='block'
              gutterBottom
            >
              Despre Noi
            </Link>
            <Link
              href='/services'
              color='#ffffff'
              variant='body2'
              display='block'
              gutterBottom
            >
              Servicii
            </Link>
            <Link
              href='/contact'
              color='#ffffff'
              variant='body2'
              display='block'
              gutterBottom
            >
              Contact
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
