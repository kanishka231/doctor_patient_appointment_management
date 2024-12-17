"use client";
import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, Input, Tooltip, Row, Col, Typography, Descriptions, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined, UserOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const AppointmentForm = dynamic(() => import('@/components/AppoinmentForm'), {
  ssr: false,
});

// Date and time formatting functions
const formatDate = (dateString: string) => {
  return dateString ? dayjs(dateString).format('YYYY-MM-DD') : '-';
};

const formatTime = (dateString: string) => {
  return dateString ? dayjs(dateString).format('HH:mm') : '-';
};

interface AppointmentTableProps {
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({ 
  isCreateModalOpen,
  onCloseCreateModal 
}) => {
  const {
    session,
    doctors,
    appointments,
    fetchAppointments,
    loading,
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [sortedInfo, setSortedInfo] = useState<any>({});
  
  // New state for patient details view
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    const filtered = appointments.filter((appointment: any) =>
      Object.values(appointment).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredAppointments(filtered);
  }, [appointments, searchTerm]);

  const handleCreateAppointment = async (appointmentData: any) => {     
    try {       
      await toast.promise(
        axios.post("/api/appointments", appointmentData, {
          headers: {
            role: session?.user?.role,
            userId: session?.user?.id,
          },
        }),
        {
          loading: 'Creating appointment...',
          success: 'Appointment created successfully!',
          error: 'Failed to create appointment. Please try again.'
        }
      );
       
      fetchAppointments();
      onCloseCreateModal();
    } catch (error) {
      console.error('Appointment creation error:', error);
    }   
  };   

  const handleUpdateAppointment = async (updatedData: any) => {
    try {
      const updateData = {
        id: editingAppointment._id,
        update: {
          ...updatedData,
        },
      };
      await toast.promise(
        axios.patch('/api/appointments', updateData, {
          headers: {
            role: session?.user?.role,
            userId: session?.user?.id,
          },
        }),
        {
          loading: 'Updating appointment...',
          success: 'Appointment updated successfully!',
          error: 'Failed to update appointment. Please try again.'
        }
      );
      
      fetchAppointments();
      setEditingAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await axios.delete('/api/appointments', {
        headers: {
          Id: appointmentId,
          role: session?.user?.role,
          userId: session?.user?.id,
        },
      });

      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  // Transform appointments with formatted date and time
  const transformedAppointments = filteredAppointments.map((appointment: any) => ({
    ...appointment,
    formattedDate: formatDate(appointment.date),
    formattedTime: formatTime(appointment.date),
  }));

  // Table columns configuration
  const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
      sorter: (a: any, b: any) => a.patientName.localeCompare(b.patientName),
      sortOrder: sortedInfo.columnKey === 'patientName' && sortedInfo.order,
    },
    {
      title: 'Date',
      dataIndex: 'formattedDate',
      key: 'formattedDate',
      sorter: (a: any, b: any) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      sortOrder: sortedInfo.columnKey === 'formattedDate' && sortedInfo.order,
    },
    {
      title: 'Time',
      dataIndex: 'formattedTime',
      key: 'formattedTime',
      sorter: (a: any, b: any) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      sortOrder: sortedInfo.columnKey === 'formattedTime' && sortedInfo.order,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      sorter: (a: any, b: any) => a.type.localeCompare(b.type),
      sortOrder: sortedInfo.columnKey === 'type' && sortedInfo.order,
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
      sorter: (a: any, b: any) => a.doctorName.localeCompare(b.doctorName),
      sortOrder: sortedInfo.columnKey === 'doctorName' && sortedInfo.order,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <Space size="middle" className="opacity-0 transition-opacity group-hover:opacity-100">
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => setEditingAppointment(record)}
              type="text"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteAppointment(record._id)}
              type="text"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination(pagination);
    setSortedInfo(sorter);
  };

  const handleRowClick = (record: any) => {
    setSelectedPatient(record);
  };

  const renderPatientDetails = () => {
    if (!selectedPatient) return null;

    return (
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => setSelectedPatient(null)}
              style={{ marginRight: 16 }}
            />
            Patient Details
          </div>
        }
        extra={
          <Space>
            <Button 
              icon={<EditOutlined />} 
              onClick={() => setEditingAppointment(selectedPatient)}
            >
              Edit Appointment
            </Button>
          </Space>
        }
      >
        <Row gutter={24}>
          <Col span={8}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={128} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#87d068' }}
              />
              <Typography.Title level={4} style={{ marginTop: 16 }}>
                {selectedPatient.patientName}
              </Typography.Title>
            </div>
          </Col>
          <Col span={16}>
            <Descriptions 
              column={2} 
              bordered 
              title="Personal Information"
            >
              <Descriptions.Item label="Age">
                {selectedPatient.patientAge}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {selectedPatient.patientGender}
              </Descriptions.Item>
              <Descriptions.Item label="Appointment Type" span={2}>
                {selectedPatient.type}
              </Descriptions.Item>
              <Descriptions.Item label="Appointment Date">
                {formatDate(selectedPatient.date)}
              </Descriptions.Item>
              <Descriptions.Item label="Appointment Time">
                {formatTime(selectedPatient.date)}
              </Descriptions.Item>
              <Descriptions.Item label="Reason for Visit" span={2}>
                {selectedPatient.reasonForVisit}
              </Descriptions.Item>
              <Descriptions.Item label="Doctor" span={2}>
                {selectedPatient.doctorName}
              </Descriptions.Item>
              {selectedPatient.notes && (
                <Descriptions.Item label="Notes" span={2}>
                  {selectedPatient.notes}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Col>
        </Row>
      </Card>
    );
  };

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card 
      title={selectedPatient ? "Patient Details" : "Appointments"} 
      className="shadow-md"
      extra={
        !selectedPatient && (
          <div className="flex items-center space-x-4">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search appointments"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
           
          </div>
        )
      }
    >
      {selectedPatient ? (
        renderPatientDetails()
      ) : (
        <Table
          columns={columns}
          dataSource={transformedAppointments}
          rowKey="_id"
          pagination={pagination}
          onChange={handleTableChange}
          locale={{ emptyText: 'No appointments available' }}
          className="w-full"
          rowClassName={() => 'group hover:bg-gray-50 transition-colors cursor-pointer'}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      )}

      {isCreateModalOpen && (
        <AppointmentForm
          open={isCreateModalOpen}
          onClose={onCloseCreateModal}
          onSubmit={handleCreateAppointment}
          session={session}
          doctors={doctors}
        />
      )}

      {editingAppointment && (
        <AppointmentForm
          open={!!editingAppointment}
          onClose={() => {
            setEditingAppointment(null);
            if (selectedPatient) {
              setSelectedPatient(null);
            }
          }}
          onSubmit={handleUpdateAppointment}
          initialData={editingAppointment}
          session={session}
          doctors={doctors}
        />
      )}
    </Card>
  );
};

export default AppointmentTable;