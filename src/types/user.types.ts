// src/types.ts

/**
 * A basic User type (if you need it for the store).
 * Adjust as needed for your actual user fields.
 */
export interface User {
  id?: number
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  /**
   * For example: 'Dentist' | 'Patient' | 'admin'
   * depending on your role logic.
   */
  role: string
}

/**
 * Clinic object, with optional fields
 * for address, phone, etc.
 */
export interface Clinic {
  id: number
  name: string
  address: string
}

/**
 * Dentist object, referencing optional `clinic` and `services`.
 */
export interface Dentist {
  id: number
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

/**
 * A basic Service definition: e.g. a dental service item.
 */
export interface Service {
  id: number
  name: string
  description: string
  duration: number
  price: number
}

/**
 * Appointment store example:
 * `date` and `time` are used by the Dashboard for upcoming checks;
 * `start_time` is the combined datetime used in the table.
 */
export interface Appointment {
  id: number
  patient: {
    name: string
  }
  service?: {
    name: string
  }
  start_time: string
  status: 'confirmed' | 'cancelled' | 'pending'
  date: string
  time: string
}

/**
 * Request shape when booking an appointment
 */
export interface BookAppointmentRequest {
  id?: number
  clinicId: number
  serviceId: number
  startDate: string // Ensure this matches `start_time`
}

/**
 * For auth
 */
export interface LoginRequest {
  email: string
  password: string
}
export interface RegisterRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
}
