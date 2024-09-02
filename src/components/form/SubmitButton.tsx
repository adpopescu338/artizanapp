import { useFormikContext } from 'formik'
import Button, { ButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'

type Props = Omit<ButtonProps, 'children'> & {
  text: string
  /**
   * If true, a spinner will be shown while submitting the form. Defaults to true
   */
  withSpinner?: boolean
  /**
   * The xs prop of the grid item wrapping the button. Defaults to 12
   */
  xs?: number
}

export const SubmitButton: React.FC<Props> = ({
  text,
  withSpinner = true,
  xs = 12,
  onClick,
  ...restProps
}) => {
  const { isSubmitting, isValid, errors, values } = useFormikContext()
  console.log({
    errors,
    values,
  })
  return (
    <Grid item xs={xs}>
      <Button
        fullWidth={
          restProps.fullWidth === undefined ? true : restProps.fullWidth
        }
        type={onClick ? undefined : 'submit'}
        variant='contained'
        color='primary'
        disabled={!isValid || isSubmitting}
        {...restProps}
      >
        {withSpinner && isSubmitting ? (
          <CircularProgress size={24} color='inherit' />
        ) : (
          text
        )}
      </Button>
    </Grid>
  )
}
