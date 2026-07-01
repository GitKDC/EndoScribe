"use client";
import React from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import LoginScreen from "./LoginScreen";
import Sidebar from "./Sidebar";
import Header from "./Header";

function MainApp({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header />
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {children}
        </div>
      </div>
    </>
  );
}

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MainApp>{children}</MainApp>
    </AuthProvider>
  );
}
