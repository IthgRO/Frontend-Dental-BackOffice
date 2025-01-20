// src/components/layouts/MainLayout.tsx

import Header from '@/components/layouts/Header'
import Sidebar from '@/components/layouts/Sidebar'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

const { Content } = Layout

const MainLayout = () => {
  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Header />
        <Content className="p-4 md:p-6 bg-gray-50">
          <div className="bg-white rounded-lg p-4 md:p-6 min-h-full shadow">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
