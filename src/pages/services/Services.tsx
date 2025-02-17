import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Select, Space, Table, Tag, message, Checkbox } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { AvailableService, DentistService } from '@/types'
import { useServiceStore } from '@/store/useServiceStore'
import { useServices } from '@/hooks/useServices'
import PageHeader from '@/components/ui/PageHeader'

const Services = () => {
  const navigate = useNavigate()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [initialSelectedServices, setInitialSelectedServices] = useState<string[]>([])
  const { dentistServices, availableServices, updateServices } = useServices()
  const {
    services,
    unsavedChanges,
    setServices,
    addServices,
    removeService,
    updateServiceDuration,
    clearUnsavedChanges,
  } = useServiceStore()

  useEffect(() => {
    if (dentistServices.data) {
      setServices(dentistServices.data)
    }
  }, [dentistServices.data, setServices])

  const handleModalOpen = () => {
    const currentServices = services.map(service => service.name)
    setSelectedServices(currentServices)
    setInitialSelectedServices(currentServices)
    setIsAddModalOpen(true)
  }

  const handleModalClose = () => {
    setIsAddModalOpen(false)
    setSelectedServices([])
    setInitialSelectedServices([])
  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [unsavedChanges])

  const handleSave = async () => {
    try {
      await updateServices.mutateAsync(services)
      clearUnsavedChanges()
      message.success('Services updated successfully')
    } catch (error) {
      message.error('Failed to update services')
    }
  }

  const handleRemoveService = (serviceToRemove: DentistService) => {
    removeService(serviceToRemove.name)
    message.success(`${serviceToRemove.name} removed`)
  }

  const handleAddServices = () => {
    // Remove all existing services that are not selected anymore
    services.forEach(service => {
      if (!selectedServices.includes(service.name)) {
        removeService(service.name)
      }
    })

    // Add newly selected services
    const newServices = selectedServices
      .filter(name => !services.some(s => s.name === name))
      .map(name => {
        const service = availableServices.data?.find(s => s.name === name)
        return service
          ? {
              name: service.name,
              category: service.category,
              duration: 30,
            }
          : null
      })
      .filter((service): service is DentistService => service !== null)

    if (newServices.length > 0) {
      addServices(newServices)
    }

    message.success('Services updated successfully')
    handleModalClose()
  }

  const durationOptions = Array.from({ length: 8 }, (_, i) => ({
    value: (i + 1) * 30,
    label: `${(i + 1) * 30} minutes`,
  }))

  const columns: ColumnsType<DentistService> = [
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
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 200,
      render: (duration: number, record: DentistService) => (
        <Select
          value={duration}
          onChange={(value: number) => {
            updateServiceDuration(record.name, value)
            message.success('Duration updated')
          }}
          options={durationOptions}
          style={{ width: 150 }}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record: DentistService) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleRemoveService(record)}
        />
      ),
    },
  ]

  const modalColumns: ColumnsType<AvailableService> = [
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
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Services"
        action={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleModalOpen}>
            Add Services
          </Button>
        }
      />

      <Table
        columns={columns}
        dataSource={services}
        rowKey={record => `${record.name}-${record.category}`}
        loading={dentistServices.isLoading}
        className="bg-white rounded-lg shadow"
        locale={{ emptyText: 'No services found' }}
        pagination={false}
      />

      {unsavedChanges && (
        <div className="fixed bottom-4 right-4 left-4 bg-white p-4 shadow-lg rounded-lg">
          <Space className="w-full justify-end">
            <Button onClick={() => navigate(-1)}>Discard Changes</Button>
            <Button type="primary" onClick={handleSave} loading={updateServices.isPending}>
              Save Changes
            </Button>
          </Space>
        </div>
      )}

      <Modal
        title="Add Services"
        open={isAddModalOpen}
        onCancel={handleModalClose}
        onOk={handleAddServices}
        width={600}
      >
        <Table
          columns={modalColumns}
          dataSource={availableServices.data}
          rowKey={record => `${record.name}-${record.category}`}
          pagination={false}
          scroll={{ y: 400 }}
        />
      </Modal>
    </div>
  )
}

export default Services
