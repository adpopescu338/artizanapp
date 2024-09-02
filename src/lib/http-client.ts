import axios from 'axios'
import type { PreRegisterResponse } from '@/pages/api/auth/pre-register'
import { VerifyOtpForPreregistration } from '@/pages/api/auth/verify-otp-for-preregistration'
import { PreRegisterInput } from './validation/pre-register'
import { VerifyOtpForPreregistrationInput } from './validation/verify-otp-for-pre-registration'
import { CreateSellerProfileInput } from './validation/seller-profile/create'
import { CreateSellerProfileResult } from '@/pages/api/auth/seller-profile/create'
import { ContactInfoInput } from '@/lib/validation/seller-profile/contact-info'
import { AddContactInfoResult } from '@/pages/api/auth/seller-profile/[sellerProfileId]/add-contact-info'
import { GetProfileSetupStepsResult } from '@/pages/api/auth/seller-profile/[sellerProfileId]/get-profile-setup-steps'
import { AddProfileImageResult } from '@/pages/api/auth/seller-profile/[sellerProfileId]/add-profile-image'

class HttpClient {
  createSellerProfile = async (
    data: CreateSellerProfileInput
  ): Promise<CreateSellerProfileResult> => {
    const response = await axios.post<CreateSellerProfileResult>(
      '/api/auth/seller-profile/create',
      data
    )
    return response.data
  }

  preRegister = async (
    data: PreRegisterInput
  ): Promise<PreRegisterResponse> => {
    const response = await axios.post<PreRegisterResponse>(
      '/api/auth/pre-register',
      data
    )
    return response.data
  }

  verifyOtpForPreregistration = async (
    data: VerifyOtpForPreregistrationInput
  ): Promise<VerifyOtpForPreregistration> => {
    const response = await axios.post<VerifyOtpForPreregistration>(
      '/api/auth/verify-otp-for-preregistration',
      data
    )
    return response.data
  }

  addContactInfo = async (args: {
    sellerProfileId: string
    data: ContactInfoInput
  }): Promise<AddContactInfoResult> => {
    const response = await axios.post<AddContactInfoResult>(
      `/api/auth/seller-profile/${args.sellerProfileId}/add-contact-info`,
      args.data
    )
    return response.data
  }

  getSellerProfileSetupSteps = async (args: {
    sellerProfileId: string
  }): Promise<GetProfileSetupStepsResult> => {
    const response = await axios.get<GetProfileSetupStepsResult>(
      `/api/auth/seller-profile/${args.sellerProfileId}/get-profile-setup-steps`
    )
    return response.data
  }

  addProfileImage = async (args: {
    sellerProfileId: string
    imageBase64: string
  }): Promise<AddProfileImageResult> => {
    const response = await axios.post<AddProfileImageResult>(
      `/api/auth/seller-profile/${args.sellerProfileId}/add-profile-image`,
      { imageBase64: args.imageBase64 }
    )
    return response.data
  }
}

export const httpClient = new HttpClient()
