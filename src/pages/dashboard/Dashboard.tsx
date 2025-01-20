// src/pages/dashboard/Dashboard.tsx

import AppointmentList from '@/components/features/appointments/AppointmentList'
import PageHeader from '@/components/ui/PageHeader'
import { useAppointments } from '@/hooks/useAppointments'
import { CalendarOutlined, MedicineBoxOutlined, UserOutlined } from '@ant-design/icons'
import { Card, Col, Row, Spin, Statistic } from 'antd'

const Dashboard = () => {
  const { appointments, isLoading } = useAppointments()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    )
  }

  const totalAppointments = appointments?.data?.length || 0

  // For upcoming, we check date + time vs. now
  const upcomingAppointments =
    appointments?.data?.filter(app => new Date(app.date + 'T' + app.time) > new Date()).length || 0

  const totalServices = appointments?.data?.filter(app => app.service)?.length || 0

  return (
    <div className="space-y-4">
      <PageHeader title="Dashboard" />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Appointments"
              value={totalAppointments}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Upcoming Appointments"
              value={upcomingAppointments}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Services"
              value={totalServices}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Appointments" className="w-full">
        <AppointmentList appointments={appointments?.data || []} limit={5} />
      </Card>
    </div>
  )
}

export default Dashboard
