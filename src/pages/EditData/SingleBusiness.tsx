import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiSave,
  FiX,
  FiLoader,
  FiTrash2,
  FiStar,
  FiMessageSquare,
  FiMapPin,
  FiGlobe,
  FiTag,
  FiClock,
  FiEdit2,
  FiFileText,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiMessageCircle,
  FiHash,
  FiExternalLink,
  FiList,
} from "react-icons/fi";
import { MdBusiness } from "react-icons/md";
import { toast } from "react-hot-toast";
import DeleteModal from "../../components/DeleteModal";
import Loader from "../../components/Loader";
import BackButton from "../../components/BackButton";
import {
  useBusiness,
  useUpdateBusiness,
  useDeleteBusiness,
} from "../../service/hooks/useBusiness";
import type { Business, UpdateBusinessDto } from "../../service/types";

const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
] as const;

const EMAIL_STATUSES = [
  "NOT_SENT",
  "SENT",
  "OPENED",
  "CLICKED",
  "REPLIED",
  "BOUNCED",
] as const;

const WHATSAPP_STATUSES = [
  "NOT_SENT",
  "SENT",
  "DELIVERED",
  "READ",
  "REPLIED",
] as const;

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const formatDateTime = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const statusColor = (status: string): string => {
  switch (status) {
    case "NEW":
    case "NOT_SENT":
      return "bg-gray-100 text-gray-700";
    case "CONTACTED":
    case "SENT":
      return "bg-blue-50 text-blue-700";
    case "QUALIFIED":
    case "OPENED":
    case "DELIVERED":
      return "bg-indigo-50 text-indigo-700";
    case "PROPOSAL":
    case "CLICKED":
    case "READ":
      return "bg-amber-50 text-amber-700";
    case "NEGOTIATION":
    case "REPLIED":
      return "bg-purple-50 text-purple-700";
    case "WON":
      return "bg-emerald-50 text-emerald-700";
    case "LOST":
    case "BOUNCED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const SingleBusiness = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: business,
    isLoading,
    isError,
    error,
    refetch,
  } = useBusiness(id || "");

  const updateMutation = useUpdateBusiness();
  const deleteMutation = useDeleteBusiness();

  const [formData, setFormData] = useState<Partial<Business>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isSaving = updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  useEffect(() => {
    if (business) setFormData(business);
  }, [business]);

  useEffect(() => {
    if (!id) {
      toast.error("Invalid business ID");
      navigate("/business-lists");
    }
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value || null,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing((v) => !v);
    if (isEditing && business) {
      setFormData(business);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !formData.businessListId) return;

    const payload: UpdateBusinessDto = {
      businessName: formData.businessName || undefined,
      category: formData.category || undefined,
      phoneNumber: formData.phoneNumber || undefined,
      email: formData.email || undefined,
      website: formData.website || undefined,
      fullAddress: formData.fullAddress || undefined,
      city: formData.city || undefined,
      googleMapsUrl: formData.googleMapsUrl || undefined,
      contactPerson: formData.contactPerson || undefined,
      leadStatus: formData.leadStatus || undefined,
      notes: formData.notes || undefined,
      lastContactedAt: formData.lastContactedAt || undefined,
      nextFollowUpAt: formData.nextFollowUpAt || undefined,
      emailStatus: formData.emailStatus || undefined,
      lastEmailSentAt: formData.lastEmailSentAt || undefined,
      whatsappStatus: formData.whatsappStatus || undefined,
      lastWhatsAppSentAt: formData.lastWhatsAppSentAt || undefined,
      whatsappOptIn: formData.whatsappOptIn,
    };

    updateMutation.mutate(
      {
        id,
        businessListId: formData.businessListId,
        data: payload,
      },
      {
        onSuccess: () => {
          toast.success("Business updated successfully!");
          setIsEditing(false);
        },
        onError: () => toast.error("Failed to update business"),
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!id || !business?.businessListId) return;

    deleteMutation.mutate(
      { id, businessListId: business.businessListId },
      {
        onSuccess: () => {
          toast.success("Business deleted successfully!");
          setShowDeleteModal(false);
          navigate(`/business-lists/${business.businessListId}`);
        },
        onError: () => toast.error("Failed to delete business"),
      },
    );
  };

  if (isLoading) return <Loader fullScreen text="Loading business..." />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FiAlertCircle className="text-red-500" size={40} />
        <p className="mt-4 text-red-600">
          {error?.message || "Failed to load business"}
        </p>
        <button
          onClick={() => navigate("/business-lists")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const inputCls = (hasError = false) =>
    `w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none transition-all text-gray-800 ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : isEditing
          ? "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          : "border-gray-300 bg-gray-50 cursor-not-allowed"
    }`;

  return (
    <div className="space-y-6">
      {showDeleteModal && (
        <DeleteModal
          title="Delete Business"
          message={`Are you sure you want to delete "${formData.businessName}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={isDeleting}
        />
      )}

      {/* Header */}
      <div className="mb-2 flex justify-between items-start gap-4 flex-wrap">
        <div className="flex gap-2 items-start">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                <MdBusiness className="text-white" size={22} />
              </span>
              {formData.businessName || "Business"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {formData.businessList && (
                <button
                  onClick={() =>
                    navigate(`/business-lists/${formData.businessList?.id}`)
                  }
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <FiList size={12} />
                  {formData.businessList.title}
                </button>
              )}
              <span className="text-gray-300">·</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColor(
                  formData.leadStatus || "NEW",
                )}`}
              >
                {formData.leadStatus || "NEW"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
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

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
          >
            <FiTrash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <Section icon={FiBriefcase} title="Business Information">
              <Field icon={FiTag} label="Business Name">
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputCls()}
                  placeholder="Business name"
                />
              </Field>

              <Field icon={FiTag} label="Category">
                <input
                  type="text"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputCls()}
                  placeholder="e.g. Pizza restaurant"
                />
              </Field>

              <Field icon={FiUser} label="Contact Person">
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputCls()}
                  placeholder="Contact person name"
                />
              </Field>

              <Field icon={FiHash} label="Place ID">
                <input
                  type="text"
                  name="placeId"
                  value={formData.placeId || ""}
                  onChange={handleChange}
                  disabled
                  className={inputCls()}
                  placeholder="Google Place ID"
                />
              </Field>
            </Section>

            <Section icon={FiPhone} title="Contact Details">
              <Field icon={FiPhone} label="Phone Number">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputCls()}
                  placeholder="+1 234 567 8900"
                />
              </Field>

              <Field icon={FiMail} label="Email">
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputCls()}
                  placeholder="email@example.com"
                />
              </Field>

              <Field icon={FiGlobe} label="Website">
                <input
                  type="url"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputCls()}
                  placeholder="https://example.com"
                />
              </Field>

              <Field icon={FiMapPin} label="Full Address">
                <input
                  type="text"
                  name="fullAddress"
                  value={formData.fullAddress || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputCls()}
                  placeholder="Street, city, state, ZIP"
                />
              </Field>

              <Field icon={FiMapPin} label="City">
                <input
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputCls()}
                  placeholder="City"
                />
              </Field>

              <Field icon={FiExternalLink} label="Google Maps URL">
                <input
                  type="url"
                  name="googleMapsUrl"
                  value={formData.googleMapsUrl || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputCls()}
                  placeholder="https://maps.google.com/..."
                />
              </Field>
            </Section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiStar className="text-blue-600" />
                Reputation
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                  <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                    <FiStar size={14} className="fill-amber-500" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Rating
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {formData.rating != null ? formData.rating.toFixed(1) : "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                  <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                    <FiMessageSquare size={14} />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Reviews
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {formData.reviewCount != null
                      ? formData.reviewCount.toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <Section icon={FiCheckCircle} title="Lead Status">
              <Field icon={FiCheckCircle} label="Status">
                <select
                  name="leadStatus"
                  value={formData.leadStatus || "NEW"}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputCls()}
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>

              <Field icon={FiCalendar} label="Last Contacted">
                <input
                  type="date"
                  name="lastContactedAt"
                  value={
                    formData.lastContactedAt
                      ? formData.lastContactedAt.split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputCls()}
                />
              </Field>

              <Field icon={FiCalendar} label="Next Follow-up">
                <input
                  type="date"
                  name="nextFollowUpAt"
                  value={
                    formData.nextFollowUpAt
                      ? formData.nextFollowUpAt.split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputCls()}
                />
              </Field>
            </Section>

            <Section icon={FiMail} title="Email Outreach">
              <Field icon={FiMail} label="Email Status">
                <select
                  name="emailStatus"
                  value={formData.emailStatus || "NOT_SENT"}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputCls()}
                >
                  {EMAIL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold mb-0.5">
                    Emails Sent
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {formData.emailCount ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold mb-0.5">
                    Last Sent
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(formData.lastEmailSentAt ?? null)}
                  </p>
                </div>
              </div>
            </Section>

            <Section icon={FiMessageCircle} title="WhatsApp Outreach">
              <Field icon={FiMessageCircle} label="WhatsApp Status">
                <select
                  name="whatsappStatus"
                  value={formData.whatsappStatus || "NOT_SENT"}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputCls()}
                >
                  {WHATSAPP_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold mb-0.5">
                    Messages Sent
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {formData.whatsappCount ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold mb-0.5">
                    Last Sent
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(formData.lastWhatsAppSentAt ?? null)}
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 cursor-pointer">
                <input
                  type="checkbox"
                  name="whatsappOptIn"
                  checked={!!formData.whatsappOptIn}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer disabled:cursor-not-allowed"
                />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    WhatsApp Opt-in
                  </p>
                  <p className="text-xs text-emerald-600">
                    {formData.whatsappOptInAt
                      ? `Opted in on ${formatDate(formData.whatsappOptInAt)}`
                      : "Not opted in"}
                  </p>
                </div>
              </label>
            </Section>
          </div>
        </div>

        <Section icon={FiFileText} title="Notes">
          <textarea
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            rows={5}
            disabled={!isEditing}
            className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all resize-none text-gray-800 ${
              isEditing
                ? "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                : "border-gray-300 bg-gray-50 cursor-not-allowed"
            }`}
            placeholder="Add notes about this business..."
          />
        </Section>

        <Section icon={FiClock} title="Metadata">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetaRow
              icon={FiHash}
              label="Business ID"
              value={formData.id || "—"}
              mono
            />
            <MetaRow
              icon={FiCalendar}
              label="Created"
              value={formatDateTime(formData.createdAt ?? null)}
            />
            <MetaRow
              icon={FiClock}
              label="Last Updated"
              value={formatDateTime(formData.updatedAt ?? null)}
            />
          </div>
        </Section>

        {isEditing && (
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleEditToggle}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <FiX size={18} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <FiLoader className="animate-spin" size={18} />
              ) : (
                <FiSave size={18} />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

/* ---------- helpers ---------- */
const Section = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="liquid-glass rounded-2xl p-6 space-y-4">
    <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
      <Icon className="text-blue-600" size={18} />
      {title}
    </h3>
    {children}
  </div>
);

const Field = ({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <Icon
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={16}
      />
      {children}
    </div>
  </div>
);

const MetaRow = ({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50">
    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
      <Icon size={14} className="text-blue-600" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
        {label}
      </p>
      <p
        className={`text-sm font-medium text-gray-800 truncate ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default SingleBusiness;
