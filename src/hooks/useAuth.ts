// src/hooks/useAuth.ts
import { useAppTranslation } from '@/hooks/useAppTranslation'
import { useAuthStore } from '@/store/useAuthStore'
import { LoginRequest, DoctorCodeLoginRequest } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export const useAuth = () => {
  const { t } = useAppTranslation('auth')
  const {
    login: loginStore,
    logout: logoutStore,
    sendDoctorLoginCode: sendDoctorLoginCodeStore,
    loginWithCode: loginWithCodeStore,
  } = useAuthStore()

  const login = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      return await loginStore(credentials)
    },
    onSuccess: response => {
      toast.success(t('notifications.login.success'))

      if (response.shouldRedirect && response.redirectUrl) {
        window.location.href = response.redirectUrl
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message === 'Invalid credentials'
          ? t('notifications.login.invalidCredentials')
          : t('notifications.login.error')
      toast.error(errorMessage)
    },
  })

  const sendDoctorLoginCode = useMutation({
    mutationFn: (credentials: LoginRequest) => sendDoctorLoginCodeStore(credentials),
    onSuccess: () => {
      toast.success(t('notifications.login.codeSent'))
    },
    onError: (error: any) => {
      toast.error(t('notifications.login.error'))
    },
  })

  const loginWithCode = useMutation({
    mutationFn: (data: DoctorCodeLoginRequest) => loginWithCodeStore(data),
    onSuccess: () => {
      toast.success(t('notifications.login.codeVerified'))
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message === 'Invalid code'
          ? t('notifications.login.invalidCode')
          : error.response?.data?.message === 'Code expired'
            ? t('notifications.login.codeExpired')
            : t('notifications.login.codeError')
      toast.error(errorMessage)
    },
  })

  const logout = () => {
    logoutStore()
    toast.success(t('notifications.logout.success'))
  }

  return {
    login,
    logout,
    sendDoctorLoginCode,
    loginWithCode,
    isLoading: login.isPending || sendDoctorLoginCode.isPending || loginWithCode.isPending,
  }
}
