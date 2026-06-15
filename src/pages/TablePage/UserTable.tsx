// pages/UserTable.tsx
import React, { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { FiEye, FiEdit, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import Table from '../../components/Table';

interface User {
  id: number;
  fullName: string;
  employeeId: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  department: string;
  status: string;
  role: string;
}

const UserTable = () => {
  const data: User[] = useMemo(
    () => [
      {
        id: 1,
        fullName: 'Alex Johnson',
        employeeId: 'EMP-001',
        email: 'alex@company.com',
        phoneNumber: '+1 234 567 8901',
        jobTitle: 'Senior Developer',
        department: 'Engineering',
        status: 'Active',
        role: 'Admin',
      },
      {
        id: 2,
        fullName: 'Sarah Chen',
        employeeId: 'EMP-002',
        email: 'sarah@company.com',
        phoneNumber: '+1 234 567 8902',
        jobTitle: 'Product Manager',
        department: 'Product',
        status: 'Active',
        role: 'Manager',
      },
      {
        id: 3,
        fullName: 'Mike Ross',
        employeeId: 'EMP-003',
        email: 'mike@company.com',
        phoneNumber: '+1 234 567 8903',
        jobTitle: 'UI/UX Designer',
        department: 'Design',
        status: 'Inactive',
        role: 'Employee',
      },
      {
        id: 4,
        fullName: 'Emma Watson',
        employeeId: 'EMP-004',
        email: 'emma@company.com',
        phoneNumber: '+1 234 567 8904',
        jobTitle: 'Marketing Lead',
        department: 'Marketing',
        status: 'Active',
        role: 'Manager',
      },
      {
        id: 5,
        fullName: 'David Kim',
        employeeId: 'EMP-005',
        email: 'david@company.com',
        phoneNumber: '+1 234 567 8905',
        jobTitle: 'Sales Executive',
        department: 'Sales',
        status: 'Active',
        role: 'Employee',
      },
    ],
    []
  );

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: 'fullName',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            Full Name
            {column.getIsSorted() === 'asc' ? <FiArrowUp size={14} /> : column.getIsSorted() === 'desc' ? <FiArrowDown size={14} /> : null}
          </button>
        ),
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-medium">
                {info.getValue<string>().charAt(0)}
                {info.getValue<string>().split(' ')[1]?.charAt(0) || ''}
              </span>
            </div>
            <span className="font-medium text-gray-800">{info.getValue<string>()}</span>
          </div>
        ),
      },
      {
        accessorKey: 'employeeId',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            Employee ID
            {column.getIsSorted() === 'asc' ? <FiArrowUp size={14} /> : column.getIsSorted() === 'desc' ? <FiArrowDown size={14} /> : null}
          </button>
        ),
        cell: (info) => <span className="text-gray-600 font-mono text-sm">{info.getValue<string>()}</span>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => <span className="text-gray-600 text-sm">{info.getValue<string>()}</span>,
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone',
        cell: (info) => <span className="text-gray-600 text-sm">{info.getValue<string>()}</span>,
      },
      {
        accessorKey: 'jobTitle',
        header: 'Job Title',
        cell: (info) => <span className="text-gray-700 text-sm">{info.getValue<string>()}</span>,
      },
      {
        accessorKey: 'department',
        header: 'Department',
        cell: (info) => (
          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue<string>();
          const statusStyles = {
            Active: 'bg-green-100 text-green-700',
            Inactive: 'bg-gray-100 text-gray-700',
          };
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: (info) => (
          <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: () => (
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
              <FiEye size={16} />
            </button>
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all">
              <FiEdit size={16} />
            </button>
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all">
              <FiTrash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600 mt-1">Manage and view all users in your organization</p>
      </div>

      <div className="liquid-glass rounded-2xl p-6">
        <Table data={data} columns={columns} showPagination={true} pageSize={10} />
      </div>
    </div>
  );
};

export default UserTable;