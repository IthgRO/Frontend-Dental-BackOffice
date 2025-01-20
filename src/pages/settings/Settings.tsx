// src/pages/settings/Settings.tsx

import PageHeader from '@/components/ui/PageHeader'
import { useClinicStore } from '@/store/useDentistStore'
import { Button, Card, Form, Input, Select, TimePicker } from 'antd'
import type { Moment } from 'moment'
import moment from 'moment'

interface ClinicSettingsForm {
  name: string
  address: string
  phone: string
  email: string
  workingHours: {
    start: Moment
    end: Moment
  }
  workingDays: string[]
}

const Settings = () => {
  const { selectedClinic, updateClinic, isUpdateClinicPending } = useClinicStore()
  const [form] = Form.useForm()

  // Called when user presses "Save Settings"
  const onFinish = (values: ClinicSettingsForm) => {
    updateClinic.mutate({
      ...values,
      workingHours: {
        start: values.workingHours.start.format('HH:mm'),
        end: values.workingHours.end.format('HH:mm'),
      },
    })
  }

  // Prepare initial form values from selectedClinic
  const initialValues = selectedClinic
    ? {
        ...selectedClinic,
        workingHours: {
          start: moment(selectedClinic.workingHours.start, 'HH:mm'),
          end: moment(selectedClinic.workingHours.end, 'HH:mm'),
        },
      }
    : undefined

  return (
    <div className="space-y-4">
      <PageHeader title="Clinic Settings" />

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={initialValues}
          className="max-w-2xl"
        >
          <Form.Item name="name" label="Clinic Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name={['workingHours', 'start']}
            label="Working Hours Start"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item
            name={['workingHours', 'end']}
            label="Working Hours End"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item name="workingDays" label="Working Days" rules={[{ required: true }]}>
            <Select
              mode="multiple"
              options={[
                { label: 'Monday', value: 'monday' },
                { label: 'Tuesday', value: 'tuesday' },
                { label: 'Wednesday', value: 'wednesday' },
                { label: 'Thursday', value: 'thursday' },
                { label: 'Friday', value: 'friday' },
                { label: 'Saturday', value: 'saturday' },
                { label: 'Sunday', value: 'sunday' },
              ]}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={isUpdateClinicPending}>
            Save Settings
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default Settings
