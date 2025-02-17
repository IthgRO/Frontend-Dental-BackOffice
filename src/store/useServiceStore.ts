import { create } from 'zustand'
import { DentistService } from '@/types'

interface ServiceState {
  services: DentistService[]
  unsavedChanges: boolean
  addServices: (services: DentistService[]) => void
  removeService: (serviceName: string) => void
  updateServiceDuration: (serviceName: string, duration: number) => void
  setServices: (services: DentistService[]) => void
  clearUnsavedChanges: () => void
}

export const useServiceStore = create<ServiceState>(set => ({
  services: [],
  unsavedChanges: false,

  addServices: newServices =>
    set(state => ({
      services: [...state.services, ...newServices],
      unsavedChanges: true,
    })),

  removeService: serviceName =>
    set(state => {
      const newServices = state.services.filter(service => service.name !== serviceName)
      return {
        services: newServices,
        unsavedChanges: true,
      }
    }),

  updateServiceDuration: (serviceName, duration) =>
    set(state => ({
      services: state.services.map(service =>
        service.name === serviceName ? { ...service, duration } : service
      ),
      unsavedChanges: true,
    })),

  setServices: services =>
    set({
      services,
      unsavedChanges: false,
    }),

  clearUnsavedChanges: () =>
    set({
      unsavedChanges: false,
    }),
}))
