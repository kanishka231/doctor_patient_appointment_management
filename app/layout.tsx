// app/layout.tsx (Server-side layout component)
"use client";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import "./globals.css"; // Global styles
import {AuthProvider} from "./context/AuthContext"; 
import SessionProviderWrapper from "@/components/SessionProvider";// Import the client-side AuthProvider

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {/* SessionProvider is used for session handling in a server-side context */}
        <SessionProviderWrapper>
          {/* ClientAuthProvider is a client-side wrapper around AuthProvider */}
          <AuthProvider>{children}</AuthProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

