// context/Auth
// This directive makes the component client-side only
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';


// Define the context's value type
interface AuthContextProps {
  session: any;
  doctors:any;
  appointments: any;
  fetchAppointments: () => void;
  fetchDoctors: () => void;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode; // Accept children prop of type ReactNode
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, status } = useSession(); // NextAuth session
  const [appointments, setAppointments] = useState<any>([]); // Appointments state
  const [doctors, setDoctors] = useState<any>([]); // Doctors state
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  useEffect(() => {
    if (status === 'loading') return; // Skip if session is loading
    if (session?.user?.id) {
      fetchDoctors(); // Fetch doctors when session is available
      fetchAppointments(); // Fetch appointments when session is available
    }
    setLoading(false); // Set loading to false after fetching
  }, [session, status]);

  // Fetch doctors from the API
  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get('/api/doctor');
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  // Fetch appointments from the API
  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('/api/appointments', {
        headers: {
          role: session?.user?.role,
          userId: session?.user?.id,
        },
      });
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ session, doctors, appointments, fetchAppointments, fetchDoctors, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
