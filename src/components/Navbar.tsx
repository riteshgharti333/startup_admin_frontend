import { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiX,
  FiFileText,
  FiUsers,
  FiMail,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLogout, useMe } from "../service/hooks/useAuth";
import { useApplications } from "../service/hooks/useApplication";
import { useLeads } from "../service/hooks/useLead";
import { useSubscribers } from "../service/hooks/useSubscriber";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useMe();
  const logoutMutation = useLogout();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch data for search
  const { data: applications } = useApplications();
  const { data: leadsData } = useLeads();
  const { data: subscribersData } = useSubscribers();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase().trim();

    // Search in Applications
    const appResults = (applications || [])
      .filter(
        (app: any) =>
          app.fullName?.toLowerCase().includes(query) ||
          app.email?.toLowerCase().includes(query) ||
          app.position?.toLowerCase().includes(query),
      )
      .map((app: any) => ({
        id: app.id,
        title: app.fullName,
        subtitle: app.email,
        type: "Application",
        path: `/application/${app.id}`,
        icon: FiFileText,
        iconColor: "text-blue-600",
        bgColor: "bg-blue-50",
      }));

    // Search in Leads
    const leads = leadsData?.data || [];
    const leadResults = leads
      .filter(
        (lead: any) =>
          lead.fullName?.toLowerCase().includes(query) ||
          lead.email?.toLowerCase().includes(query) ||
          lead.service?.toLowerCase().includes(query) ||
          lead.company?.toLowerCase().includes(query),
      )
      .map((lead: any) => ({
        id: lead.id,
        title: lead.fullName,
        subtitle: lead.email || lead.service,
        type: "Lead",
        path: `/lead/${lead.id}`,
        icon: FiUsers,
        iconColor: "text-green-600",
        bgColor: "bg-green-50",
      }));

    // Search in Subscribers
    const subscribers = subscribersData?.data || [];
    const subscriberResults = subscribers
      .filter((sub: any) => sub.email?.toLowerCase().includes(query))
      .map((sub: any) => ({
        id: sub.id,
        title: sub.email,
        subtitle: sub.isActive ? "Active" : "Inactive",
        type: "Subscriber",
        path: `/subscribers`,
        icon: FiMail,
        iconColor: "text-purple-600",
        bgColor: "bg-purple-50",
      }));

    // Combine and limit results
    const allResults = [...appResults, ...leadResults, ...subscriberResults];
    setSearchResults(allResults.slice(0, 10));
    setIsSearching(false);
  }, [searchQuery, applications, leadsData, subscribersData]);

  const handleLogout = () => {
    setIsProfileOpen(false);

    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  const handleProfile = () => {
    setIsProfileOpen(false);
    navigate("/profile");
  };

  const handleSettings = () => {
    setIsProfileOpen(false);
    navigate("/settings");
  };

  const handleSearchResultClick = (path: string) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
    navigate(path);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  const notifications = [
    { id: 1, title: "New employee added", time: "5 min ago", read: false },
    { id: 2, title: "Leave request pending", time: "1 hour ago", read: false },
    { id: 3, title: "Salary processed", time: "1 day ago", read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors lg:hidden">
            <FiMenu size={20} />
          </button>

          <div className="relative" ref={searchRef}>
            <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <FiSearch size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search applications, leads, subscribers..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="bg-transparent outline-none text-sm w-80 text-gray-700 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen &&
              (searchQuery.trim() || searchResults.length > 0) && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin inline-block w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <p className="mt-2 text-sm">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className="p-2 border-b border-gray-100 bg-gray-50">
                        <span className="text-xs font-medium text-gray-500">
                          Results ({searchResults.length})
                        </span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {searchResults.map((result) => {
                          const IconComponent = result.icon;
                          return (
                            <button
                              key={result.id}
                              onClick={() =>
                                handleSearchResultClick(result.path)
                              }
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
                            >
                              <div
                                className={`w-8 h-8 rounded-full ${result.bgColor} flex items-center justify-center`}
                              >
                                <IconComponent
                                  size={16}
                                  className={result.iconColor}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  {result.title}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {result.subtitle}
                                </p>
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                                  result.type === "Application"
                                    ? "bg-blue-50 text-blue-600"
                                    : result.type === "Lead"
                                      ? "bg-green-50 text-green-600"
                                      : "bg-purple-50 text-purple-600"
                                }`}
                              >
                                {result.type}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <FiSearch
                        size={40}
                        className="mx-auto text-gray-300 mb-2"
                      />
                      <p className="text-gray-500 text-sm">
                        No results found for "{searchQuery}"
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Try searching by name, email, or service
                      </p>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={notificationRef}>
            {/* <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button> */}

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

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-medium">
                  {getInitials(user?.name)}
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
