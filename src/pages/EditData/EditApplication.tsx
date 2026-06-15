import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiCalendar,
  FiUpload,
  FiSave,
  FiX,
  FiLoader,
  FiTrash2,
  FiFile,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiGlobe,
  FiClock,
  FiEye,
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../services/axios";

// Types
interface ApplicationData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  yearsOfExperience: string;
  portfolioUrl: string | null;
  linkedInProfile: string | null;
  githubProfile: string | null;
  coverLetter: string | null;
  resumeUrl: string;
  createdAt: string;
  updatedAt: string;
}

const EditApplication: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<Partial<ApplicationData>>({
    fullName: "",
    email: "",
    phoneNumber: "",
    position: "",
    yearsOfExperience: "",
    portfolioUrl: "",
    linkedInProfile: "",
    githubProfile: "",
    coverLetter: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>("");
  const [currentResumeUrl, setCurrentResumeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const positions: string[] = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "UI/UX Designer",
    "Project Manager",
    "Quality Assurance Engineer",
    "DevOps Engineer",
    "Technical Writer",
  ];

  const experienceLevels: string[] = [
    "Fresher (0-1 years)",
    "Junior (1-3 years)",
    "Mid-Level (3-5 years)",
    "Senior (5-8 years)",
    "Lead (8+ years)",
  ];

  // Fetch application data on load
  useEffect(() => {
    if (!id) {
      toast.error("Invalid application ID");
      navigate("/applications");
      return;
    }
    fetchApplicationData();
  }, [id]);

  const fetchApplicationData = async (): Promise<void> => {
    setIsFetching(true);
    try {
      const response = await axiosInstance.get(`/application/${id}`);

      if (response.data.success) {
        const data: ApplicationData = response.data.data;
        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          position: data.position || "",
          yearsOfExperience: data.yearsOfExperience || "",
          portfolioUrl: data.portfolioUrl || "",
          linkedInProfile: data.linkedInProfile || "",
          githubProfile: data.githubProfile || "",
          coverLetter: data.coverLetter || "",
        });
        setCurrentResumeUrl(data.resumeUrl);
      } else {
        toast.error("Failed to fetch application data");
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      toast.error("Failed to load application data");
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

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, DOC, or DOCX files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setResumeFile(file);
      setResumeFileName(file.name);
      toast.success(`Resume "${file.name}" selected`);
    }
  };

  const handleDownloadResume = (): void => {
    if (currentResumeUrl) {
      window.open(currentResumeUrl, "_blank");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(0);

    const toastId = toast.loading("Updating application...");

    try {
      setUploadProgress(30);

      // Update application data
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        position: formData.position,
        yearsOfExperience: formData.yearsOfExperience,
        portfolioUrl: formData.portfolioUrl || null,
        linkedInProfile: formData.linkedInProfile || null,
        githubProfile: formData.githubProfile || null,
        coverLetter: formData.coverLetter || null,
      };

      const response = await axios.put(
        `http://localhost:4000/api/v1/application/${id}`,
        updateData,
      );

      setUploadProgress(60);

      // Upload new resume if selected
      if (resumeFile) {
        toast.loading("Uploading new resume...", { id: toastId });
        const resumeFormData = new FormData();
        resumeFormData.append("resume", resumeFile);

        await axios.post(
          `http://localhost:4000/api/v1/application/${id}/resume`,
          resumeFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        toast.success("Resume updated!", { id: toastId });
      }

      setUploadProgress(100);
      toast.success("Application updated successfully!", {
        id: toastId,
        duration: 5000,
      });

      setTimeout(() => {
        navigate("/applications");
      }, 2000);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update application",
        { id: toastId, duration: 5000 },
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDeleteClick = (): void => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    setShowDeleteModal(false);
    const toastId = toast.loading("Deleting application...");
    try {
      await axios.delete(`http://localhost:4000/api/v1/application/${id}`);
      toast.success("Application deleted successfully!", { id: toastId });
      setTimeout(() => {
        navigate("/applications");
      }, 1000);
    } catch (error) {
      toast.error("Failed to delete application", { id: toastId });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading application data...</p>
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

      {/* Delete Confirmation Modal */}
      {/* {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Delete Application
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this application from{" "}
                <strong>{formData.fullName}</strong>? This action cannot be undone.
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
      )} */}

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
                  {uploadProgress < 60
                    ? "Updating application info..."
                    : "Uploading resume..."}
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
          <h1 className="text-3xl font-bold text-gray-800">Edit Application</h1>
          <p className="text-gray-600 mt-1">
            Update job application information
          </p>
        </div>
        {/* <button
          type="button"
          onClick={handleDeleteClick}
          className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
        >
          <FiTrash2 size={18} />
          Delete
        </button> */}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
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
                      required
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiBriefcase className="text-blue-600" />
                Professional Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                  </label>
                  <div className="relative">
                    <FiBriefcase
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                      placeholder="Enter position"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience *
                  </label>
                  <div className="relative">
                    <FiClock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                      placeholder="Enter years of experience"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Links & Resume */}
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiGlobe className="text-blue-600" />
                Links & Resume
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portfolio URL
                  </label>
                  <div className="relative">
                    <FiGlobe
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl || ""}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <FiLinkedin
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="url"
                      name="linkedInProfile"
                      value={formData.linkedInProfile || ""}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub Profile
                  </label>
                  <div className="relative">
                    <FiGithub
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="url"
                      name="githubProfile"
                      value={formData.githubProfile || ""}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume/CV
                  </label>

                  {currentResumeUrl && !resumeFile && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FiFile className="text-blue-600" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              Current Resume
                            </p>
                            <p className="text-xs text-gray-500">
                              {currentResumeUrl.split("/").pop() || "Resume"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleDownloadResume}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View resume/CV"
                        >
                          <FiEye size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div> */}

                  {/* {resumeFileName && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ New resume: {resumeFileName} ready to upload
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Max file size: 5MB. Supported: PDF, DOC, DOCX
                  </p> */}
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiFile className="text-blue-600" />
                Cover Letter
              </h3>

              <div>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter || ""}
                  onChange={handleChange}
                  rows={6}
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-gray-800"
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Application Metadata */}
        {/* <div className="liquid-glass rounded-2xl p-6">
          <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiCalendar className="text-blue-600" />
            Application Metadata
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Created At
              </label>
              <p className="text-gray-800 mt-1">
                {formatDate(formData.createdAt || "")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Last Updated
              </label>
              <p className="text-gray-800 mt-1">
                {formatDate(formData.updatedAt || "")}
              </p>
            </div>
          </div>
        </div> */}

        {/* Form Actions */}
        {/* <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/applications")}
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
                Update Application
              </>
            )}
          </button>
        </div> */}
      </form>
    </div>
  );
};

export default EditApplication;
