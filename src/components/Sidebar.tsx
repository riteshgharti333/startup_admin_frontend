import React from "react";
import { NavLink } from "react-router-dom";
import type { NavLinkRenderProps } from "react-router-dom";
import { MdDashboard, MdBusiness, MdChevronLeft } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { IoPeopleOutline } from "react-icons/io5";
import { RiUserFollowLine } from "react-icons/ri";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: "/", label: "Dashboard", icon: MdDashboard },
  { path: "/application", label: "Applications", icon: FaWpforms },
  { path: "/client-leads", label: "Client Leads", icon: IoPeopleOutline },
  { path: "/subscribers", label: "Subscribers", icon: RiUserFollowLine },
  { path: "/business-lists", label: "Business", icon: MdBusiness },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <aside
      className={`
        relative z-30 h-full shrink-0 flex flex-col shadow-lg
        transition-[width] duration-300 ease-in-out
        ${collapsed ? "w-[76px]" : "w-56"}
      `}
    >
      {/* Toggle button (sits on the sidebar edge) */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand (Ctrl+B)" : "Collapse (Ctrl+B)"}
        className="absolute -right-3 top-7 z-40 flex h-6 w-6 items-center justify-center rounded-full
                   border border-gray-200 bg-white text-gray-500 shadow-md
                   transition-all duration-200 hover:scale-110 hover:text-blue-600 hover:shadow-lg"
      >
        <MdChevronLeft
          size={18}
          className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        />
      </button>

      {/* Logo */}
      <div className="flex items-center px-[18px] py-5 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 p-2">
            <img
              src="/logo.svg"
              alt="Twipra Technologies"
              className="w-full h-full object-contain filter brightness-0 invert"
            />
          </div>

          <div
            className={`flex flex-col leading-tight whitespace-nowrap transition-all duration-300 ${
              collapsed
                ? "opacity-0 -translate-x-2 w-0"
                : "opacity-100 translate-x-0"
            }`}
          >
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Twipra
            </span>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent -mt-1">
              Technologies
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
            >
              {({ isActive }: NavLinkRenderProps) => (
                <div
                  className={`
                    relative group flex items-center gap-3 px-4 mb-3 py-2.5 rounded-lg
                    text-sm font-medium transition-all duration-200 overflow-hidden
                    ${
                      isActive
                        ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/50"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  )}

                  <Icon
                    size={20}
                    className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "text-white" : ""
                    }`}
                  />

                  <span
                    className={`whitespace-nowrap transition-all duration-300 ${
                      collapsed
                        ? "opacity-0 -translate-x-2"
                        : "opacity-100 translate-x-0"
                    }`}
                  >
                    {item.label}
                  </span>

                  {isActive && (
                    <div
                      className={`absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-sm transition-opacity duration-200 ${
                        collapsed ? "opacity-0" : "opacity-100"
                      }`}
                    />
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }
        .animate-shine { animation: shine 2.5s ease-in-out infinite; }
      `}</style>
    </aside>
  );
};

export default Sidebar;
