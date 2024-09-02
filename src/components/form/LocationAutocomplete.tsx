import React, { useEffect, useRef, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { useFormikContext } from 'formik'

type Props = {
  label?: string
}

export const LocationAutocomplete: React.FC<Props> = ({
  label = 'Locație',
}) => {
  const { setFieldValue } = useFormikContext<any>()
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById('googleMaps')
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places&language=ro`
        script.id = 'googleMaps'
        document.body.appendChild(script)
        script.onload = initializeAutocomplete
      } else {
        initializeAutocomplete()
      }
    }

    const initializeAutocomplete = () => {
      if (inputRef.current && window.google) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['geocode'], // Get all geocoded places (cities, streets, etc.)
            componentRestrictions: { country: 'ro' },
          }
        )

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          const location = place.geometry?.location

          const formattedAddress = place.formatted_address || ''
          const lat = location?.lat()
          const long = location?.lng()

          console.log('setting value', formattedAddress, lat, long)

          // Update the form fields using setFieldValue
          setFieldValue('location', {
            formattedAddress,
            lat,
            long,
          })

          // Set the input value to display the selected address
          setInputValue(formattedAddress)
        })
      }
    }

    loadGoogleMapsScript()
  }, [setFieldValue])

  return (
    <Autocomplete
      freeSolo
      fullWidth
      // disable clearable because it causes the google autocomplete to show up with values
      disableClearable
      options={[]}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          label={label}
          variant='outlined'
        />
      )}
    />
  )
}
