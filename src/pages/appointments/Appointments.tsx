// src/pages/appointments/Appointments.tsx

import AppointmentForm from '@/components/features/appointments/AppointmentForm'
import PageHeader from '@/components/ui/PageHeader'
import { useAppointments } from '@/hooks/useAppointments'
import { useClinicStore } from '@/store/useDentistStore'
import { Table, Tag } from 'antd'
import { format, isValid } from 'date-fns'

const Appointments = () => {
  const { selectedClinic } = useClinicStore()
  const { appointments } = useAppointments(selectedClinic?.id || '')

  const formatDateTime = (datetime: string) => {
    try {
      const date = new Date(datetime)
      return isValid(date) ? format(date, 'MMM d, yyyy h:mm a') : 'Invalid date'
    } catch {
      return 'Invalid date'
    }
  }

  const columns = [
    {
      title: 'Patient',
      dataIndex: ['patient', 'name'],
      render: (name: string) => name || 'N/A',
    },
    {
      title: 'Service',
      dataIndex: ['service', 'name'],
      render: (name: string) => name || 'N/A',
    },
    {
      title: 'Date',
      dataIndex: 'start_time',
      render: (time: string) => formatDateTime(time),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={status === 'confirmed' ? 'green' : status === 'cancelled' ? 'red' : 'gold'}>
          {(status || 'Pending').toUpperCase()}
        </Tag>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader title="Appointments" action={<AppointmentForm />} />
      <Table
        columns={columns}
        dataSource={appointments.data || []}
        loading={appointments.isLoading}
        className="bg-white rounded-lg shadow"
        rowKey="id"
        locale={{ emptyText: 'No appointments found' }}
      />
    </div>
  )
}

export default Appointments
