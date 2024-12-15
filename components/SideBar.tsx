

import React from "react";
import { signOut } from "next-auth/react";
import { useAuth } from "@/app/context/AuthContext";

interface SidebarProps {
  activeItem?: string;
  onItemSelect: (item: string) => void; // Callback function
}

const Sidebar: React.FC<SidebarProps> = ({
  activeItem = "Appointments",
  onItemSelect,
}) => {
  const { session } = useAuth();

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <h1>MEDVISE</h1>
      </div>

      {/* Sidebar Items */}
      <nav className="sidebar-nav">
        <ul>
          <li
            className={`nav-item ${
              activeItem === "Create Appointment" ? "active" : ""
            }`}
            onClick={() => onItemSelect("Create Appointment")}
          >
            <span className="icon">🎙</span> Create Appointment
          </li>
          <li
            className={`nav-item ${
              activeItem === "Appointments" ? "active" : ""
            }`}
            onClick={() => onItemSelect("Appointments")}
          >
            <span className="icon">📅</span> Appointments
          </li>
          <li
            className={`nav-item ${activeItem === "Help" ? "active" : ""}`}
            onClick={() => onItemSelect("Help")}
          >
            <span className="icon">❓</span> Help & Support
          </li>
          <li
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className={`nav-item ${activeItem === "Logout" ? "active" : ""}`}
          >
            <span className="icon">↩️</span> Logout
          </li>
        </ul>
      </nav>

      {/* In Progress Section */}
      <div className="in-progress">
        <h3>IN PROGRESS</h3>
        <div className="progress-card">
          <p>Your appointments haven’t started for today</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
