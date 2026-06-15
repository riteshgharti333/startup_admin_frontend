import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiShield,
  FiMapPin,
  FiUpload,
  FiSave,
  FiX,
  FiHash,
  FiTag,
  FiLoader,
  FiTrash2,
  FiFile,
  FiDownload,
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

// Types
interface EmployeeFormData {
  fullName: string;
  employeeId: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  department: string;
  employmentType: string;
  dateOfJoining: string;
  salary: string;
  status: string;
  role: string;
  address: string;
}

interface EmployeeResponse {
  id: number;
  fullName: string;
  employeeId: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  department: string;
  employmentType: string;
  dateOfJoining: string | null;
  salary: number | null;
  status: string;
  role: string;
  address: string | null;
  employee_image_url: string | null;
  employee_document_url: string | null;
  created_at: string;
  updated_at: string | null;
}

const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || "0");

  const [formData, setFormData] = useState<EmployeeFormData>({
    fullName: "",
    employeeId: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    department: "",
    employmentType: "Full-time",
    dateOfJoining: "",
    salary: "",
    status: "Active",
    role: "Employee",
    address: "",
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null,
  );
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState<string>("");
  const [currentDocumentUrl, setCurrentDocumentUrl] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const departments: string[] = [
    "Human Resources",
    "Engineering",
    "Marketing",
    "Sales",
    "Finance",
    "Operations",
    "Design",
  ];

  const employmentTypes: string[] = [
    "Full-time",
    "Part-time",
    "Contract",
    "Intern",
    "Temporary",
  ];
  const statuses: string[] = ["Active", "Inactive", "On Leave", "Terminated"];
  const roles: string[] = [
    "Admin",
    "Manager",
    "Employee",
    "Supervisor",
    "Director",
  ];

  // Fetch employee data on load
  useEffect(() => {
    if (!userId || userId === 0) {
      toast.error("Invalid employee ID");
      navigate("/employees");
      return;
    }
    fetchEmployeeData();
  }, [userId]);

  const fetchEmployeeData = async (): Promise<void> => {
    setIsFetching(true);
    try {
      const response = await fetch(`http://localhost:8000/employees/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch employee");

      const data: EmployeeResponse = await response.json();

      setFormData({
        fullName: data.fullName || "",
        employeeId: data.employeeId || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        jobTitle: data.jobTitle || "",
        department: data.department || "",
        employmentType: data.employmentType || "Full-time",
        dateOfJoining: data.dateOfJoining
          ? data.dateOfJoining.split("T")[0]
          : "",
        salary: data.salary?.toString() || "",
        status: data.status || "Active",
        role: data.role || "Employee",
        address: data.address || "",
      });

      setCurrentImageUrl(data.employee_image_url);
      setCurrentDocumentUrl(data.employee_document_url);
    } catch (error) {
      console.error("Error fetching employee:", error);
      toast.error("Failed to load employee data");
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Document size should be less than 10MB");
        return;
      }
      setDocument(file);
      setDocumentName(file.name);
      toast.success(`Document "${file.name}" selected`);
    }
  };

  const uploadToCloudinary = async (
    file: File,
    type: "image" | "document",
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);

    const endpoint =
      type === "image"
        ? `http://localhost:8000/employees/${userId}/image`
        : `http://localhost:8000/employees/${userId}/document`;

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `Upload failed`);
    }

    return response.json();
  };

  const updateEmployee = async (
    employeeData: any,
  ): Promise<EmployeeResponse> => {
    const response = await fetch(`http://localhost:8000/employees/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to update employee");
    }

    return response.json();
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(0);

    const toastId = toast.loading("Updating employee profile...");

    try {
      setUploadProgress(30);
      toast.loading("Updating employee information...", { id: toastId });

      // FIX 2: Handle null values properly - convert null to undefined for the API
      const employeeData = {
        fullName: formData.fullName,
        employeeId: formData.employeeId,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        jobTitle: formData.jobTitle,
        department: formData.department,
        employmentType: formData.employmentType,
        dateOfJoining: formData.dateOfJoining || undefined, // null → undefined
        salary: formData.salary ? parseFloat(formData.salary) : undefined, // null → undefined
        status: formData.status,
        role: formData.role,
        address: formData.address,
      };

      const updatedEmployee = await updateEmployee(employeeData);

      setUploadProgress(60);
      if (profilePhoto) {
        toast.loading("Uploading new profile photo...", { id: toastId });
        await uploadToCloudinary(profilePhoto, "image");
        toast.success("Profile photo updated!", { id: toastId });
      }

      setUploadProgress(90);
      if (document) {
        toast.loading("Uploading new document...", { id: toastId });
        await uploadToCloudinary(document, "document");
        toast.success("Document updated!", { id: toastId });
      }

      setUploadProgress(100);
      toast.success(
        `Employee ${updatedEmployee.fullName} updated successfully!`,
        {
          id: toastId,
          duration: 5000,
        },
      );

      setTimeout(() => {
        navigate("/employees");
      }, 2000);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update employee",
        {
          id: toastId,
          duration: 5000,
        },
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // FIX 1: Better delete confirmation modal
  const handleDeleteClick = (): void => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    setShowDeleteModal(false);
    const toastId = toast.loading("Deleting employee...");
    try {
      const response = await fetch(
        `http://localhost:8000/employees/${userId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Employee deleted successfully!", { id: toastId });
      setTimeout(() => {
        navigate("/employees");
      }, 1000);
    } catch (error) {
      toast.error("Failed to delete employee", { id: toastId });
    }
  };

  const handleDownloadDocument = (): void => {
    if (currentDocumentUrl) {
      window.open(currentDocumentUrl, "_blank");
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: "#363636", color: "#fff" },
          success: {
            duration: 3000,
            iconTheme: { primary: "#10B981", secondary: "#fff" },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: "#EF4444", secondary: "#fff" },
          },
        }}
      />

      {/* Delete Confirmation Modal - FIX 1 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Delete Employee
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this employee? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {isLoading && uploadProgress > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 px-4 py-2">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiLoader className="animate-spin text-blue-600" size={20} />
                <span className="text-sm font-medium text-gray-700">
                  {uploadProgress < 30 && "Updating employee info..."}
                  {uploadProgress >= 30 &&
                    uploadProgress < 60 &&
                    "Uploading profile photo..."}
                  {uploadProgress >= 60 &&
                    uploadProgress < 90 &&
                    "Uploading document..."}
                  {uploadProgress >= 90 && "Finalizing..."}
                </span>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {uploadProgress}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-2 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Edit User</h1>
          <p className="text-gray-600 mt-1">
            Update employee profile information
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleDeleteClick}
            className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
          >
            <FiTrash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo Section */}
        <div className="liquid-glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiUser className="text-blue-600" />
            Profile Information
          </h2>

          <div className="flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg overflow-hidden">
                {profilePhotoPreview ? (
                  <img
                    src={profilePhotoPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : currentImageUrl ? (
                  <img
                    src={currentImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser size={48} className="text-white" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                <FiUpload size={16} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Click to change profile photo
            </p>
            {profilePhoto && (
              <p className="text-xs text-green-600 mt-1">
                ✓ New photo selected
              </p>
            )}
          </div>
        </div>

        {/* Two Column Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiUser className="text-blue-600" />
                Personal Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FiUser
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID *
                  </label>
                  <div className="relative">
                    <FiHash
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      placeholder="EMP-001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <FiMail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      placeholder="employee@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiBriefcase className="text-blue-600" />
                Employment Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <div className="relative">
                    <FiTag
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      placeholder="Senior Developer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                  >
                    {employmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Joining
                  </label>
                  <div className="relative">
                    <FiCalendar
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="date"
                      name="dateOfJoining"
                      value={formData.dateOfJoining}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Compensation & Status */}
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiDollarSign className="text-blue-600" />
                Compensation & Status
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary
                  </label>
                  <div className="relative">
                    <FiDollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      placeholder="$50,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="relative">
                    <FiShield
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Address & Document Upload */}
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiMapPin className="text-blue-600" />
                Address & Documents
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address
                  </label>
                  <div className="relative">
                    <FiMapPin
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-gray-800"
                      placeholder="Street Address, City, State, ZIP Code, Country"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Document (ID, Resume, Contract)
                  </label>

                  {/* FIX 3: Show current document with download option */}
                  {currentDocumentUrl && !document && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FiFile className="text-blue-600" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              Current Document
                            </p>
                            <p className="text-xs text-gray-500">
                              {currentDocumentUrl.split("/").pop() ||
                                "Document"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleDownloadDocument}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Download document"
                        >
                          <FiDownload size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      onChange={handleDocumentUpload}
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  {documentName && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ New document: {documentName} ready to upload
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Max file size: 10MB. Supported: PDF, DOC, JPG, PNG
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/employees")}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            <FiX size={18} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin" size={18} />
                Updating...
              </>
            ) : (
              <>
                <FiSave size={18} />
                Update User
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
