import { useMemo } from "react";
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
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { useLeads } from "../../service/hooks/useLead";
import type { Lead } from "../../service/types";

const LeadTable = () => {
  const navigate = useNavigate();
  const { data: leadsData, isLoading, isError, error, refetch } = useLeads();

  // Extract leads from the response
  const leads = leadsData || [];

  // Handle row click - receives the entire lead object
  const handleRowClick = (lead: Lead) => {
    navigate(`/lead/${lead.id}`);
  };

  const columns: ColumnDef<Lead>[] = useMemo(
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
                {info.getValue<string>() || "N/A"}
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
            {info.getValue<string>() || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "phone",
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
            {info.getValue<string>() || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "company",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiUsers size={14} />
            Company
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => (
          <span className="text-gray-700 text-sm">
            {info.getValue<string>() || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "service",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiBriefcase size={14} />
            Service
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => (
          <span className="inline-flex px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
            {info.getValue<string>() || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "budget",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiDollarSign size={14} />
            Budget
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => {
          const budget = info.getValue<string>();
          return (
            <span className="text-gray-700 text-sm font-medium">
              {budget ? `$${budget}` : "N/A"}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiCalendar size={14} />
            Created On
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FiLoader className="animate-spin text-blue-600" size={40} />
        <p className="mt-4 text-gray-600">Loading leads...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FiAlertCircle className="text-red-500" size={40} />
        <p className="mt-4 text-red-600">
          {(error as any)?.message || "Failed to fetch leads"}
        </p>
        <button
          onClick={() => refetch()}
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
            Client Leads
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({leads.length} total)
            </span>
          </h1>
          <p className="text-gray-500 mt-1">
            Manage client leads and inquiries
          </p>
        </div>
      </div>

      <div className="liquid-glass rounded-2xl p-6">
        <Table
          data={leads}
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

export default LeadTable;
