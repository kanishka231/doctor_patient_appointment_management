import React from 'react';
import { Layout, Space, Button } from 'antd';
import { BellOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import SearchBar from '@/components/Searchbar';

const { Header } = Layout;

const DashboardHeader = ({
    onSearch,
    onAddAppointment
}: {
    onSearch: (term: string) => void,
    onAddAppointment: () => void
}) => {
    return (
        <Header
            style={{
                background: '#e0f6d8', // Lighter green background
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
            }}
        >
            <div style={{ flex: 1, maxWidth: '400px' }}>
                <SearchBar onSearch={onSearch} />
            </div>
            <Space size="large" align="center">
                <Button
                    className="bg-green-100 text-green-700 font-bold"
                    aria-label="Add Appointment"
                    icon={<PlusOutlined />}
                    onClick={onAddAppointment}
                >
                    Add Appointment
                </Button>
                <BellOutlined 
                data-testid='bell-icon'
                style={{ fontSize: '20px', color: '#333' }} />
                <UserOutlined 
                 data-testid='user-icon'
                style={{ fontSize: '20px', color: '#333' }} />
            </Space>
        </Header>
    );
};

export default DashboardHeader;