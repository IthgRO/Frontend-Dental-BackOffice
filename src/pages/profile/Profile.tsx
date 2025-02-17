import { useState } from 'react'
import { Button, Card, Form, Input, Tabs, Upload, Space, Divider, message, Typography } from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  LockOutlined,
  UploadOutlined,
  HomeOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { useUpdateProfile } from '@/hooks/useProfile'
import { useAuthStore } from '@/store/useAuthStore'
import PageHeader from '@/components/ui/PageHeader'

const { Text } = Typography

interface ProfileFormData {
  first_name: string
  last_name: string
  phone: string
  email: string
  address: string
}
interface PasswordFormData {
  current_password: string
  new_password: string
  confirm_password: string
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG files!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must be smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

const Profile = () => {
  const { user } = useAuthStore()
  const updateProfile = useUpdateProfile()
  const [basicForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()

  const handleUploadChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as RcFile, url => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }

  const onFinishBasic = (values: ProfileFormData) => {
    updateProfile.mutate(values)
  }

  const onFinishPassword = (values: PasswordFormData) => {
    updateProfile.mutate(values)
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload Photo</div>
    </div>
  )

  return (
    <div className="space-y-4 pb-8">
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your personal information and account settings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center space-y-4">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
            <Text type="secondary" className="text-center">
              Upload a professional photo for your profile. JPG or PNG format, max 2MB.
            </Text>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <Tabs
            items={[
              {
                key: '1',
                label: 'Basic Information',
                children: (
                  <Form
                    form={basicForm}
                    layout="vertical"
                    initialValues={user}
                    onFinish={onFinishBasic}
                    className="max-w-2xl"
                    requiredMark={false}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="first_name"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                      >
                        <Input
                          prefix={<UserOutlined className="text-gray-400" />}
                          placeholder="Enter your first name"
                        />
                      </Form.Item>

                      <Form.Item
                        name="last_name"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                      >
                        <Input
                          prefix={<UserOutlined className="text-gray-400" />}
                          placeholder="Enter your last name"
                        />
                      </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Please enter your email' },
                          { type: 'email', message: 'Please enter a valid email' },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined className="text-gray-400" />}
                          disabled
                          placeholder="your.email@example.com"
                        />
                      </Form.Item>

                      <Form.Item
                        name="phone"
                        label="Phone"
                        rules={[{ required: true, message: 'Please enter your phone number' }]}
                      >
                        <Input
                          prefix={<PhoneOutlined className="text-gray-400" />}
                          placeholder="Enter your phone number"
                        />
                      </Form.Item>
                    </div>

                    <Form.Item
                      name="address"
                      label="Address"
                      rules={[{ required: true, message: 'Please enter your address' }]}
                    >
                      <Input.TextArea
                        prefix={<HomeOutlined className="text-gray-400" />}
                        placeholder="Enter your full address"
                        autoSize={{ minRows: 2, maxRows: 4 }}
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={updateProfile.isPending}
                        block
                      >
                        Save Changes
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: '2',
                label: 'Password',
                children: (
                  <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={onFinishPassword}
                    className="max-w-md"
                    requiredMark={false}
                  >
                    <Form.Item
                      name="current_password"
                      label="Current Password"
                      rules={[{ required: true, message: 'Please enter your current password' }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Enter your current password"
                      />
                    </Form.Item>

                    <Space direction="vertical" className="w-full">
                      <Form.Item
                        name="new_password"
                        label="New Password"
                        rules={[
                          { required: true, message: 'Please enter your new password' },
                          { min: 6, message: 'Password must be at least 6 characters' },
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined className="text-gray-400" />}
                          placeholder="Enter your new password"
                        />
                      </Form.Item>

                      <Form.Item
                        name="confirm_password"
                        label="Confirm Password"
                        dependencies={['new_password']}
                        rules={[
                          { required: true, message: 'Please confirm your new password' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('new_password') === value) {
                                return Promise.resolve()
                              }
                              return Promise.reject('The passwords do not match!')
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined className="text-gray-400" />}
                          placeholder="Confirm your new password"
                        />
                      </Form.Item>
                    </Space>

                    <Divider />

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={updateProfile.isPending}
                        block
                      >
                        Update Password
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  )
}

export default Profile
