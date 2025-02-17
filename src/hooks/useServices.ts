import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { serviceService } from '@/services/service.service'

export const useServices = () => {
  const queryClient = useQueryClient()

  const dentistServices = useQuery({
    queryKey: ['dentist-services'],
    queryFn: serviceService.getDentistServices,
  })

  const availableServices = useQuery({
    queryKey: ['available-services'],
    queryFn: serviceService.getAvailableServices,
  })

  const updateServices = useMutation({
    mutationFn: serviceService.updateDentistServices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dentist-services'] })
    },
  })

  return {
    dentistServices,
    availableServices,
    updateServices,
  }
}
