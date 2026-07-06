import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiCalendar,
  FiSave,
  FiX,
  FiLoader,
  FiTrash2,
  FiFile,
  FiEye,
  FiGithub,
  FiLinkedin,
  FiGlobe,
  FiClock,
  FiEdit2,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import {
  useApplication,
  useDeleteApplication,
} from "../../features/applications/hooks/applicationHook";
import DeleteModal from "../../components/DeleteModal";
import Loader from "../../components/Loader";
import type { Application } from "../../features/applications/types/application.types";

const EditApplication = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<Partial<Application>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch application
  const { data: application, isLoading, isError } = useApplication(id || "");

  // Delete mutation
  const deleteMutation = useDeleteApplication();

  // Set form data when application loads
  useEffect(() => {
    if (application) {
      setFormData(application);
    }
  }, [application]);

  // Redirect if no ID
  useEffect(() => {
    if (!id) {
      toast.error("Invalid application ID");
      navigate("/application");
    }
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && application) {
      // Reset form data if canceling edit
      setFormData(application);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Add update mutation when backend endpoint is ready
    toast.success("Application updated successfully!");
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!id) return;

    setShowDeleteModal(false);
    navigate("/application");

    // Then delete (component will unmount, no refetch issues)
    deleteMutation.mutate(id);
  };

  const handleDownloadResume = () => {
    if (formData.resumeUrl) {
      window.open(formData.resumeUrl, "_blank");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) return <Loader fullScreen text="Loading application..." />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-red-600 text-lg">Failed to load application</p>
        <button
          onClick={() => navigate("/application")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          title="Delete Application"
          message={`Are you sure you want to delete this application from ${formData.fullName}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={deleteMutation.isPending}
        />
      )}

      {/* Header */}
      <div className="mb-2 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Application Details
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Edit application information"
              : "View application information"}
          </p>
        </div>
        <div className="flex gap-3">
          {/* Edit Button */}
          <button
            type="button"
            onClick={handleEditToggle}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
              isEditing
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
            }`}
          >
            {isEditing ? (
              <>
                <FiX size={18} />
                Cancel
              </>
            ) : (
              <>
                <FiEdit2 size={18} />
                Edit
              </>
            )}
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
          >
            <FiTrash2 size={18} />
            Delete
          </button>
        </div>
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
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 cursor-not-allowed"
                      }`}
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 cursor-not-allowed"
                      }`}
                      placeholder="email@example.com"
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
                      value={formData.phoneNumber || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 cursor-not-allowed"
                      }`}
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
                    Position
                  </label>
                  <div className="relative">
                    <FiBriefcase
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="position"
                      value={formData.position || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 cursor-not-allowed"
                      }`}
                      placeholder="Enter position"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <div className="relative">
                    <FiClock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 cursor-not-allowed"
                      }`}
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
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 cursor-not-allowed"
                      }`}
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
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 cursor-not-allowed"
                      }`}
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
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 cursor-not-allowed"
                      }`}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                {/* Resume */}
                {formData.resumeUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resume/CV
                    </label>
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FiFile className="text-blue-600" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              Resume Document
                            </p>
                            <p className="text-xs text-gray-500">
                              {formData.resumeUrl.split("/").pop() ||
                                "resume.pdf"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleDownloadResume}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View resume"
                        >
                          <FiEye size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all resize-none text-gray-800 ${
                    isEditing
                      ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button - Only visible when editing */}
        {isEditing && (
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleEditToggle}
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
            >
              <FiX size={18} />
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              <FiSave size={18} />
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditApplication;
