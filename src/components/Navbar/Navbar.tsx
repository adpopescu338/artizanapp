import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Link from 'next/link'
import Tooltip from '@mui/material/Tooltip'
import { useSession } from 'next-auth/react'

export const Navbar = () => {
  const { status } = useSession()
  const isAuthenticated = status === 'authenticated'
  console.log({ status })

  return (
    <Box>
      <AppBar position='static'>
        <Toolbar variant='dense'>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant='h6'
            color='inherit'
            component='div'
            sx={{ flexGrow: 1 }}
          >
            Placeholder
          </Typography>
          {isAuthenticated && (
            <Link href='/user-profile' passHref>
              <IconButton color='inherit' aria-label='profil' component='a'>
                <Tooltip title='Vizualizează Profilul'>
                  <AccountCircleIcon sx={{ color: 'white' }} />
                </Tooltip>
              </IconButton>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
