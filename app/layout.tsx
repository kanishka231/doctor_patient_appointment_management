"use client"
import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
       
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
