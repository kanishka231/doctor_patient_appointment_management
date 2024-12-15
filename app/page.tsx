"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import AppointmentTable from "@/components/AppointmentTable";
import AppointmentForm from "@/components/AppoinmentForm";
import Sidebar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import axios from "axios";


const Dashboard = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {session, doctors, appointments, fetchAppointments, fetchDoctors, loading} = useAuth();

  // Track active item for conditional rendering
  const [activeItem, setActiveItem] = useState("Appointments");
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
      // message.success('Appointment created successfully');
    } catch (error) {
      console.error("Error creating appointment:", error);
      // message.error('Failed to create appointment');
    }
  };

  // Update Appointment Handler
 
  const handleSidebarClick = (item: string) => {
    setActiveItem(item);
    if (item === "Create Appointment") {
      setIsCreateModalOpen(true);
    } else {
      setIsCreateModalOpen(false);
    }
  };

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
          {activeItem === "Create Appointment" ? (
            <AppointmentForm
              open={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSubmit={handleCreateAppointment}// Replace with real submit handler
              session={session}
              doctors={doctors} 
            />
          ) : (
            <AppointmentTable
              searchTerm={searchTerm}
              isCreateModalOpen={isCreateModalOpen}
              onCloseCreateModal={() => setIsCreateModalOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
