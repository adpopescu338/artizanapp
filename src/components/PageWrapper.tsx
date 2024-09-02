import Paper from '@mui/material/Paper'

const style = {
  marginLeft: 1,
  marginRight: 1,
  background:
    'linear-gradient(to right, #F0F8FF, #FFFFE0, #FFE4E1)' /* Horizontal gradient */,
  backgroundColor: 'transparent' /* Fallback for older browsers */,
  padding: 1,
  flex: 1, // Fill the remaining space
}

export const PageWrapper: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <Paper elevation={3} sx={style} component='main'>
      {children}
    </Paper>
  )
}
