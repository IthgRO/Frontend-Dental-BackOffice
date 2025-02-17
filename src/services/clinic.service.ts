import apiClient from './apiClient'
import { Clinic } from '@/types'

export const clinicService = {
  getMyClinic: async (): Promise<Clinic> => {
    const response = await apiClient.get('/clinic/getMyClinic')
    return response.data
  },

  updateClinicAddress: async (address: string) => {
    const response = await apiClient.post('/clinic/updateClinicAddress', { address })
    return response.data
  },

  uploadClinicPicture: async (picture: File) => {
    const formData = new FormData()
    formData.append('picture', picture)
    const response = await apiClient.post('/clinic/uploadClinicPicture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getClinicPicture: async (): Promise<string> => {
    const response = await apiClient.get('/clinic/getClinicPicture', {
      responseType: 'blob',
    })
    return URL.createObjectURL(response.data)
  },
}
