'use client'

import React from 'react';
import { Layout, Menu, Button, Typography, Space, Badge, Tooltip } from 'antd';
import { 
  LogoutOutlined, 
  CalendarOutlined,
  TeamOutlined,
  DashboardOutlined,
  MedicineBoxOutlined,
  UserOutlined
} from '@ant-design/icons';
import { signOut } from "next-auth/react";
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

const { Header } = Layout;
const { Text } = Typography;

export default function DashboardHeader() {
  const { session } = useAuth();
  const userRole = session?.user?.role || 'guest';

  const menuItems = {
    admin: [
      { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
      { key: 'doctors', icon: <TeamOutlined />, label: 'Manage Doctors' },
      { key: 'appointments', icon: <CalendarOutlined />, label: 'Appointments' },
    ],
    doctor: [
      { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
      { key: 'appointments', icon: <CalendarOutlined />, label: 'My Appointments' },
      { key: 'patients', icon: <TeamOutlined />, label: 'My Patients' },
    ],
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return '#1890ff';
      case 'doctor':
        return '#52c41a';
      default:
        return '#d9d9d9';
    }
  };

  return (
    <Header style={{ 
      padding: '0 20px',
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Space align="center">
          <Text strong style={{ fontSize: '1.2rem', marginLeft: '10px', color: '#4CAF50' }}>
            Medwise
          </Text>
          <MedicineBoxOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />
        </Space>
      </div>

      {session?.user && (
        <>
          <Menu 
            mode="horizontal" 
            style={{ flex: 1, justifyContent: 'center', border: 'none' }}
            items={menuItems[userRole as keyof typeof menuItems]}
          />

          <Space size="large" align="center">
            <Tooltip title={`Role: ${userRole}`}>
              <Badge
                count={userRole}
                style={{ 
                  backgroundColor: getRoleBadgeColor(userRole),
                  color: '#fff',
                  boxShadow: '0 0 0 1px #d9d9d9 inset',
                }}
              >
                <Space>
                  <UserOutlined style={{ fontSize: '1.2rem' }} />
                  <Text strong>{session.user.name}</Text>
                </Space>
              </Badge>
            </Tooltip>
            <Button 
              type="primary" 
              icon={<LogoutOutlined />}
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              style={{ background: '#4CAF50', borderColor: '#4CAF50' }}
            >
              Sign Out
            </Button>
          </Space>
        </>
      )}
    </Header>
  );
}

