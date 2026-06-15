import React from "react";
import {
  FiUsers,
  FiDollarSign,
  FiBriefcase,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiEye,
  FiCalendar,
  FiMoreHorizontal,
} from "react-icons/fi";
import { MdOutlineCampaign, MdAnalytics } from "react-icons/md";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Clients",
      value: "248",
      change: "+12%",
      trend: "up",
      icon: FiUsers,
      color: "blue",
      description: "Active clients this month",
    },
    {
      title: "Revenue",
      value: "$124.8K",
      change: "+23%",
      trend: "up",
      icon: FiDollarSign,
      color: "green",
      description: "Total revenue earned",
    },
    {
      title: "Active Projects",
      value: "42",
      change: "-3%",
      trend: "down",
      icon: FiBriefcase,
      color: "purple",
      description: "Ongoing projects",
    },
    {
      title: "Growth Rate",
      value: "18.5%",
      change: "+5%",
      trend: "up",
      icon: FiTrendingUp,
      color: "orange",
      description: "Month over month",
    },
  ];

  const recentActivities = [
    {
      user: "Sarah Chen",
      action: "completed project",
      project: "Brand Identity Design",
      time: "2 hours ago",
      avatar: "SC",
    },
    {
      user: "Mike Ross",
      action: "sent invoice",
      project: "Website Development",
      time: "5 hours ago",
      avatar: "MR",
    },
    {
      user: "Emma Watson",
      action: "signed contract",
      project: "Social Media Campaign",
      time: "1 day ago",
      avatar: "EW",
    },
    {
      user: "David Kim",
      action: "started new project",
      project: "Mobile App Design",
      time: "2 days ago",
      avatar: "DK",
    },
  ];

  const topProjects = [
    {
      name: "Nike Campaign",
      progress: 85,
      budget: "$45K",
      team: 6,
      status: "Active",
    },
    {
      name: "Apple Redesign",
      progress: 62,
      budget: "$78K",
      team: 8,
      status: "In Progress",
    },
    {
      name: "Google Ads",
      progress: 93,
      budget: "$32K",
      team: 4,
      status: "Active",
    },
    {
      name: "Spotify Launch",
      progress: 45,
      budget: "$56K",
      team: 5,
      status: "Pending",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's your agency overview
        </p>
      </div>

      {/* Stats Cards - Liquid Glass with Dark Text */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {stat.trend === "up" ? (
                      <FiArrowUp size={12} />
                    ) : (
                      <FiArrowDown size={12} />
                    )}
                    {stat.change}
                  </div>
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

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Performance */}
        <div className="lg:col-span-2 bg-transparent backdrop-blur-xl rounded-2xl border border-white/80 shadow-xl p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Campaign Performance
              </h2>
              <p className="text-gray-500 text-sm">Weekly campaign metrics</p>
            </div>
            <select className="bg-white/80 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="space-y-4">
            {[
              {
                name: "Social Media Ads",
                value: 75,
                color: "blue",
                spend: "$12.4K",
                reach: "245K",
              },
              {
                name: "Email Marketing",
                value: 60,
                color: "green",
                spend: "$5.2K",
                reach: "89K",
              },
              {
                name: "SEO Campaign",
                value: 85,
                color: "purple",
                spend: "$8.7K",
                reach: "156K",
              },
              {
                name: "PPC Advertising",
                value: 45,
                color: "orange",
                spend: "$15.3K",
                reach: "312K",
              },
            ].map((campaign, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">
                    {campaign.name}
                  </span>
                  <span className="text-gray-600">{campaign.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r from-${campaign.color}-500 to-${campaign.color}-600 transition-all duration-500`}
                    style={{ width: `${campaign.value}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Spend: {campaign.spend}</span>
                  <span>Reach: {campaign.reach}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-transparent backdrop-blur-xl rounded-2xl border border-white/80 shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Activity
            </h2>
            <button className="text-blue-600 text-sm hover:text-blue-700">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-medium">
                    {activity.avatar}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">
                      {activity.user}
                    </span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.project}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {activity.time}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <FiMoreHorizontal size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Projects Table */}
      <div className="bg-transparent backdrop-blur-xl rounded-2xl border border-white/80 shadow-xl p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Top Projects
            </h2>
            <p className="text-gray-500 text-sm">
              Most active projects this month
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30">
            <FiBriefcase size={16} />
            New Project
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-gray-500 text-sm">
                <th className="pb-3 font-medium">Project Name</th>
                <th className="pb-3 font-medium">Progress</th>
                <th className="pb-3 font-medium">Budget</th>
                <th className="pb-3 font-medium">Team</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {topProjects.map((project, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="py-3">
                    <span className="font-medium text-gray-800">
                      {project.name}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-700">{project.budget}</td>
                  <td className="py-3">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                      {project.team > 3 && (
                        <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                          +{project.team - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : project.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <FiEye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
