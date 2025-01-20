// src/components/features/appointments/AppointmentForm.tsx

import { useAppointments } from '@/hooks/useAppointments'
import { useClinicStore } from '@/store/useDentistStore'
import { Appointment } from '@/types'
import { Button, DatePicker, Form, Modal } from 'antd'
import { useState } from 'react'

interface AppointmentFormData {
  service_id: string
  start_time: string
  notes?: string
}

interface AppointmentFormProps {
  appointment?: Appointment
  onSuccess?: () => void
}

const AppointmentForm = ({ appointment, onSuccess }: AppointmentFormProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [form] = Form.useForm<AppointmentFormData>()

  const { selectedClinic } = useClinicStore()
  const { createAppointment, updateAppointment } = useAppointments(selectedClinic?.id || '')
  const handleSubmit = async (values: AppointmentFormData) => {
    const newAppointment: Appointment = {
      id: appointment?.id || Date.now(),
      patient: { name: 'Unknown Patient' }, // Provide default patient details
      service: { name: 'Unknown Service' }, // Default service details if missing
      start_time: values.start_time,
      status: appointment ? appointment.status : 'pending', // Default status
      date: values.start_time.split('T')[0], // Extract date
      time: values.start_time.split('T')[1] || '00:00', // Extract time or set default
    }

    const action = appointment ? updateAppointment.mutateAsync : createAppointment.mutateAsync
    await action(newAppointment)

    setIsVisible(false)
    form.resetFields()
    onSuccess?.()
  }

  return (
    <>
      <Button type="primary" onClick={() => setIsVisible(true)}>
        {appointment ? 'Edit Appointment' : 'New Appointment'}
      </Button>

      <Modal
        title="Appointment"
        open={isVisible}
        onCancel={() => setIsVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={appointment}>
          <Form.Item name="start_time" label="Date & Time" rules={[{ required: true }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {appointment ? 'Update' : 'Create'} Appointment
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AppointmentForm
