import { useAuthStore } from '@/store/useAuthStore'
import {
  CalendarOutlined,
  DashboardOutlined,
  MedicineBoxOutlined,
  SettingOutlined,
  UserOutlined,
  ScheduleOutlined,
  BankOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

const { Sider } = Layout

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/appointments',
      icon: <CalendarOutlined />,
      label: 'Appointments',
    },
    {
      key: '/calendar',
      icon: <ScheduleOutlined />,
      label: 'Calendar',
    },
    {
      key: '/services',
      icon: <MedicineBoxOutlined />,
      label: 'Services',
    },
    {
      key: '/clinic',
      icon: <BankOutlined />,
      label: 'Clinic',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    // If user has role "admin", show Settings
    user?.role === 1 && {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ].filter(Boolean)

  return (
    <Sider
      theme="light"
      width={256}
      breakpoint="lg"
      collapsible
      collapsedWidth={0}
      className="min-h-screen"
    >
      <div className="h-16 flex items-center justify-center bg-white">
        <h1 className="text-xl font-bold">Dental App</h1>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  )
}

export default Sidebar
