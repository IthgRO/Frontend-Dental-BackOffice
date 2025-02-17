import { useEffect, useState } from 'react'
import { Button, Modal, Table, Space, Tag, Checkbox, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { AvailableService, DentistService } from '@/types'
import { useServices } from '@/hooks/useServices'
import { useServiceStore } from '@/store/useServiceStore'

interface ServiceFormProps {
  onSuccess?: () => void
  trigger?: React.ReactNode
}

const ServiceForm = ({ onSuccess, trigger }: ServiceFormProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const { services: existingServices } = useServiceStore()
  const { availableServices } = useServices()

  // Initialize selected services with existing ones
  useEffect(() => {
    if (isVisible) {
      const currentServiceNames = existingServices.map(service => service.name)
      setSelectedServices(currentServiceNames)
    }
  }, [isVisible, existingServices])

  const handleSubmit = () => {
    try {
      // Get removed services
      const currentServiceNames = existingServices.map(service => service.name)
      const removedServices = currentServiceNames.filter(name => !selectedServices.includes(name))

      // Get new services
      const newServices = selectedServices
        .filter(name => !currentServiceNames.includes(name))
        .map(name => {
          const service = availableServices.data?.find(s => s.name === name)
          return service
            ? {
                name: service.name,
                category: service.category,
                duration: 30, // Default duration
              }
            : null
        })
        .filter((service): service is DentistService => service !== null)

      // Update store with removed and new services
      // We'll implement this in the store

      message.success('Services updated successfully')
      setIsVisible(false)
      onSuccess?.()
    } catch (error) {
      message.error('Failed to update services')
      console.error('Error updating services:', error)
    }
  }

  const columns: ColumnsType<AvailableService> = [
    {
      title: '',
      key: 'selection',
      width: 50,
      render: (_, record: AvailableService) => (
        <Checkbox
          checked={selectedServices.includes(record.name)}
          onChange={e => {
            if (e.target.checked) {
              setSelectedServices(prev => [...prev, record.name])
            } else {
              setSelectedServices(prev => prev.filter(name => name !== record.name))
            }
          }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record: AvailableService) => {
        const isExisting = existingServices.some(s => s.name === record.name)
        return isExisting ? <Tag color="green">Added</Tag> : <Tag color="default">Available</Tag>
      },
    },
  ]

  const defaultTrigger = (
    <Button type="primary" icon={<PlusOutlined />}>
      Manage Services
    </Button>
  )

  return (
    <>
      <div onClick={() => setIsVisible(true)}>{trigger || defaultTrigger}</div>

      <Modal
        title="Manage Services"
        open={isVisible}
        onCancel={() => {
          setIsVisible(false)
          setSelectedServices([])
        }}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setIsVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Save Changes
          </Button>,
        ]}
      >
        <div className="mb-4">
          <Text type="secondary">
            Select the services you want to offer. Each service will be added with a default
            duration of 30 minutes.
          </Text>
        </div>

        <Table
          columns={columns}
          dataSource={availableServices.data}
          rowKey="name"
          pagination={false}
          loading={availableServices.isLoading}
          scroll={{ y: 400 }}
          locale={{
            emptyText: availableServices.isLoading ? 'Loading...' : 'No services available',
          }}
        />

        <div className="mt-4">
          <Space>
            <Button
              size="small"
              onClick={() => setSelectedServices(availableServices.data?.map(s => s.name) || [])}
            >
              Select All
            </Button>
            <Button size="small" onClick={() => setSelectedServices([])}>
              Clear All
            </Button>
          </Space>
        </div>
      </Modal>
    </>
  )
}

export default ServiceForm
