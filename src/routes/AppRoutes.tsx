import AuthLayout from '@/components/layouts/AuthLayout'
import MainLayout from '@/components/layouts/MainLayout'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { getAuthToken } from '@/utils/auth'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

const AutoLoginPage = lazy(() => import('@/pages/auth/AutoLogin'))
const Login = lazy(() => import('@/pages/auth/Login'))
const DoctorCodeConfirmation = lazy(() => import('@/pages/auth/DoctorCodeConfirmation'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'))
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'))
const Appointments = lazy(() => import('@/pages/appointments/Appointments'))
const Services = lazy(() => import('@/pages/services/Services'))
const Profile = lazy(() => import('@/pages/profile/Profile'))
const Settings = lazy(() => import('@/pages/settings/Settings'))
const CalendarPage = lazy(() => import('@/pages/calendar/CalendarPage'))
const Clinic = lazy(() => import('@/pages/clinic/Clinic'))

const AppRoutes = () => {
  const token = getAuthToken()

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route
            path="/doctor-code-confirmation"
            element={token ? <Navigate to="/dashboard" replace /> : <DoctorCodeConfirmation />}
          />
          <Route
            path="/forgot-password"
            element={token ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
          />
          <Route
            path="/reset-password"
            element={token ? <Navigate to="/dashboard" replace /> : <ResetPassword />}
          />
        </Route>

        <Route path="/auto-login" element={<AutoLoginPage />} />

        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/clinic" element={<Clinic />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
