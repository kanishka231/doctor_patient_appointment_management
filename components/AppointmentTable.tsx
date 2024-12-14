"use client";
import React, { useState } from 'react';
import { Card, Button, Table, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "axios";
import { useAuth } from '@/app/context/AuthContext';
import dynamic from 'next/dynamic';

const AppointmentForm = dynamic(() => import('@/components/AppoinmentForm'), {
  ssr: false
});

// Date formatting function
const formatDate = (dateString: string) => {
  return dateString ? new Date(dateString).toLocaleDateString() : '-';
};

export default function AppointmentTable() {
  const {
    session,
    doctors,
    appointments,
    fetchAppointments,
    loading,
  } = useAuth();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);

  // Create Appointment Handler
  const handleCreateAppointment = async (appointmentData: any) => {
    try {
      await axios.post("/api/appointments", appointmentData, {
        headers: {
          role: session?.user?.role,
          userId: session?.user?.id,
        },
      });

      fetchAppointments();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  // Update Appointment Handler
  const handleUpdateAppointment = async (updatedData: any) => {
    try {
      const updateData = {
        id: editingAppointment._id,
        update: {
          ...updatedData
        }
      };

      await axios.patch("/api/appointments", updateData, {
        headers: {
          role: session?.user?.role,
          userId: session?.user?.id,
        },
      });

      fetchAppointments();
      setEditingAppointment(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
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
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  // Transform appointments with formatted date
  const transformedAppointments = appointments.map((appointment:any) => ({
    ...appointment,
    formattedDate: formatDate(appointment.date)
  }));

  // Table columns configuration
  const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Date',
      dataIndex: 'formattedDate',
      key: 'formattedDate',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => setEditingAppointment(record)}
          >
            Edit
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteAppointment(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card 
      title="Appointments" 
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Appointment
        </Button>
      }
    >
      <Table 
        columns={columns} 
        dataSource={transformedAppointments} 
        rowKey="_id"
        locale={{ emptyText: 'No appointments available' }}
      />

      {/* Create Appointment Form */}
      {isCreateModalOpen && (
        <AppointmentForm
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateAppointment}
          session={session}
          doctors={doctors}
        />
      )}

      {/* Edit Appointment Form */}
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
}