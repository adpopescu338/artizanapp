import FormControlLabel from '@mui/material/FormControlLabel'
import MuiCheckbox, { CheckboxProps } from '@mui/material/Checkbox'
import { useField } from 'formik'
import { Grid } from '@mui/material'

interface Props extends CheckboxProps {
  name: string
  label: string
  /**
   * The Grid xs prop. Default is 12.
   */
  xs?: number
}

export const Checkbox: React.FC<Props> = ({
  name,
  label,
  xs = 12,
  ...props
}) => {
  const [field, meta] = useField(name)
  return (
    <Grid item xs={xs}>
      <FormControlLabel
        control={<MuiCheckbox {...field} {...props} />}
        label={label}
      />
    </Grid>
  )
}
