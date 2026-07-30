import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  FiArrowUp,
  FiArrowDown,
  FiMail,
  FiLoader,
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import Table from "../../components/Table";
import { useSubscribers } from "../../service/hooks/useSubscriber";
import type { Subscriber } from "../../service/types";

const SubscriberTable = () => {
  const {
    data: subscribersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useSubscribers();

  // Extract subscribers from the response
  const subscribers = subscribersData?.data || [];
  const pagination = subscribersData?.pagination;

  const columns: ColumnDef<Subscriber>[] = useMemo(
    () => [
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold text-sm">
                {info.getValue<string>()?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {info.getValue<string>()}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "isActive",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiCheckCircle size={14} />
            Status
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => {
          const isActive = info.getValue<boolean>();
          return (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  isActive
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200"
                }`}
              >
                {isActive ? (
                  <>
                    <FiCheckCircle size={12} />
                    Active
                  </>
                ) : (
                  <>
                    <FiXCircle size={12} />
                    Inactive
                  </>
                )}
              </span>
            </div>
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
            Subscribed On
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
        <p className="mt-4 text-gray-600">Loading subscribers...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FiAlertCircle className="text-red-500" size={40} />
        <p className="mt-4 text-red-600">
          {(error as any)?.message || "Failed to fetch subscribers"}
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
            Subscribers
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({subscribers.length} total)
            </span>
          </h1>
          <p className="text-gray-500 mt-1">Manage newsletter subscribers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
            <FiCheckCircle className="text-blue-600" size={18} />
            <span className="text-sm font-medium text-gray-700">
              Active:{" "}
              <span className="text-blue-600">
                {subscribers.filter((s: Subscriber) => s.isActive).length}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
            <FiXCircle className="text-gray-500" size={18} />
            <span className="text-sm font-medium text-gray-700">
              Inactive:{" "}
              <span className="text-gray-600">
                {subscribers.filter((s: Subscriber) => !s.isActive).length}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="liquid-glass rounded-2xl p-6">
        <Table
          data={subscribers}
          columns={columns}
          showPagination={true}
          pageSize={10}
          getRowId={(row) => row.id}
        />
        {pagination?.hasMore && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {subscribers.length} subscribers
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriberTable;
