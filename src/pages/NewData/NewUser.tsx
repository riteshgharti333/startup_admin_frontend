import React, { useState } from "react";
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
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";

const NewUser = () => {
  const [formData, setFormData] = useState({
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
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (jpg, png, etc.)");
        return;
      }
      
      // Validate file size (max 5MB)
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

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Document size should be less than 10MB");
        return;
      }
      
      setDocument(file);
      setDocumentName(file.name);
      toast.success(`Document "${file.name}" selected`);
    }
  };

 const uploadToCloudinary = async (file: File, employeeId: number, type: "image" | "document") => {
  const formData = new FormData();
  formData.append("file", file);
  
  const endpoint = type === "image" 
    ? `http://localhost:8000/employees/${employeeId}/image`
    : `http://localhost:8000/employees/${employeeId}/document`;
  
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - let browser set it with boundary
    });
    
    const result = await response.json();
    console.log("Upload response:", result); // Log the response
    
    if (!response.ok) {
      throw new Error(result.detail || result.message || "Upload failed");
    }
    
    return result;
  } catch (error) {
    console.error(`${type} upload error:`, error);
    throw error;
  }
};

  const createEmployee = async (employeeData: any) => {
    const response = await fetch("http://localhost:8000/employees/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create employee");
    }
    
    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(0);
    
    const toastId = toast.loading("Creating employee profile...");
    
    try {
      // Step 1: Create employee
      setUploadProgress(20);
      toast.loading("Creating employee record...", { id: toastId });
      
      const employeeData = {
        fullName: formData.fullName,
        employeeId: formData.employeeId,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        jobTitle: formData.jobTitle,
        department: formData.department,
        employmentType: formData.employmentType,
        dateOfJoining: formData.dateOfJoining || null,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        status: formData.status,
        role: formData.role,
        address: formData.address,
      };
      
      const employee = await createEmployee(employeeData);
      
      // Step 2: Upload profile photo if exists
      setUploadProgress(50);
      if (profilePhoto) {
        toast.loading("Uploading profile photo...", { id: toastId });
        const imageResult = await uploadToCloudinary(profilePhoto, employee.id, "image");
        if (imageResult.success) {
          toast.success("Profile photo uploaded!", { id: toastId });
        }
      }
      
      // Step 3: Upload document if exists
      setUploadProgress(80);
      if (document) {
        toast.loading("Uploading document...", { id: toastId });
        const docResult = await uploadToCloudinary(document, employee.id, "document");
        if (docResult.success) {
          toast.success("Document uploaded!", { id: toastId });
        }
      }
      
      // Step 4: Complete
      setUploadProgress(100);
      toast.success(
        `Employee ${employee.fullName} created successfully!`,
        { id: toastId, duration: 5000 }
      );
      
      // Reset form
      setTimeout(() => {
        resetForm();
      }, 2000);
      
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(
        error.message || "Failed to create employee. Please try again.",
        { id: toastId, duration: 5000 }
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };
  
  const resetForm = () => {
    setFormData({
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
    setProfilePhoto(null);
    setProfilePhotoPreview(null);
    setDocument(null);
    setDocumentName("");
  };

  const departments = [
    "Human Resources",
    "Engineering",
    "Marketing",
    "Sales",
    "Finance",
    "Operations",
    "Design",
  ];
  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Intern",
    "Temporary",
  ];
  const statuses = ["Active", "Inactive", "On Leave", "Terminated"];
  const roles = ["Admin", "Manager", "Employee", "Supervisor", "Director"];

  return (
    <div className="space-y-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
      
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-800">Add New User</h1>
        <p className="text-gray-600 mt-1">
          Create a new employee profile with all necessary information
        </p>
      </div>

      {/* Progress Bar */}
      {isLoading && uploadProgress > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 px-4 py-2">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiLoader className="animate-spin text-blue-600" size={20} />
                <span className="text-sm font-medium text-gray-700">
                  {uploadProgress < 30 && "Creating employee record..."}
                  {uploadProgress >= 30 && uploadProgress < 60 && "Uploading profile photo..."}
                  {uploadProgress >= 60 && uploadProgress < 90 && "Uploading document..."}
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
              Click the upload button to add profile photo
            </p>
            {profilePhoto && (
              <p className="text-xs text-green-600 mt-1">
                ✓ {profilePhoto.name} selected
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
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Street Address, City, State, ZIP Code, Country"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Document (ID, Resume, Contract)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      onChange={handleDocumentUpload}
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  {documentName && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {documentName} ready for upload
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
            onClick={resetForm}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX size={18} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin" size={18} />
                Creating...
              </>
            ) : (
              <>
                <FiSave size={18} />
                Create User
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewUser;