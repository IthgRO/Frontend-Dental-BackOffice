import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clinicService } from '@/services/clinic.service'
import { message } from 'antd'

export const useClinic = () => {
  const queryClient = useQueryClient()

  const clinic = useQuery({
    queryKey: ['clinic'],
    queryFn: clinicService.getMyClinic,
  })

  const clinicPicture = useQuery({
    queryKey: ['clinic-picture'],
    queryFn: clinicService.getClinicPicture,
  })

  const updateClinicAddress = useMutation({
    mutationFn: clinicService.updateClinicAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic'] })
      message.success('Clinic address updated successfully')
    },
    onError: () => {
      message.error('Failed to update clinic address')
    },
  })

  const uploadClinicPicture = useMutation({
    mutationFn: clinicService.uploadClinicPicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-picture'] })
      message.success('Clinic picture uploaded successfully')
    },
    onError: () => {
      message.error('Failed to upload clinic picture')
    },
  })

  return {
    clinic,
    clinicPicture,
    updateClinicAddress,
    uploadClinicPicture,
  }
}
