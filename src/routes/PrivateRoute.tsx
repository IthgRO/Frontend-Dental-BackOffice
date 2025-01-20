// src/routes/PrivateRoute.tsx

import { getAuthToken, getUserRole } from '@/utils/auth'
import { Navigate, useLocation } from 'react-router-dom'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation()
  const token = getAuthToken()
  const role = getUserRole()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const PATIENT_APP_URL = import.meta.env.VITE_PATIENT_APP_URL

  // If user is not a Dentist, we can redirect them to 5173 auto-login
  if (role !== 'Dentist') {
    window.location.href = `${PATIENT_APP_URL}/auto-login?token=${token}`
    return null
  }

  return <>{children}</>
}

export default PrivateRoute
