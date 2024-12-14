import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { signOut } from "next-auth/react";
import { useAuth } from '@/app/context/AuthContext';

const { Header } = Layout;
const { Title } = Typography;

export default function DashboardHeader() {
  const { session } = useAuth();

  return (
    <Header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
      {session?.user && (
        <Button 
          type="primary" 
          danger 
          icon={<LogoutOutlined />}
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
        >
          Sign Out
        </Button>
      )}
    </Header>
  );
}