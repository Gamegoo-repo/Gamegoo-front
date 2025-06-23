import type { ApiResponse, PasswordResetRequest, PasswordResetWithVerifyRequest, PasswordCheckRequest, PasswordCheckResponse } from '../types'
import Axios from '@/api'

/* putPasswordChange - 수정 */
export const putPasswordChange = async (data: PasswordResetRequest): Promise<ApiResponse<string>> => {
  const endpoint = '/api/v2/password/change'
  try {
    const response = await Axios.put(endpoint, data)
    return response.data
  } catch (error) {
    console.error('putPasswordChange failed:', error)
    throw error
  }
}

/* postPasswordReset - 생성 */
export const postPasswordReset = async (data: PasswordResetWithVerifyRequest): Promise<ApiResponse<string>> => {
  const endpoint = '/api/v2/password/reset'
  try {
    const response = await Axios.post(endpoint, data)
    return response.data
  } catch (error) {
    console.error('postPasswordReset failed:', error)
    throw error
  }
}

/* postPasswordCheck - 생성 */
export const postPasswordCheck = async (data: PasswordCheckRequest): Promise<ApiResponse<PasswordCheckResponse>> => {
  const endpoint = '/api/v2/password/check'
  try {
    const response = await Axios.post(endpoint, data)
    return response.data
  } catch (error) {
    console.error('postPasswordCheck failed:', error)
    throw error
  }
}
