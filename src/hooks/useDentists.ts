import { useDentistStore } from '@/store/useDentistStore'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useDentists = (dentistId?: string) => {
  const {
    dentists,
    selectedDentist,
    isLoading: storeLoading,
    error,
    fetchDentists,
    selectDentist,
    clearSelectedDentist,
  } = useDentistStore()

  const { isLoading: queryLoading } = useQuery({
    queryKey: ['dentists'],
    queryFn: fetchDentists,
    enabled: dentists.length === 0,
  })

  // Clear selected dentist when component unmounts
  useEffect(() => {
    return () => {
      clearSelectedDentist()
    }
  }, [clearSelectedDentist])

  // Handle dentist selection when we have the data and dentistId changes
  useEffect(() => {
    if (dentists.length > 0 && dentistId) {
      const dentist = dentists.find(d => d.id === Number(dentistId))
      if (dentist) {
        selectDentist(dentist)
      }
    }
  }, [dentists, dentistId, selectDentist])

  return {
    dentists,
    selectedDentist,
    isLoading: storeLoading || queryLoading,
    error,
  }
}
