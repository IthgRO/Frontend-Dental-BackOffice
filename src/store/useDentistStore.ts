// src/store/useDentistStore.ts

import { Clinic, Dentist } from '@/types'
import { create } from 'zustand'

// Extended clinic interface for your Settings page (includes workingHours, etc.)
interface ExtendedClinic extends Clinic {
  phone: string
  email: string
  workingHours: {
    start: string
    end: string
  }
  workingDays: string[]
}

// Example: Dummy clinics + dentists
// We include phone, email, workingHours, and workingDays for Settings
const DUMMY_CLINICS: ExtendedClinic[] = [
  {
    id: 101,
    name: 'Downtown Dental Clinic',
    address: '123 Main Street',
    phone: '555-1111',
    email: 'downtown@example.com',
    workingHours: { start: '09:00', end: '17:00' },
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  },
  {
    id: 102,
    name: 'Uptown Dental Clinic',
    address: '456 Broad Avenue',
    phone: '555-2222',
    email: 'uptown@example.com',
    workingHours: { start: '10:00', end: '18:00' },
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  },
]

const DUMMY_DENTISTS: Dentist[] = [
  {
    id: 1,
    name: 'Dr. John Smith',
    email: 'john@example.com',
    phone: '555-1234',
    priceRange: { min: 50, max: 200 },
    clinic: DUMMY_CLINICS[0],
    services: [],
  },
  {
    id: 2,
    name: 'Dr. Alice Johnson',
    email: 'alice@example.com',
    phone: '555-5678',
    priceRange: { min: 75, max: 250 },
    clinic: DUMMY_CLINICS[1],
    services: [],
  },
]

interface DentistStoreState {
  clinics: ExtendedClinic[]
  dentists: Dentist[]
  selectedClinic: ExtendedClinic | null

  // For Settings page
  isUpdateClinicPending: boolean
  updateClinic: {
    mutate: (newData: Partial<ExtendedClinic>) => void
  }

  selectClinic: (clinic: ExtendedClinic) => void
  clearSelectedClinic: () => void
}

export const useDentistStore = create<DentistStoreState>((set, get) => ({
  clinics: DUMMY_CLINICS,
  dentists: DUMMY_DENTISTS,
  selectedClinic: null,

  isUpdateClinicPending: false,
  updateClinic: {
    mutate: newData => {
      // Simulate "isPending"
      set({ isUpdateClinicPending: true })

      // Let's do a tiny timeout to simulate an async request
      setTimeout(() => {
        const { selectedClinic, clinics } = get()

        if (!selectedClinic) {
          // If no clinic selected, do nothing
          set({ isUpdateClinicPending: false })
          return
        }

        // We'll create a merged object
        const updatedClinic = { ...selectedClinic, ...newData }

        // Also update the clinics array
        const updatedClinics = clinics.map(c => (c.id === updatedClinic.id ? updatedClinic : c))

        set({
          clinics: updatedClinics,
          selectedClinic: updatedClinic,
          isUpdateClinicPending: false,
        })
      }, 1000)
    },
  },

  selectClinic: clinic => set({ selectedClinic: clinic }),
  clearSelectedClinic: () => set({ selectedClinic: null }),
}))

/**
 * If you need a separate export for "useClinicStore"
 * (because your code imports { useClinicStore } from '@/store/useDentistStore'),
 * simply alias the same store:
 */
export const useClinicStore = useDentistStore
