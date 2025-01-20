// src/pages/services/Services.tsx

import ServiceForm from '@/components/features/services/ServiceForm'
import PageHeader from '@/components/ui/PageHeader'
import { useClinicStore } from '@/store/useDentistStore'
import { Service } from '@/types'
import { Button, Card, Space, Table } from 'antd'
import { useState } from 'react'

// Mock in-memory services
let DUMMY_SERVICES: Service[] = [
  {
    id: 1,
    name: 'Cleaning',
    description: 'Basic teeth cleaning',
    duration: 30,
    price: 50,
  },
  {
    id: 2,
    name: 'Filling',
    description: 'Cavity filling',
    duration: 45,
    price: 120,
  },
  {
    id: 3,
    name: 'Whitening',
    description: 'Teeth whitening procedure',
    duration: 60,
    price: 200,
  },
]

// A quick local hook to simulate fetching + deleting
function useServices(clinicId: string) {
  // We'll just ignore the clinicId for now and return all
  const [services, setServices] = useState(DUMMY_SERVICES)
  const [isPending, setIsPending] = useState(false)

  const deleteService = {
    isPending,
    mutate: (id: number) => {
      setIsPending(true)
      setTimeout(() => {
        DUMMY_SERVICES = DUMMY_SERVICES.filter(s => s.id !== id)
        setServices([...DUMMY_SERVICES])
        setIsPending(false)
      }, 800)
    },
  }

  return {
    services: { data: services, isLoading: false },
    deleteService,
  }
}

const Services = () => {
  const { selectedClinic } = useClinicStore()
  // Provide selectedClinic?.id or ''
  const { services, deleteService } = useServices(selectedClinic?.id || '')

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Duration (min)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Service) => (
        <Space>
          <ServiceForm service={record} services={services.data} setServicesFn={() => null} />
          <Button
            danger
            onClick={() => deleteService.mutate(record.id)}
            loading={deleteService.isPending}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Services"
        action={<ServiceForm services={services.data} setServicesFn={() => null} />}
      />

      <Card>
        <Table
          columns={columns}
          dataSource={services.data}
          loading={services.isLoading}
          rowKey="id"
          className="w-full"
        />
      </Card>
    </div>
  )
}

export default Services
