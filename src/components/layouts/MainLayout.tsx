// src/components/layouts/MainLayout.tsx
import Header from '@/components/layouts/Header'
import Sidebar from '@/components/layouts/Sidebar'
import { Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'

const { Content } = Layout

const MainLayout = () => {
  const location = useLocation()
  const isCalendarPage = location.pathname === '/calendar'

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        {!isCalendarPage && <Header />}
        <Content className={isCalendarPage ? 'h-full' : 'p-4 md:p-6 bg-gray-50'}>
          {isCalendarPage ? (
            <Outlet />
          ) : (
            <div className="bg-white rounded-lg p-4 md:p-6 min-h-full shadow">
              <Outlet />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
