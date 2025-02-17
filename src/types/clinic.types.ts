// src/types.ts

export interface Dentist {
  id: string
  name: string
  email: string
  phone: string
  priceRange: {
    min: number
    max: number
  }
  clinic?: Clinic
  services?: Service[]
}

export interface Service {
  id: string
  name: string
  category: string
  duration?: number
}

export interface AvailableService {
  name: string
  category: string
}

export interface DentistService extends Service {
  duration: number
}

export interface Clinic {
  name: string
  address: string
  city: string
  country: string
  timezone: number
  phone: string
  email: string
}

export interface UpdateClinicAddressRequest {
  address: string
}

export interface ClinicFormData {
  address: string
  picture?: File
}

export interface ClinicImageDimensions {
  width: number
  height: number
  aspectRatio: number
}
