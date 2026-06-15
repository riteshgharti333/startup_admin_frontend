// components/DashboardLayout.tsx - Liquid Glass Design for CoachPro
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Main Glass Container */}
      <div className="flex w-full m-6 rounded-2xl shadow-2xl border border-white/40 bg-white/30 backdrop-blur-xl overflow-hidden">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar Component */}
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main Content with Outlet */}
          <main className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 md:pb-6">
            <Outlet />
          </main>
        </div>
      </div>

    </div>
  );
}

export default DashboardLayout;
