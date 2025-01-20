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

  // If user is not a Dentist, we can redirect them to 5173 auto-login
  if (role !== 'Dentist') {
    window.location.href = `http://localhost:5173/auto-login?token=${token}`
    return null
  }

  return <>{children}</>
}

export default PrivateRoute
