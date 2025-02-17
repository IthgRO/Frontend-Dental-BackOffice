// src/pages/auth/DoctorCodeConfirmation.tsx
import { useAppTranslation } from '@/hooks/useAppTranslation'
import { useAuth } from '@/hooks/useAuth'
import { Button, Form, Input } from 'antd'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

const DoctorCodeConfirmation = () => {
  const { t } = useAppTranslation('auth')
  const location = useLocation()
  const navigate = useNavigate()
  const { loginWithCode, sendDoctorLoginCode } = useAuth()
  const { error, clearError } = useAuthStore()
  const [form] = Form.useForm()

  // Get email and password from location state
  const { email, password } = location.state || {}

  useEffect(() => {
    clearError()

    // If no credentials, redirect to login
    if (!email || !password) {
      navigate('/login', { replace: true })
    }
  }, [clearError, email, password, navigate])

  if (!email || !password) {
    return null
  }

  const handleSubmit = async (values: { code: string }) => {
    try {
      await loginWithCode.mutateAsync({
        email,
        password,
        code: values.code,
      })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      // Error handling is done by the mutation
    }
  }

  const handleResendCode = async () => {
    try {
      await sendDoctorLoginCode.mutateAsync({ email, password })
      form.resetFields(['code'])
    } catch (error) {
      // Error handling is done by the mutation
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold">{t('login.enterCode')}</h3>
        <p className="text-gray-600 mt-2">{t('login.codeInstructions')}</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        validateTrigger="onSubmit"
        className="space-y-4"
      >
        <Form.Item name="code" rules={[{ required: true, message: t('validation.required') }]}>
          <Input
            size="large"
            placeholder={t('login.codePlaceholder')}
            className="placeholder:text-gray-400 rounded-lg border-gray-300 focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            disabled={loginWithCode.isPending}
          />
        </Form.Item>

        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 rounded-md"
            size="large"
            loading={loginWithCode.isPending}
            disabled={loginWithCode.isPending}
          >
            {loginWithCode.isPending ? t('login.verifying') : t('login.verifyCode')}
          </Button>
        </Form.Item>

        <div className="text-center">
          <Button
            type="link"
            onClick={handleResendCode}
            disabled={sendDoctorLoginCode.isPending || loginWithCode.isPending}
            className="text-teal-600 hover:text-teal-700"
          >
            {sendDoctorLoginCode.isPending ? t('login.sending') : t('login.resendCode')}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default DoctorCodeConfirmation
