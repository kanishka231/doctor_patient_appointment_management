"use client";
import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, message, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';

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
  searchTerm: string;
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({ 
  searchTerm, 
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

  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [sortedInfo, setSortedInfo] = useState<any>({});

  useEffect(() => {
    const filtered = appointments.filter((appointment: any) =>
      Object.values(appointment).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredAppointments(filtered);
  }, [appointments, searchTerm]);

  // Create Appointment Handler
  const handleCreateAppointment = async (appointmentData: any) => {
    try {
      await axios.post('/api/appointments', appointmentData, {
        headers: {
          role: session?.user?.role,
          userId: session?.user?.id,
        },
      });

      fetchAppointments();
      onCloseCreateModal();
      message.success('Appointment created successfully');
    } catch (error) {
      console.error('Error creating appointment:', error);
      message.error('Failed to create appointment');
    }
  };

  // Update Appointment Handler
  const handleUpdateAppointment = async (updatedData: any) => {
    try {
      const updateData = {
        id: editingAppointment._id,
        update: {
          ...updatedData,
        },
      };

      await axios.patch('/api/appointments', updateData, {
        headers: {
          role: session?.user?.role,
          userId: session?.user?.id,
        },
      });

      fetchAppointments();
      setEditingAppointment(null);
      message.success('Appointment updated successfully');
    } catch (error) {
      console.error('Error updating appointment:', error);
      message.error('Failed to update appointment');
    }
  };

  // Delete Appointment Handler
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
      message.success('Appointment deleted successfully');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      message.error('Failed to delete appointment');
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

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card title="Appointments" className="shadow-md">
      <Table
        columns={columns}
        dataSource={transformedAppointments}
        rowKey="_id"
        pagination={pagination}
        onChange={handleTableChange}
        locale={{ emptyText: 'No appointments available' }}
        className="w-full"
        rowClassName={() => 'group hover:bg-gray-50 transition-colors'}
      />

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
          onClose={() => setEditingAppointment(null)}
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

