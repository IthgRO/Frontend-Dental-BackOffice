import apiClient from './apiClient'
import { AvailableService, DentistService } from '@/types'

export const serviceService = {
  getAvailableServices: async (): Promise<AvailableService[]> => {
    const response = await apiClient.get('/service/getAvailableServices')
    return response.data
  },

  getDentistServices: async (): Promise<DentistService[]> => {
    const response = await apiClient.get('/service/seeDentistServices')
    return response.data
  },

  updateDentistServices: async (services: DentistService[]) => {
    const response = await apiClient.post(
      '/service/updateDentistServices',
      services.map(service => ({
        name: service.name,
        category: service.category,
        duration: service.duration,
      }))
    )
    return response.data
  },
}
