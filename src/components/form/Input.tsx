import { Field } from 'formik'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import { Form, Formik } from 'formik';

type Props = TextFieldProps & {
  xs?: number
  name: string
}

export const Input = ({ name, xs = 12, ...props }: Props) => {
  return (
    <Grid item xs={xs}>
      <Field name={name}>
        {({ field, meta }: any) => (
          <TextField
            fullWidth={props.fullWidth === undefined ? true : props.fullWidth}
            variant={props.variant ?? 'outlined'}
            {...field}
            {...props}
            error={meta.touched && !!meta.error}
            helperText={
              meta.touched && meta.error ? meta.error : props.helperText
            }
          />
        )}
      </Field>
    </Grid>
  )
}
