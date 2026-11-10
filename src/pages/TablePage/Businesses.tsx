import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import {
  FiArrowUp,
  FiArrowDown,
  FiBriefcase,
  FiMapPin,
  FiPhone,
  FiStar,
  FiMessageSquare,
  FiLoader,
  FiAlertCircle,
  FiTag,
  FiSearch,
  FiCalendar,
  FiLayers,
  FiPlus,
  FiX,
  FiSave,
  FiUploadCloud,
  FiFileText,
} from "react-icons/fi";
import { MdBusiness } from "react-icons/md";
import { toast } from "react-hot-toast";
import Table from "../../components/Table";
import BackButton from "../../components/BackButton";
import { useBusinessList } from "../../service/hooks/useBusinessList";
import {
  useCreateBusiness,
  useBulkImportBusinesses,
} from "../../service/hooks/useBusiness";
import type { Business, CreateBusinessDto } from "../../service/types";

interface BusinessForm {
  businessName: string;
  city: string;
  phoneNumber: string;
  rating: string;
  reviewCount: string;
}

const emptyForm: BusinessForm = {
  businessName: "",
  city: "",
  phoneNumber: "",
  rating: "",
  reviewCount: "",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const Businesses = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: list,
    isLoading,
    isError,
    error,
    refetch,
  } = useBusinessList(id || "");

  const createMutation = useCreateBusiness();
  const bulkMutation = useBulkImportBusinesses();

  const [showAdd, setShowAdd] = useState(false);
  const [addMode, setAddMode] = useState<"single" | "bulk">("single");
  const [form, setForm] = useState<BusinessForm>(emptyForm);
  const [bulkText, setBulkText] = useState("");
  const [bulkFileName, setBulkFileName] = useState("");

  const isSaving = createMutation.isPending || bulkMutation.isPending;

  const businesses: Business[] = list?.businesses ?? [];

  const handleRowClick = (business: Business) => {
    navigate(`/businesses/${business.id}`);
  };

  const columns: ColumnDef<Business>[] = useMemo(
    () => [
      {
        accessorKey: "businessName",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiBriefcase size={14} />
            Business Name
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <MdBusiness className="text-white" size={14} />
            </div>
            <p className="font-semibold text-gray-800">
              {info.getValue<string>()}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "city",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiMapPin size={14} />
            City
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => {
          const city = info.getValue<string | null>();
          return city ? (
            <span className="text-gray-600 text-sm">{city}</span>
          ) : (
            <span className="text-gray-400 text-sm italic">N/A</span>
          );
        },
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
        cell: (info) => {
          const phone = info.getValue<string | null>();
          return phone ? (
            <a
              href={`tel:${phone}`}
              className="text-blue-600 text-sm font-mono hover:underline whitespace-nowrap"
              onClick={(e) => e.stopPropagation()}
            >
              {phone}
            </a>
          ) : (
            <span className="text-gray-400 text-sm italic">N/A</span>
          );
        },
      },
      {
        accessorKey: "rating",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiStar size={14} />
            Rating
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => {
          const rating = info.getValue<number | null>();
          if (rating == null)
            return <span className="text-gray-400 text-sm italic">N/A</span>;
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
              <FiStar size={11} className="fill-amber-500 text-amber-500" />
              {rating.toFixed(1)}
            </span>
          );
        },
      },
      {
        accessorKey: "reviewCount",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiMessageSquare size={14} />
            Reviews
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => {
          const count = info.getValue<number | null>();
          return count != null ? (
            <span className="text-gray-700 text-sm font-medium">
              {count.toLocaleString()}
            </span>
          ) : (
            <span className="text-gray-400 text-sm italic">N/A</span>
          );
        },
      },
    ],
    [],
  );

  const closeAdd = () => {
    if (isSaving) return;
    setShowAdd(false);
    setForm(emptyForm);
    setBulkText("");
    setBulkFileName("");
    setAddMode("single");
  };

  const handleAddSingle = () => {
    if (!id) return;
    if (!form.businessName.trim()) {
      toast.error("Business name is required");
      return;
    }

    const payload: CreateBusinessDto = {
      businessListId: id,
      businessName: form.businessName.trim(),
      city: form.city.trim() || undefined,
      phoneNumber: form.phoneNumber.trim() || undefined,
      rating: form.rating ? parseFloat(form.rating) : undefined,
      reviewCount: form.reviewCount
        ? parseInt(form.reviewCount, 10)
        : undefined,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Business added!");
        closeAdd();
      },
      onError: () => toast.error("Failed to add business"),
    });
  };

  const parseBulkInput = (raw: string): BusinessForm[] => {
    const trimmed = raw.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith("[")) {
      try {
        const arr = JSON.parse(trimmed);
        if (Array.isArray(arr)) {
          return (arr as Array<Record<string, unknown>>)
            .map((row) => ({
              businessName: String(row.businessName ?? row.name ?? "").trim(),
              city: String(row.city ?? "").trim(),
              phoneNumber: String(row.phoneNumber ?? row.phone ?? "").trim(),
              rating: row.rating != null ? String(row.rating).trim() : "",
              reviewCount:
                row.reviewCount != null ? String(row.reviewCount).trim() : "",
            }))
            .filter((r) => r.businessName);
        }
      } catch {
        /* fall through */
      }
    }

    const lines = trimmed.split(/\r?\n/).filter((l) => l.trim());
    const rows: BusinessForm[] = [];
    lines.forEach((line, idx) => {
      if (idx === 0 && /business\s*name|name/i.test(line)) return;
      const cols = line.split(",").map((c) => c.trim());
      const [
        businessName,
        city = "",
        phoneNumber = "",
        rating = "",
        reviewCount = "",
      ] = cols;
      if (businessName) {
        rows.push({ businessName, city, phoneNumber, rating, reviewCount });
      }
    });
    return rows;
  };

  const handleBulkFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      setBulkText(text);
      const parsed = parseBulkInput(text);
      if (parsed.length === 0) {
        toast.error("No valid rows found in file");
      } else {
        toast.success(`${parsed.length} rows detected`);
      }
    };
    reader.readAsText(file);
  };

  const handleBulkSubmit = () => {
    if (!id) return;
    const rows = parseBulkInput(bulkText);
    if (rows.length === 0) {
      toast.error("Please add at least one valid row");
      return;
    }

    bulkMutation.mutate(
      {
        businessListId: id,
        businesses: rows.map((r) => ({
          businessName: r.businessName,
          city: r.city || undefined,
          phoneNumber: r.phoneNumber || undefined,
          rating: r.rating ? parseFloat(r.rating) : undefined,
          reviewCount: r.reviewCount ? parseInt(r.reviewCount, 10) : undefined,
        })),
      },
      {
        onSuccess: () => {
          toast.success(`${rows.length} businesses added!`);
          closeAdd();
        },
        onError: () => toast.error("Failed to add businesses"),
      },
    );
  };

  const bulkPreviewCount = useMemo(
    () => parseBulkInput(bulkText).length,
    [bulkText],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FiLoader className="animate-spin text-blue-600" size={40} />
        <p className="mt-4 text-gray-600">Loading businesses...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FiAlertCircle className="text-red-500" size={40} />
        <p className="mt-4 text-red-600">
          {error?.message || "Failed to fetch businesses"}
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
      {/* Header */}
      <div className="mb-2 flex justify-between items-start gap-4 flex-wrap">
        <div className="flex gap-2 items-start">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                <MdBusiness className="text-white" size={22} />
              </span>
              {list?.title || "Businesses"}
              <span className="text-sm font-normal text-gray-500">
                ({businesses.length})
              </span>
            </h1>
            {list?.description && (
              <p className="text-gray-500 mt-1 text-sm">{list.description}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          <FiPlus size={16} />
          Add Business
        </button>
      </div>

      {/* List meta */}
      {list && (
        <div className="liquid-glass rounded-2xl p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetaItem icon={FiTag} label="Category" value={list.category} />
            <MetaItem icon={FiMapPin} label="Location" value={list.location} />
            <MetaItem icon={FiSearch} label="Keyword" value={list.keyword} />
            <MetaItem
              icon={FiCalendar}
              label="Created"
              value={formatDate(list.createdAt)}
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="liquid-glass rounded-2xl p-6">
        {businesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <FiLayers className="text-blue-600" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              No businesses yet
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mb-4">
              This list doesn't contain any businesses yet. Add one manually or
              bulk import.
            </p>
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-md shadow-blue-500/30 flex items-center gap-2"
            >
              <FiPlus size={16} />
              Add Business
            </button>
          </div>
        ) : (
          <Table
            data={businesses}
            columns={columns}
            showPagination={true}
            pageSize={10}
            onRowClick={handleRowClick}
            getRowId={(row) => row.id}
          />
        )}
      </div>

      {/* ---------- ADD MODAL ---------- */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={closeAdd}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                  <FiPlus className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Add Businesses
                  </h3>
                  <p className="text-xs text-gray-500">
                    Add a single business or bulk import
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeAdd}
                disabled={isSaving}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setAddMode("single")}
                className={`py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  addMode === "single"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <FiFileText size={15} />
                Single
              </button>
              <button
                type="button"
                onClick={() => setAddMode("bulk")}
                className={`py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  addMode === "bulk"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <FiUploadCloud size={15} />
                Bulk
              </button>
            </div>

            {addMode === "single" ? (
              <div className="space-y-3">
                <FormField
                  label="Business Name"
                  required
                  value={form.businessName}
                  onChange={(v) => setForm((p) => ({ ...p, businessName: v }))}
                  placeholder="e.g. Joe's Pizza"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    label="City"
                    value={form.city}
                    onChange={(v) => setForm((p) => ({ ...p, city: v }))}
                    placeholder="e.g. New York"
                  />
                  <FormField
                    label="Phone"
                    value={form.phoneNumber}
                    onChange={(v) => setForm((p) => ({ ...p, phoneNumber: v }))}
                    placeholder="+1 212 555 0100"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    label="Rating (0–5)"
                    value={form.rating}
                    onChange={(v) => setForm((p) => ({ ...p, rating: v }))}
                    placeholder="4.5"
                  />
                  <FormField
                    label="Review Count"
                    value={form.reviewCount}
                    onChange={(v) => setForm((p) => ({ ...p, reviewCount: v }))}
                    placeholder="2310"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload CSV / JSON file
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                    <FiUploadCloud size={26} className="text-blue-600 mb-1.5" />
                    <span className="text-sm font-medium text-gray-700">
                      {bulkFileName || "Click to upload"}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5">
                      .csv or .json
                    </span>
                    <input
                      type="file"
                      accept=".csv,.json,application/json,text/csv"
                      onChange={handleBulkFile}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or paste rows (CSV: businessName,city,phone,rating,reviews)
                  </label>
                  <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-xs"
                    placeholder={`businessName,city,phoneNumber,rating,reviewCount\nJoe's Pizza,New York,+12125550100,4.5,2310\nSushi Bar,Los Angeles,+13105550100,4.7,890`}
                  />
                </div>

                {bulkPreviewCount > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100">
                    <FiStar size={14} className="text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">
                      {bulkPreviewCount} valid row
                      {bulkPreviewCount === 1 ? "" : "s"} detected
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={closeAdd}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={
                  addMode === "single" ? handleAddSingle : handleBulkSubmit
                }
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-md shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <FiLoader className="animate-spin" size={15} />
                ) : (
                  <FiSave size={15} />
                )}
                {isSaving
                  ? "Saving..."
                  : addMode === "single"
                    ? "Add Business"
                    : `Bulk Add (${bulkPreviewCount})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetaItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-2.5">
    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
      <Icon size={14} className="text-blue-600" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

const FormField = ({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

export default Businesses;
