// src/types.ts

export interface Clinic {
  id: string
  name: string
  address: string
}

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
  description: string
  duration: number
  price: number
}
