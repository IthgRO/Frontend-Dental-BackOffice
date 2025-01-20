import { User } from './appointment.types'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  jwt: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: number
}

export interface RegisterRequest {
  id: number
  clinicId: number
  email: string
  firstName: string
  lastName: string
  phone: string
  role: number
  timezone: string
  password: string
}

export interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  error: string | null
}
