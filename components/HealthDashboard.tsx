import React from 'react';
import { Card, Statistic } from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined, 
  HeartOutlined, 
  MedicineBoxOutlined,
  ClockCircleOutlined,
  SafetyOutlined
} from '@ant-design/icons';

const HealthDashboardCards = ({ session, appointments, doctors }:any) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '16px' 
    }}>
      {/* Appointments Card */}
      <Card 
        hoverable 
        style={{ 
          backgroundColor: '#f0fff4', 
          borderColor: '#48bb78',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
        }}
      >
        <Statistic
          title="Total Appointments"
          value={appointments?.length || 0}
          prefix={<CalendarOutlined style={{ color: '#48bb78' }} />}
          valueStyle={{ color: '#2f855a' }}
        />
      </Card>

      {/* User Profile Card */}
      <Card 
        hoverable 
        style={{ 
          backgroundColor: '#e6f4f1', 
          borderColor: '#4fd1c5',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
        }}
      >
        <Statistic
          title="User Profile"
          value={session?.user?.name || 'Guest'}
          prefix={<UserOutlined style={{ color: '#4fd1c5' }} />}
          valueStyle={{ color: '#319795', marginBottom: '10px' }}
        />
        <Statistic
          title="Role"
          value={session?.user?.role || 'Guest'}
          prefix={<SafetyOutlined style={{ color: '#4fd1c5' }} />}
          valueStyle={{ color: '#319795' }}
        />
      </Card>

      {/* Health Metrics Card */}
      <Card 
        hoverable 
        style={{ 
          backgroundColor: '#f0fdf4', 
          borderColor: '#68d391',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
        }}
      >
        <Statistic
          title="Health Check-ups"
          value={Math.floor(appointments?.length * 0.6) || 0}
          prefix={<HeartOutlined style={{ color: '#68d391' }} />}
          valueStyle={{ color: '#38a169' }}
        />
        <div style={{ marginTop: '10px', fontSize: '0.8em', color: '#38a169' }}>
          Estimated Preventive Visits
        </div>
      </Card>

      {session?.user?.role === 'Admin' && (
        <>
          {/* Doctors Card */}
          <Card 
            hoverable 
            style={{ 
              backgroundColor: '#e6fffa', 
              borderColor: '#4fd1c5',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
            }}
          >
            <Statistic
              title="Medical Staff"
              value={doctors?.length || 0}
              prefix={<MedicineBoxOutlined style={{ color: '#4fd1c5' }} />}
              valueStyle={{ color: '#319795' }}
            />
          </Card>

          {/* Average Consultation Time Card */}
          <Card 
            hoverable 
            style={{ 
              backgroundColor: '#f0fff4', 
              borderColor: '#48bb78',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
            }}
          >
            <Statistic
              title="Avg. Consultation Time"
              value="15"
              suffix="mins"
              prefix={<ClockCircleOutlined style={{ color: '#48bb78' }} />}
              valueStyle={{ color: '#2f855a' }}
            />
            <div style={{ marginTop: '10px', fontSize: '0.8em', color: '#2f855a' }}>
              Per Patient
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default HealthDashboardCards;