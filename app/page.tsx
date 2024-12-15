"use client";
import React, { useState } from 'react';
import { useAuth } from "@/app/context/AuthContext";
import AppointmentTable from "@/components/AppointmentTable";
import AppointmentForm from "@/components/AppoinmentForm";
import Sidebar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import axios from "axios";
import HealthDashboardCards from '@/components/HealthDashboard';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    session, 
    doctors, 
    appointments, 
    fetchAppointments, 
    loading
  } = useAuth();

  // Track active item for conditional rendering
  const [activeItem, setActiveItem] = useState("");

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
      setActiveItem("")
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  const handleSidebarClick = (item: string) => {
    setActiveItem(item);
    if (item === "Create Appointment") {
      setIsCreateModalOpen(true);
    } else {
      setIsCreateModalOpen(false);
    }
  };

  // Render dashboard content based on active item and user role
  const renderDashboardContent = () => {
    if (activeItem === "") {
      return (
        <HealthDashboardCards 
          session={session} 
          appointments={appointments} 
          doctors={doctors} 
        />
      );
    }

    if (activeItem === "Create Appointment") {
      return (
        <AppointmentForm
          open={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false); 
            setActiveItem(""); 
          }}
          
          onSubmit={handleCreateAppointment}
          session={session}
          doctors={doctors}
        />
      );
    }

    return (
      <AppointmentTable
        searchTerm={searchTerm}
        isCreateModalOpen={isCreateModalOpen}
        onCloseCreateModal={() => setIsCreateModalOpen(false)}
      />
    );
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        style={{
          backgroundColor: "#e6fff2",
          flexShrink: 0,
        }}
      >
        <Sidebar activeItem={activeItem} onItemSelect={handleSidebarClick} />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div
          style={{
            backgroundColor: "#ffffff",
            position: "sticky",
            top: 0,
            borderBottom: "1px solid #ddd",
            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <DashboardHeader onSearch={setSearchTerm} />
        </div>

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
          }}
        >
          {renderDashboardContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;