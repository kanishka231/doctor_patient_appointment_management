"use client";
import React, { useState } from 'react';
import { useAuth } from "@/app/context/AuthContext";
import AppointmentTable from "@/components/AppointmentTable";
import Sidebar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import HealthDashboardCards from '@/components/HealthDashboard';
import HelpAndSupport from "@/components/HelpSuport" 
import Loading from '@/components/Loading';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {loading} = useAuth();

  // Track active item for conditional rendering
  const [activeItem, setActiveItem] = useState("Dashboard");
  const handleSidebarClick = (item: string) => {
    setActiveItem(item);
    setIsCreateModalOpen(false);
  };

  // Render dashboard content based on active item and user role
  const renderDashboardContent = () => {
    switch (activeItem) {
      case "Dashboard":
        return <HealthDashboardCards />;
      case "Appointments":
        return (
          <AppointmentTable
          isCreateModalOpen={isCreateModalOpen}
          onCloseCreateModal={() => setIsCreateModalOpen(false)}
        />
        );
      case "Help":
        return <HelpAndSupport />;
      default:
        return (<HealthDashboardCards />);
    }
  };

  if (loading) {
    return <Loading />;
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
        <Sidebar 
          activeItem={activeItem} 
          onItemSelect={handleSidebarClick} 
        />
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
          <DashboardHeader 
            onSearch={(term) => setSearchTerm(term)}
            onAddAppointment={() => {
              setActiveItem("Appointments");
              setIsCreateModalOpen(true);
            }}
          />
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
