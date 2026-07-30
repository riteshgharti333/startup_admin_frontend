import {
  FiUsers,
  FiBriefcase,
  FiMail,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { useApplications } from "../../service/hooks/useApplication";
import { useLeads } from "../../service/hooks/useLead";
import { useSubscribers } from "../../service/hooks/useSubscriber";

const Dashboard = () => {
  // Fetch data
  const { data: applicationsData, isLoading: isLoadingApps } =
    useApplications();
  const { data: leadsData, isLoading: isLoadingLeads } = useLeads();
  const { data: subscribersData, isLoading: isLoadingSubs } = useSubscribers();

  // Extract counts
  const totalApplications = applicationsData?.length || 0;
  const totalLeads = leadsData?.length || 0;
  const totalSubscribers = subscribersData?.data?.length || 0;

  // Calculate changes (you can customize these or fetch from API)
  const stats = [
    {
      title: "Total Applications",
      value: isLoadingApps ? "..." : totalApplications.toString(),
      change: "+12%",
      trend: "up",
      icon: FiBriefcase,
      color: "blue",
      description: "Job applications received",
    },
    {
      title: "Total Leads",
      value: isLoadingLeads ? "..." : totalLeads.toString(),
      change: "+8%",
      trend: "up",
      icon: FiUsers,
      color: "green",
      description: "Client leads captured",
    },
    {
      title: "Total Subscribers",
      value: isLoadingSubs ? "..." : totalSubscribers.toString(),
      change: "+15%",
      trend: "up",
      icon: FiMail,
      color: "purple",
      description: "Newsletter subscribers",
    },
  ];

  const getColorStyles = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 shadow-blue-500/30",
      green: "from-green-500 to-green-600 shadow-green-500/30",
      purple: "from-purple-500 to-purple-600 shadow-purple-500/30",
      orange: "from-orange-500 to-orange-600 shadow-orange-500/30",
    };
    return colors[color as keyof typeof colors];
  };

  // Loading state
  if (isLoadingApps || isLoadingLeads || isLoadingSubs) {
    return (
      <div className="space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="relative group animate-pulse">
              <div className="relative bg-transparent backdrop-blur-xl rounded-2xl border border-white/80 shadow-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-3 rounded-xl bg-gray-200">
                    <div className="w-5 h-5" />
                  </div>
                  <div className="px-2 py-1 rounded-full bg-gray-200 w-16 h-6" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
      </div>

      {/* Stats Cards - Liquid Glass with Dark Text */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="relative group">
              <div className="relative bg-transparent backdrop-blur-xl rounded-2xl border border-white/80 shadow-xl p-5 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-3">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${getColorStyles(stat.color)} shadow-lg`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  {/* <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {stat.trend === "up" ? (
                      <FiArrowUp size={12} />
                    ) : (
                      <FiArrowDown size={12} />
                    )}
                    {stat.change}
                  </div> */}
                </div>

                <h3 className="text-gray-500 text-sm font-medium">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-xs mt-2">{stat.description}</p>

                {/* Animated shine */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
