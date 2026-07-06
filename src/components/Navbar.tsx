import { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { authApi } from "../features/auth/api/authApi";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  console.log(user);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);

    try {
      const response = await authApi.logout();
      toast.success(response.message || "Logged out successfully! dfsgg");
    } catch (error: any) {
      // Ignore error, still logout locally
    }

    // Always clear local state and redirect
    logout();
    navigate("/login");
  };

  const handleProfile = () => {
    setIsProfileOpen(false);
    navigate("/profile");
  };

  const handleSettings = () => {
    setIsProfileOpen(false);
    navigate("/settings");
  };

  const notifications = [
    { id: 1, title: "New employee added", time: "5 min ago", read: false },
    { id: 2, title: "Leave request pending", time: "1 hour ago", read: false },
    { id: 3, title: "Salary processed", time: "1 day ago", read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 ">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Left side - menu button & search */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors lg:hidden"
          >
            <FiMenu size={20} />
          </button>

          <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <FiSearch size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-64 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right side - notifications & profile */}
        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notif.read ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-200 text-center">
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-gray-200"></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-medium">
                  {user ? getInitials(user.name) : "U"}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name || "Loading..."}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.toLowerCase() || "User"}
                </p>
              </div>
              <FiChevronDown
                size={16}
                className={`hidden md:block text-gray-400 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleProfile}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <FiUser size={16} className="text-gray-400" />
                    Profile
                  </button>
                  <button
                    onClick={handleSettings}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <FiSettings size={16} className="text-gray-400" />
                    Settings
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <FiLogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
