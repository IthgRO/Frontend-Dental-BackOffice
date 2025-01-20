// src/hooks/useAppointments.ts

import { useAppointmentStore } from '@/store/useAppointmentStore'
import { Appointment } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Mocked appointment data
let DUMMY_APPOINTMENTS: { data: Appointment[] } = {
  data: [
    {
      id: 1,
      patient: { name: 'Bruce Wayne' },
      service: { name: 'Cleaning' },
      start_time: '2025-12-01T09:00:00',
      status: 'confirmed',
      date: '2025-12-01',
      time: '09:00',
    },
    {
      id: 2,
      patient: { name: 'Clark Kent' },
      service: { name: 'Filling' },
      start_time: '2025-12-02T14:30:00',
      status: 'pending',
      date: '2025-12-02',
      time: '14:30',
    },
  ],
}

export const useAppointments = (clinicId: string = '') => {
  const queryClient = useQueryClient()
  const { setSelectedService, setSelectedDateTime, resetSelection } = useAppointmentStore()

  // Simulate fetch from server
  const fetchAppointments = useQuery({
    queryKey: ['APPOINTMENTS_QUERY_KEY', clinicId],
    queryFn: async () => DUMMY_APPOINTMENTS,
  })

  // Book an appointment
  const createAppointment = useMutation({
    mutationFn: (data: Appointment) => {
      // Ensure Appointment type is used
      return new Promise<Appointment>(resolve => {
        setTimeout(() => {
          DUMMY_APPOINTMENTS.data.push(data)
          resolve(data)
        }, 1000)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['APPOINTMENTS_QUERY_KEY'] })
    },
  })

  // Update an appointment
  const updateAppointment = useMutation({
    mutationFn: (updatedAppt: Appointment) => {
      return new Promise<Appointment>((resolve, reject) => {
        setTimeout(() => {
          const idx = DUMMY_APPOINTMENTS.data.findIndex(a => a.id === updatedAppt.id)
          if (idx === -1) return reject('Appointment not found')
          DUMMY_APPOINTMENTS.data[idx] = updatedAppt
          resolve(updatedAppt)
        }, 1000)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['APPOINTMENTS_QUERY_KEY'] })
    },
  })

  // Cancel appointment
  const cancelAppointment = useMutation({
    mutationFn: (appointmentId: number) => {
      return new Promise<Appointment>((resolve, reject) => {
        setTimeout(() => {
          const idx = DUMMY_APPOINTMENTS.data.findIndex(a => a.id === appointmentId)
          if (idx === -1) return reject('Appointment not found')
          DUMMY_APPOINTMENTS.data[idx].status = 'cancelled'
          resolve(DUMMY_APPOINTMENTS.data[idx])
        }, 1000)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['APPOINTMENTS_QUERY_KEY'] })
    },
  })

  return {
    appointments: {
      data: fetchAppointments.data?.data || [], // Ensure it always returns an array
      isLoading: fetchAppointments.isLoading,
    },
    createAppointment,
    updateAppointment,
    cancelAppointment,
    setSelectedService,
    setSelectedDateTime,
    resetSelection,
  }
}
