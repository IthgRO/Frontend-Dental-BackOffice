import { useState, useEffect } from 'react'
import { Button, Card, Form, Input, Typography, message } from 'antd'
import {
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  HomeOutlined,
  GlobalOutlined,
  CameraOutlined,
} from '@ant-design/icons'
import { useClinic } from '@/hooks/useClinic'
import PageHeader from '@/components/ui/PageHeader'
import { Clinic as ClinicType } from '@/types'
import PhotoUploadModal from '@/components/features/clinic/PhotoUploadModal'

const { Text } = Typography

const Clinic = () => {
  const { clinic, clinicPicture, updateClinicAddress, uploadClinicPicture } = useClinic()
  const [form] = Form.useForm()
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)

  useEffect(() => {
    if (clinic.data) {
      form.setFieldsValue(clinic.data)
    }
  }, [clinic.data, form])

  const onFinish = (values: Partial<ClinicType>) => {
    if (values.address) {
      updateClinicAddress.mutate(values.address)
    }
  }

  const handlePhotoSave = async (file: File) => {
    try {
      await uploadClinicPicture.mutateAsync(file)
    } catch (error) {
      message.error('Failed to update clinic photo')
    }
  }

  if (clinic.isLoading) {
    return <div>Loading...</div>
  }

  if (clinic.isError) {
    return <div>Error loading clinic data</div>
  }

  return (
    <div className="space-y-4 pb-8">
      <PageHeader title="Clinic Settings" subtitle="Manage your clinic information" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Photo Card - Smaller on mobile and tablet */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center space-y-4">
            {/* Container with max-width constraints */}
            <div className="w-full max-w-[240px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-none mx-auto">
              <div className="relative group cursor-pointer w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                {clinicPicture.data ? (
                  <img
                    src={clinicPicture.data}
                    alt="clinic"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <CameraOutlined className="text-4xl text-gray-400" />
                  </div>
                )}
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                  onClick={() => setIsPhotoModalOpen(true)}
                >
                  <Text className="text-white">Change Photo</Text>
                </div>
              </div>
            </div>
            <Text type="secondary" className="text-center text-sm sm:text-base">
              Click to update your clinic photo
            </Text>
          </div>
        </Card>

        {/* Form Card */}
        <Card className="lg:col-span-2">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="max-w-2xl"
            requiredMark={false}
          >
            <Form.Item name="name" label="Clinic Name">
              <Input
                prefix={<BankOutlined className="text-gray-400" />}
                placeholder="Clinic name"
                disabled
              />
            </Form.Item>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <Form.Item name="email" label="Email">
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="clinic@example.com"
                  disabled
                />
              </Form.Item>

              <Form.Item name="phone" label="Phone">
                <Input
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="Clinic phone number"
                  disabled
                />
              </Form.Item>
            </div>

            <Form.Item
              name="address"
              label="Street Address"
              rules={[{ required: true, message: 'Please enter clinic address' }]}
            >
              <Input.TextArea
                placeholder="Enter clinic street address"
                autoSize={{ minRows: 2, maxRows: 4 }}
                className="text-sm sm:text-base"
              />
            </Form.Item>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <Form.Item name="city" label="City">
                <Input
                  prefix={<HomeOutlined className="text-gray-400" />}
                  placeholder="City"
                  disabled
                />
              </Form.Item>

              <Form.Item name="country" label="Country">
                <Input
                  prefix={<GlobalOutlined className="text-gray-400" />}
                  placeholder="Country"
                  disabled
                />
              </Form.Item>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateClinicAddress.isPending}
                block
                className="mt-2 sm:mt-4"
              >
                Update Address
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <PhotoUploadModal
        open={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onSave={handlePhotoSave}
        currentImageUrl={clinicPicture.data}
      />
    </div>
  )
}

export default Clinic
