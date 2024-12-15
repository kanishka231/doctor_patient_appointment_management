// import React from 'react';
// import { Layout, Menu, Button } from 'antd';
// import {
//   LogoutOutlined,
//   CalendarOutlined,
//   TeamOutlined,
//   DashboardOutlined,
//   MedicineBoxOutlined
// } from '@ant-design/icons';
// import { signOut } from 'next-auth/react';
// import { useAuth } from '@/app/context/AuthContext';

// const { Sider } = Layout;

// const DashboardSidebar = () => {
//   const { session } = useAuth();
//   const userRole = session?.user?.role || 'guest';

//   const menuItems = {
//     admin: [
//       { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
//       { key: 'doctors', icon: <TeamOutlined />, label: 'Manage Doctors' },
//       { key: 'appointments', icon: <CalendarOutlined />, label: 'Appointments' },
//     ],
//     doctor: [
//       { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
//       { key: 'appointments', icon: <CalendarOutlined />, label: 'My Appointments' },
//       { key: 'patients', icon: <TeamOutlined />, label: 'My Patients' },
//     ],
//   };

//   return (
//     <Sider
//       breakpoint="lg"
//       collapsedWidth="0"
//       style={{
//         background: '#e6fff2', // Lighter green background
//       }}
//     >
//       <div
//         style={{
//           padding: '24px 16px',
//           color: '#333', // Darker text color
//         }}
//       >
//         <div
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             marginBottom: '24px',
//           }}
//         >
//           <MedicineBoxOutlined style={{ fontSize: '24px' }} />
//           <span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '8px' }}>
//             Medvise
//           </span>
//         </div>
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'stretch',
//             gap: '16px',
//           }}
//         >
//           <Button
//             type="default"
//             icon={<CalendarOutlined />}
//             block
//             style={{
//               background: '#e6fff2',
//               border: 'none',
//               color: '#333',
//               fontSize: '16px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               padding: '24px 12px',
//             }}
//           >
//             Create Appointment
//           </Button>
//           <Button
//             type="default"
//             icon={<LogoutOutlined />}
//             block
//             onClick={() => signOut({ callbackUrl: '/auth/signin' })}
//             style={{
//               background: '#e6fff2',
//               borderColor: '#4CAF50',
//               color: '#333',
//               fontSize: '16px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               padding: '8px 12px',
//             }}
//           >
//             Sign Out
//           </Button>
//         </div>
//       </div>
//       <Menu
//         mode="inline"
//         selectedKeys={['dashboard']}
//         items={menuItems[userRole as keyof typeof menuItems]}
//         style={{
//           background: '#e6fff2', // Lighter green background
//           color: '#333', // Darker text color
//           fontSize: '16px', // Increased text size
//         }}
//       />
//     </Sider>
//   );
// };

// export default DashboardSidebar;


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
