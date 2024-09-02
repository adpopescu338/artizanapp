import { Prisma, SetupStepName } from '@prisma/client'

export const SELLER_PROFILE_SETUP_STEPS: Prisma.SetupStepCreateManySellerProfileInput[] =
  [
    {
      name: SetupStepName.BASIC_INFO,
      order: 0,
      skippable: false,
    },
    {
      name: SetupStepName.CONTACT_DETAILS,
      order: 1,
      skippable: false,
    },
    {
      name: SetupStepName.PROFILE_IMAGE,
      order: 2,
      skippable: true,
    },
    {
      name: SetupStepName.PRODUCTS,
      order: 3,
      skippable: false,
    },
  ]

export const SELLER_PROFILE_SETUP_STEPS_WITHOUT_SKIPPABLE =
  SELLER_PROFILE_SETUP_STEPS.filter((step) => !step.skippable).map((s, i) => ({
    ...s,
    order: i,
  }))
