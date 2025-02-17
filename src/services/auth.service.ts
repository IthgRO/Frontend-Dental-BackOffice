import { LoginRequest, LoginResponse, RegisterRequest } from '@/types'
import apiClient from './apiClient'

export const authService = {
  register: async (userData: RegisterRequest) => {
    try {
      const response = await apiClient.post('/user/register', userData)
      return response.data
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message)
      throw error
    }
  },

  sendPasswordResetCode: async (email: string) => {
    try {
      const response = await apiClient.post('/user/sendPasswordChangeCode', { email })
      return response.data
    } catch (error: any) {
      console.error('Send reset code error:', error.response?.data || error.message)
      throw error
    }
  },

  changePassword: async (data: { email: string; code: string; newPassword: string }) => {
    try {
      const response = await apiClient.post('/user/changeForgottenPassword', data)
      return response.data
    } catch (error: any) {
      console.error('Change password error:', error.response?.data || error.message)
      throw error
    }
  },

  me: async () => {
    try {
      const response = await apiClient.get('/auth/me')
      return response.data
    } catch (error: any) {
      console.error('Get user profile error:', error.response?.data || error.message)
      throw error
    }
  },

  sendDoctorLoginCode: async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post('/dentist/sendDoctorLoginCode', credentials)
      return response.data
    } catch (error: any) {
      console.error('Send doctor login code error:', error.response?.data || error.message)
      throw error
    }
  },

  loginWithCode: async (data: {
    email: string
    password: string
    code: string
  }): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/dentist/loginWithCode', data)
      return response.data
    } catch (error: any) {
      console.error('Login with code error:', error.response?.data || error.message)
      throw error
    }
  },
}
