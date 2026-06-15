// components/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import type { NavLinkRenderProps } from "react-router-dom";
import { FiUsers, FiSettings, FiBarChart2 } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { FaItunesNote, FaWpforms } from "react-icons/fa";

const Sidebar: React.FC = () => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: MdDashboard },
    // { path: "/analytics", label: "Analytics", icon: FiBarChart2 },
    // { path: "/employee", label: "Employee", icon: FiUsers },
    { path: "/application", label: "Applications", icon: FaWpforms },
  ];

  return (
    <aside
      className={`
        relative z-30 h-full w-55 
        transition-transform duration-300 ease-in-out flex flex-col shadow-lg
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-300">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="font-semibold text-gray-800 text-lg">AdminHub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1  px-3 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.path} to={item.path}>
              {({ isActive }: NavLinkRenderProps) => (
                <div
                  className={`
                  relative group flex items-center gap-3 px-3 mb-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 overflow-hidden
                  ${
                    isActive
                      ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/50"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
                >
                  {/* Shine effect on active item */}
                  {isActive && (
                    <div className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  )}

                  <Icon
                    size={20}
                    className={`transition-colors ${isActive ? "text-white" : ""}`}
                  />
                  <span>{item.label}</span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Shine animation */}
      <style>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          50%, 100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shine {
          animation: shine 2.5s ease-in-out infinite;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
