import React from "react";
import { signOut } from "next-auth/react";


interface SidebarProps {
  activeItem?: string;
  onItemSelect: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeItem = "Dashboard",
  onItemSelect,
}) => {
  

  return (
    <div className="sidebar bg-white h-screen w-64 p-4 shadow-md">
      {/* Logo */}
      <div className="sidebar-logo mb-8 text-center">
        <h1 className="text-2xl font-bold text-green-600">MEDVISE</h1>
      </div>

      {/* Sidebar Items */}
      <nav className="sidebar-nav">
        <ul className="space-y-2">
          <li
            className={`nav-item flex items-center p-2 rounded-lg cursor-pointer ${
              activeItem === "Dashboard" 
                ? "bg-green-100 text-green-700" 
                : "hover:bg-gray-100"
            }`}
            onClick={() => onItemSelect("Dashboard")}
          >
            <span className="mr-3">🎙</span> Dashboard
          </li>
          <li
            className={`nav-item flex items-center p-2 rounded-lg cursor-pointer ${
              activeItem === "Appointments" 
                ? "bg-green-100 text-green-700" 
                : "hover:bg-gray-100"
            }`}
            onClick={() => onItemSelect("Appointments")}
          >
            <span className="mr-3">📅</span> Appointments
          </li>
          <li
            className={`nav-item flex items-center p-2 rounded-lg cursor-pointer ${
              activeItem === "Help" 
                ? "bg-green-100 text-green-700" 
                : "hover:bg-gray-100"
            }`}
            onClick={() => onItemSelect("Help")}
          >
            <span className="mr-3">❓</span> Help & Support
          </li>
          <li
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className={`nav-item flex items-center p-2 rounded-lg cursor-pointer hover:bg-red-100 hover:text-red-700`}
          >
            <span className="mr-3">↩️</span> Logout
          </li>
        </ul>
      </nav>

      {/* In Progress Section */}
      <div className="in-progress mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2 text-gray-700">IN PROGRESS</h3>
        <div className="progress-card text-sm text-gray-600">
          <p>Your appointments haven't started for today</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;