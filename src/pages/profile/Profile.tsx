import { Button, Card, Form, Input, Tabs, Space, Divider, Typography, message } from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  LockOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import { useUpdateProfile } from '@/hooks/useProfile'
import { useAuthStore } from '@/store/useAuthStore'
import PageHeader from '@/components/ui/PageHeader'
import { User } from '@/types'

interface PasswordFormData {
  current_password: string
  new_password: string
  confirm_password: string
}

const Profile = () => {
  const { user } = useAuthStore()
  const updateProfile = useUpdateProfile()
  const [basicForm] = Form.useForm()
  const [passwordForm] = Form.useForm()

  const onFinishBasic = (values: Partial<User>) => {
    updateProfile.mutate(values)
  }

  const onFinishPassword = async (values: PasswordFormData) => {
    try {
      // Implement password update logic
      message.success('Password updated successfully')
      passwordForm.resetFields()
    } catch (error) {
      message.error('Failed to update password')
    }
  }

  return (
    <div className="space-y-4 pb-8">
      <PageHeader title="Profile Settings" subtitle="Manage your account settings" />

      <Card>
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
                      placeholder="Enter your address"
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
  )
}

export default Profile
