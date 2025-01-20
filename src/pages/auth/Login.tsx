import { LoginForm } from '@/components/features/auth/LoginForm'
import { useAppTranslation } from '@/hooks/useAppTranslation'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/useAuthStore'
import { Typography } from 'antd'
import { useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

const { Title } = Typography

const LoginPage = () => {
  const { t } = useAppTranslation('auth')
  const { login } = useAuth()
  const { token, error, clearError } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    clearError()
  }, [clearError])

  if (token) {
    const from = (location.state as any)?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const { shouldRedirect, redirectUrl } = await login.mutateAsync(values)

      if (shouldRedirect && redirectUrl) {
        // Redirect to admin app if user is a dentist
        window.location.href = redirectUrl
      } else {
        // Regular user stays on the main site
        navigate('/dashboard')
      }
    } catch (error) {
      // Error handling is done by the auth store
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <Title level={3}>{t('login.title')}</Title>
      </div>
      <LoginForm
        onFinish={handleLogin}
        isLoading={login.isPending}
        error={error}
        showLinks={false}
      />
    </div>
  )
}

export default LoginPage
