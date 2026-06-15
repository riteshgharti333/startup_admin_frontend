import React, { useMemo, useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  FiArrowUp,
  FiArrowDown,
  FiUser,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiLoader,
  FiAlertCircle,
  FiCalendar,
} from "react-icons/fi";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../services/axios";

// Update the interface to match your API response
interface Application {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  yearsOfExperience: string;
  portfolioUrl: string | null;
  linkedInProfile: string | null;
  githubProfile: string | null;
  resumeUrl: string;
  createdAt: string;
  updatedAt: string;
}

const ApplicationTable = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch applications from API
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/application");

      if (response.data.success) {
        setApplications(response.data.data);
      } else {
        setError("Failed to fetch applications");
      }
    } catch (err: any) {
      console.error("Error fetching applications:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch applications. Please check if backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle row click - receives the entire application object
  const handleRowClick = (application: Application) => {
    // ✅ Fix: Accept Application object, not string
    navigate(`/application/${application.id}`);
  };

  const columns: ColumnDef<Application>[] = useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiUser size={14} />
            Full Name
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div>
              <p className="font-semibold text-gray-800">
                {info.getValue<string>()}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiMail size={14} />
            Email
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => (
          <span className="text-gray-600 text-sm truncate block max-w-[200px]">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "phoneNumber",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiPhone size={14} />
            Phone
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => (
          <span className="text-gray-600 text-sm font-mono whitespace-nowrap">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "position",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiBriefcase size={14} />
            Position
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => (
          <span className="text-gray-700 text-sm">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "yearsOfExperience",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            Experience
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => (
          <span className="inline-flex px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiCalendar size={14} />
            Applied On
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => {
          const date = new Date(info.getValue<string>());
          return (
            <span className="text-gray-600 text-sm">
              {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </span>
          );
        },
      },
    ],
    [],
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FiLoader className="animate-spin text-blue-600" size={40} />
        <p className="mt-4 text-gray-600">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FiAlertCircle className="text-red-500" size={40} />
        <p className="mt-4 text-red-600">{error}</p>
        <button
          onClick={fetchApplications}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-3 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Applications
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({applications.length} total)
            </span>
          </h1>
          <p className="text-gray-500 mt-1">Manage job applications</p>
        </div>
      </div>

      <div className="liquid-glass rounded-2xl p-6">
        <Table
          data={applications}
          columns={columns}
          showPagination={true}
          pageSize={10}
          onRowClick={handleRowClick}
          getRowId={(row) => row.id}
        />
      </div>
    </div>
  );
};

export default ApplicationTable;
