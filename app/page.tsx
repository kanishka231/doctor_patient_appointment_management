"use client";
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import AppointmentTable from '@/components/AppointmentTable';
import { Layout } from 'antd';

const { Content } = Layout;

export default function Dashboard() {
  return (
    <Layout>
      <DashboardHeader />
      <Content style={{ padding: '24px' }}>
        <AppointmentTable />
      </Content>
    </Layout>
  );
}
