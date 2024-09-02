import { Button, CircularProgress, Typography, Grid } from '@mui/material'
import { useSession } from 'next-auth/react'
import type { SignupIntent } from '@/pages/signup'
import { useRouter } from 'next/router'
import { UnAuthenticatedUserComponent } from '@/components/seller-profile/setup/UnAuthenticatedUserComponent'
import { BasicInfoForm } from '@/components/seller-profile/setup/BasicInfoForm'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import React, { useCallback } from 'react'
import type { CreateSellerProfileResult } from '@/pages/api/auth/seller-profile/create'
import { ContactDetails } from '@/components/seller-profile/setup/ContactDetails'
import {
  SELLER_PROFILE_SETUP_STEPS,
  SELLER_PROFILE_SETUP_STEPS_WITHOUT_SKIPPABLE,
} from '@/constants/seller-profile-setup-steps'
import { useQuery } from 'react-query'
import { httpClient } from '@/lib/http-client'
import { Prisma, SetupStepName } from '@prisma/client'
import { UploadProfileImage } from '@/components/seller-profile/setup/UploadProfileImage'

const STEPS = [
  'Informații de bază',
  'Detalii de contact',
  'Imagine de profil',
  'Produse',
]

const getSteps = (intent: SignupIntent) => {
  if (intent === 'advertise') {
    return STEPS.filter((s) => s !== 'Imagine de profil')
  }

  return STEPS
}

const useSteps = (
  intent: SignupIntent,
  createSellerProfileResult: CreateSellerProfileResult | null
): {
  steps: Prisma.SetupStepCreateManySellerProfileInput[]
  refetchSteps: () => Promise<void>
} => {
  const query = useQuery(
    ['seller-profile-setup-steps', intent, createSellerProfileResult],
    {
      enabled: !!createSellerProfileResult,
      queryFn: () =>
        httpClient.getSellerProfileSetupSteps({
          sellerProfileId: createSellerProfileResult!.createdSellerProfileId,
        }),
    }
  )

  const steps =
    query.data ||
    (intent === 'sell'
      ? SELLER_PROFILE_SETUP_STEPS
      : SELLER_PROFILE_SETUP_STEPS_WITHOUT_SKIPPABLE)

  return {
    steps,
    refetchSteps: async () => {
      await query.refetch()
    },
  }
}

const stepLabels = {
  [SetupStepName.BASIC_INFO]: 'Informații de bază',
  [SetupStepName.CONTACT_DETAILS]: 'Detalii de contact',
  [SetupStepName.PROFILE_IMAGE]: 'Imagine de profil',
  [SetupStepName.PRODUCTS]: 'Produse',
} as const

const SellerProfileSetup = () => {
  const { data: session } = useSession()
  const { query } = useRouter()
  const intent = query.intent as SignupIntent
  const [activeStep, setActiveStep] = React.useState(0)
  const [createSellerProfileResult, setCreateSellerProfileResult] =
    React.useState<CreateSellerProfileResult | null>(null)
  const { steps, refetchSteps } = useSteps(intent, createSellerProfileResult)

  const increaseStep = useCallback(() => setActiveStep((s) => s + 1), [])

  // CircularProgress inside a div with center alignment
  if (session?.status === 'loading') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </div>
    )
  }

  if (session?.status === 'unauthenticated') {
    return <UnAuthenticatedUserComponent />
  }

  const currentStepObject = steps[activeStep]

  const CurrentComponent = () => {
    const currentStepName = currentStepObject.name
    switch (currentStepName) {
      case SetupStepName.BASIC_INFO:
        return (
          <BasicInfoForm
            intent={intent}
            nextStep={(createProfileResult) => {
              setCreateSellerProfileResult(createProfileResult)
              increaseStep()
            }}
          />
        )
      case SetupStepName.CONTACT_DETAILS:
        return (
          <ContactDetails
            sellerProfileId={createSellerProfileResult!.createdSellerProfileId}
            nextStep={increaseStep}
            sellerProfileBelongsToCurrentUser={
              createSellerProfileResult!.belongsToCurrentUser
            }
          />
        )
      case SetupStepName.PROFILE_IMAGE:
        return (
          <UploadProfileImage
            sellerProfileId={createSellerProfileResult!.createdSellerProfileId}
            nextStep={increaseStep}
          />
        )
      case SetupStepName.PRODUCTS:
        return <div>Products</div>
    }
  }

  return (
    <Grid container gap={2}>
      <Grid item xs={12}>
        <Stepper activeStep={activeStep}>
          {steps.map((s) => (
            <Step key={s.name}>
              <StepLabel>{stepLabels[s.name]}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>
      <Grid item xs={12}>
        <CurrentComponent />
      </Grid>
      {currentStepObject.skippable && (
        <Grid item xs={12}>
          <Button variant='contained' color='primary' onClick={increaseStep}>
            Sari peste
          </Button>
        </Grid>
      )}
    </Grid>
  )
}

export default SellerProfileSetup
