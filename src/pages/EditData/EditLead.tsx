import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiSave,
  FiX,
  FiLoader,
  FiTrash2,
  FiDollarSign,
  FiUsers,
  FiEdit2,
  FiFileText,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import DeleteModal from "../../components/DeleteModal";
import Loader from "../../components/Loader";
import type { Lead, UpdateLeadDto } from "../../service/types";
import {
  useLead,
  useDeleteLead,
  useUpdateLead,
} from "../../service/hooks/useLead";
import { updateLeadSchema } from "../../utils/validation";
import BackButton from "../../components/BackButton";

const updateSchema = updateLeadSchema.shape.body;

type FormErrors = Partial<Record<string, string>>;

const EditLead = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { data: lead, isLoading, isError } = useLead(id || "");
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();

  useEffect(() => {
    if (lead) {
      setFormData(lead);
    }
  }, [lead]);

  useEffect(() => {
    if (!id) {
      toast.error("Invalid lead ID");
      navigate("/client-leads");
    }
  }, [id, navigate]);

  const validateField = (name: string, value: string) => {
    const fieldSchema =
      updateSchema.shape[name as keyof typeof updateSchema.shape];
    if (!fieldSchema) return;

    const result = fieldSchema.safeParse(value || undefined);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [name]: result.error.issues[0].message,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && lead) {
      setFormData(lead);
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    const updateData: UpdateLeadDto = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      company: formData.company || undefined,
      service: formData.service,
      budget: formData.budget || undefined,
      details: formData.details || undefined,
    };

    // Validate all fields using schema
    const result = updateSchema.safeParse(updateData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    updateMutation.mutate(
      { id, data: updateData },
      {
        onSuccess: () => {
          setIsEditing(false);
          setErrors({});
        },
      },
    );
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!id) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        navigate("/client-leads");
      },
    });
  };

  if (isLoading) return <Loader fullScreen text="Loading lead details..." />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-red-600 text-lg">Failed to load lead details</p>
        <button
          onClick={() => navigate("/client-leads")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showDeleteModal && (
        <DeleteModal
          title="Delete Lead"
          message={`Are you sure you want to delete this lead from ${formData.fullName}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={deleteMutation.isPending}
        />
      )}

      <div className="mb-2 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <BackButton />
          <div className="">
            <h1 className="text-3xl font-bold text-gray-800">Lead Details</h1>
          </div>
        </div>
        <div className="flex gap-3">
          {/* <button
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
          </button> */}

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiUser className="text-blue-600" />
                Personal Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
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
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none transition-all text-gray-800 ${
                        errors.fullName
                          ? "border-red-500 focus:ring-red-500"
                          : isEditing
                            ? "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border-gray-300 bg-gray-50 cursor-not-allowed"
                      }`}
                      placeholder="Enter full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName}
                    </p>
                  )}
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
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none transition-all text-gray-800 ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : isEditing
                            ? "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border-gray-300 bg-gray-50 cursor-not-allowed"
                      }`}
                      placeholder="email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
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
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none transition-all text-gray-800 ${
                        errors.phone
                          ? "border-red-500 focus:ring-red-500"
                          : isEditing
                            ? "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border-gray-300 bg-gray-50 cursor-not-allowed"
                      }`}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiBriefcase className="text-blue-600" />
                Professional Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <div className="relative">
                    <FiUsers
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="company"
                      value={formData.company || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none transition-all text-gray-800 ${
                        errors.company
                          ? "border-red-500 focus:ring-red-500"
                          : isEditing
                            ? "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border-gray-300 bg-gray-50 cursor-not-allowed"
                      }`}
                      placeholder="Company name"
                    />
                  </div>
                  {errors.company && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.company}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiBriefcase
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="service"
                      value={formData.service || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none transition-all text-gray-800 ${
                        errors.service
                          ? "border-red-500 focus:ring-red-500"
                          : isEditing
                            ? "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border-gray-300 bg-gray-50 cursor-not-allowed"
                      }`}
                      placeholder="Enter service (e.g., Web Development)"
                    />
                  </div>
                  {errors.service && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.service}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Range
                  </label>
                  <div className="relative">
                    <FiDollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none transition-all text-gray-800 ${
                        errors.budget
                          ? "border-red-500 focus:ring-red-500"
                          : isEditing
                            ? "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border-gray-300 bg-gray-50 cursor-not-allowed"
                      }`}
                      placeholder="$1,000 - $5,000"
                    />
                  </div>
                  {errors.budget && (
                    <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiFileText className="text-blue-600" />
                Additional Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes / Details
                </label>
                <textarea
                  name="details"
                  value={formData.details || ""}
                  onChange={handleChange}
                  rows={8}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all resize-none text-gray-800 ${
                    errors.details
                      ? "border-red-500 focus:ring-red-500"
                      : isEditing
                        ? "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        : "border-gray-300 bg-gray-50 cursor-not-allowed"
                  }`}
                  placeholder="Add any additional details about this lead..."
                />
                {errors.details && (
                  <p className="text-red-500 text-xs mt-1">{errors.details}</p>
                )}
              </div>
            </div>

            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4">
                Lead Information
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Lead ID</span>
                  <span className="text-gray-800 font-mono text-xs">
                    {formData.id || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-800">
                    {formData.createdAt
                      ? new Date(formData.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="text-gray-800">
                    {formData.updatedAt
                      ? new Date(formData.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

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
              disabled={updateMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? (
                <FiLoader className="animate-spin" size={18} />
              ) : (
                <FiSave size={18} />
              )}
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditLead;
