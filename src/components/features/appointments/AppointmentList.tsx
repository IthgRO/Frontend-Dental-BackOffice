import { Appointment } from '@/types'
import { Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { format, isValid } from 'date-fns'

interface AppointmentListProps {
  appointments: Appointment[]
  limit?: number
}

const AppointmentList = ({ appointments, limit }: AppointmentListProps) => {
  const displayedAppointments = limit ? appointments.slice(0, limit) : appointments

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateObj = new Date(date)
      if (!isValid(dateObj)) return 'Invalid date'
      return `${format(dateObj, 'MMM d, yyyy')} at ${time}`
    } catch (error) {
      return 'Invalid date'
    }
  }

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'default'
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'green'
      case 'cancelled':
        return 'red'
      default:
        return 'gold'
    }
  }

  const columns: ColumnsType<Appointment> = [
    {
      title: 'Service',
      dataIndex: ['service', 'name'],
      key: 'service',
      render: service => service || 'N/A',
    },
    {
      title: 'Dentist',
      dataIndex: 'dentistName',
      key: 'dentistName',
      render: dentistName => dentistName || 'N/A',
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, record) => <span>{formatDateTime(record.date, record.time)}</span>,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{(status || 'Pending').toUpperCase()}</Tag>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={displayedAppointments}
      rowKey="id"
      pagination={false}
      locale={{ emptyText: 'No appointments found' }}
    />
  )
}

export default AppointmentList
