import { useField } from 'formik'
import React from 'react'
import ReactCodeInput from 'react-code-input'

export const OtpInput: React.FC<{
  fieldName: string
}> = ({ fieldName }) => {
  const [field] = useField(fieldName)

  return (
    <ReactCodeInput
      fields={6}
      value={field.value}
      name={fieldName}
      inputMode='numeric'
      onChange={(value) => {
        field.onChange({
          target: {
            name: fieldName,
            value,
          },
        })
      }}
    />
  )
}
