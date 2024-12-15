import React, { useState } from 'react';
import { Layout, Space } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import SearchBar from '@/components/Searchbar';

const { Header } = Layout;

const DashboardHeader = ({ onSearch }: { onSearch: (term: string) => void }) => {
  return (
    <Header
      style={{
        background: '#e0f6d8', // Lighter green background
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Space between search and icons
        padding: '0 24px',
      }}
    >
      <div style={{ flex: 1, maxWidth: '400px' }}>
        <SearchBar onSearch={onSearch} />
      </div>
      <Space size="large">
        <BellOutlined style={{ fontSize: '20px', color: '#333' }} />
        <UserOutlined style={{ fontSize: '20px', color: '#333' }} />
      </Space>
    </Header>
  );
};

export default DashboardHeader;
