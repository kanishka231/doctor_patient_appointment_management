"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  LogOut, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  LayoutDashboard 
} from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Dashboard Header */}
          <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <LayoutDashboard className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <button 
              onClick={handleSignOut}
              className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  {session.user?.name}
                  <ShieldCheck className="h-6 w-6 text-green-500 ml-2" />
                </h2>
                <p className="text-gray-600">
                  Role: {session.user?.role}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Status</h3>
                </div>
                <p className="text-green-600 font-bold mt-2">Active</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <User className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Account</h3>
                </div>
                <p className="text-blue-600 font-bold mt-2">{session.user?.email}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <ShieldCheck className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Access</h3>
                </div>
                <p className="text-purple-600 font-bold mt-2">Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}