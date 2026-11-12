import { useEffect, useMemo, useRef, useState } from "react";
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
  FiCheckCircle,
  FiAlertTriangle,
  FiGlobe,
  FiFlag,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";
import { MdBusiness } from "react-icons/md";
import { toast } from "react-hot-toast";
import Table from "../../components/Table";
import BackButton from "../../components/BackButton";
import { useBusinessList } from "../../service/hooks/useBusinessList";
import {
  useCreateBusiness,
  useBulkImportBusinesses,
  useUpdateBusiness,
} from "../../service/hooks/useBusiness";
import type { Business, CreateBusinessDto } from "../../service/types";

interface BusinessForm {
  businessName: string;
  city: string;
  phoneNumber: string;
  rating: string;
  reviewCount: string;
  placeId: string;
  category: string;
  website: string;
  fullAddress: string;
  googleMapsUrl: string;
}

const emptyForm: BusinessForm = {
  businessName: "",
  city: "",
  phoneNumber: "",
  rating: "",
  reviewCount: "",
  placeId: "",
  category: "",
  website: "",
  fullAddress: "",
  googleMapsUrl: "",
};

const HEADER_LABELS = ["businessname", "business name", "name"];

type LeadStatus = Business["leadStatus"];

const STATUS_OPTIONS: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "FOLLOW_UP",
  "NOT_INTERESTED",
  "CONVERTED",
  "LOST",
];

const statusStyles: Record<LeadStatus, string> = {
  NEW: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  CONTACTED:
    "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
  INTERESTED:
    "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  FOLLOW_UP:
    "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
  NOT_INTERESTED: "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200",
  CONVERTED:
    "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  LOST: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
};

const statusDot: Record<LeadStatus, string> = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-yellow-500",
  INTERESTED: "bg-purple-500",
  FOLLOW_UP: "bg-orange-500",
  NOT_INTERESTED: "bg-gray-500",
  CONVERTED: "bg-emerald-500",
  LOST: "bg-rose-500",
};

const sanitizePhone = (raw: string): string | undefined => {
  if (!raw) return undefined;
  const cleaned = raw.replace(/[\s\-().]/g, "").trim();
  if (!cleaned) return undefined;
  const normalized = cleaned.replace(/^0+(?=\d)/, "");
  if (!/^\+?[1-9]\d{9,14}$/.test(normalized)) return undefined;
  return normalized;
};

const sanitizeUrl = (raw: string): string | undefined => {
  if (!raw) return undefined;
  let url = raw.trim();
  if (!url) return undefined;
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  try {
    const u = new URL(url);
    if (!u.hostname || !u.hostname.includes(".")) return undefined;
    if (u.hostname.includes("google.com")) return undefined;
    return u.toString();
  } catch {
    return undefined;
  }
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const parseCsvLine = (line: string): string[] => {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      out.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  out.push(current.trim());
  return out;
};

const parseBulkInput = (raw: string): BusinessForm[] => {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);

      let arr: unknown[];
      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed) &&
        Array.isArray((parsed as { businesses?: unknown }).businesses)
      ) {
        arr = (parsed as { businesses: unknown[] }).businesses;
      } else if (Array.isArray(parsed)) {
        arr = parsed;
      } else {
        arr = [parsed];
      }

      return (arr as Array<Record<string, unknown>>)
        .map((row) => ({
          businessName: String(row.businessName ?? row.name ?? "").trim(),
          city: String(row.city ?? "").trim(),
          phoneNumber: String(row.phoneNumber ?? row.phone ?? "").trim(),
          rating: row.rating != null ? String(row.rating).trim() : "",
          reviewCount:
            row.reviewCount != null ? String(row.reviewCount).trim() : "",
          placeId: row.placeId != null ? String(row.placeId).trim() : "",
          category: row.category != null ? String(row.category).trim() : "",
          website: row.website != null ? String(row.website).trim() : "",
          fullAddress:
            row.fullAddress != null ? String(row.fullAddress).trim() : "",
          googleMapsUrl:
            row.googleMapsUrl != null ? String(row.googleMapsUrl).trim() : "",
        }))
        .filter((r) => r.businessName);
    } catch {
      toast.error("Invalid JSON — check for trailing commas or missing quotes");
      return [];
    }
  }

  const lines = trimmed.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];

  const headerCells = parseCsvLine(lines[0]).map((c) => c.toLowerCase());
  const isHeaderRow = headerCells.some((c) => HEADER_LABELS.includes(c.trim()));

  const columnMap: Partial<Record<keyof BusinessForm, number>> = {};
  if (isHeaderRow) {
    headerCells.forEach((cell, idx) => {
      const key = cell.trim();
      if (key === "businessname" || key === "business name" || key === "name") {
        columnMap.businessName = idx;
      } else if (key === "city") {
        columnMap.city = idx;
      } else if (key === "phonenumber" || key === "phone") {
        columnMap.phoneNumber = idx;
      } else if (key === "rating") {
        columnMap.rating = idx;
      } else if (key === "reviewcount" || key === "reviews") {
        columnMap.reviewCount = idx;
      } else if (key === "placeid") {
        columnMap.placeId = idx;
      } else if (key === "category") {
        columnMap.category = idx;
      } else if (key === "website") {
        columnMap.website = idx;
      } else if (key === "fulladdress" || key === "address") {
        columnMap.fullAddress = idx;
      } else if (key === "googlemapsurl" || key === "mapsurl") {
        columnMap.googleMapsUrl = idx;
      }
    });
  } else {
    columnMap.businessName = 0;
    columnMap.city = 1;
    columnMap.phoneNumber = 2;
    columnMap.rating = 3;
    columnMap.reviewCount = 4;
    columnMap.placeId = 5;
    columnMap.category = 6;
    columnMap.website = 7;
    columnMap.fullAddress = 8;
    columnMap.googleMapsUrl = 9;
  }

  const dataStart = isHeaderRow ? 1 : 0;
  const rows: BusinessForm[] = [];

  for (let i = dataStart; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);

    const get = (key: keyof BusinessForm): string => {
      const idx = columnMap[key];
      if (idx === undefined) return "";
      return (cols[idx] ?? "").trim();
    };

    const businessName = get("businessName");
    if (!businessName) continue;

    rows.push({
      businessName,
      city: get("city"),
      phoneNumber: get("phoneNumber"),
      rating: get("rating"),
      reviewCount: get("reviewCount"),
      placeId: get("placeId"),
      category: get("category"),
      website: get("website"),
      fullAddress: get("fullAddress"),
      googleMapsUrl: get("googleMapsUrl"),
    });
  }

  return rows;
};

const validateNumericFields = (row: BusinessForm): string | null => {
  if (row.rating) {
    const n = parseFloat(row.rating);
    if (Number.isNaN(n)) return "Rating must be a number";
    if (n < 0 || n > 5) return "Rating must be between 0 and 5";
  }

  if (row.reviewCount) {
    const n = parseInt(row.reviewCount, 10);
    if (Number.isNaN(n)) return "Review count must be a number";
    if (n < 0) return "Review count cannot be negative";
  }

  return null;
};

interface StatusDropdownProps {
  value: LeadStatus;
  onChange: (next: LeadStatus) => void;
  disabled?: boolean;
}

const StatusDropdown = ({ value, onChange, disabled }: StatusDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors disabled:opacity-50 ${statusStyles[value]}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[value]}`} />
        {value.replace(/_/g, " ")}
        <FiChevronDown
          size={11}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {STATUS_OPTIONS.map((s) => {
            const isActive = s === value;
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (!isActive) onChange(s);
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[s]}`} />
                <span className="flex-1">{s.replace(/_/g, " ")}</span>
                {isActive && <FiCheck size={12} className="text-blue-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

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
  const updateMutation = useUpdateBusiness();

  const [showAdd, setShowAdd] = useState(false);
  const [addMode, setAddMode] = useState<"single" | "bulk">("single");
  const [form, setForm] = useState<BusinessForm>(emptyForm);
  const [bulkText, setBulkText] = useState("");
  const [bulkFileName, setBulkFileName] = useState("");
  const [pendingStatus, setPendingStatus] = useState<Record<string, LeadStatus>>(
    {},
  );

  const isSaving = createMutation.isPending || bulkMutation.isPending;

  const businesses: Business[] = list?.businesses ?? [];

  const parsedBulkRows = useMemo(() => parseBulkInput(bulkText), [bulkText]);
  const bulkPreviewCount = parsedBulkRows.length;

  const handleRowClick = (business: Business) => {
    if (showAdd) closeAdd();
    navigate(`/businesses/${business.id}`);
  };

  const handleStatusChange = (business: Business, newStatus: LeadStatus) => {
    if (newStatus === business.leadStatus) return;

    setPendingStatus((p) => ({ ...p, [business.id]: newStatus }));

    updateMutation.mutate(
      { id: business.id, data: { leadStatus: newStatus } },
      {
        onSuccess: () => {
          toast.success(`Status updated to ${newStatus.replace(/_/g, " ")}`);
          setPendingStatus((p) => {
            const next = { ...p };
            delete next[business.id];
            return next;
          });
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to update status");
          setPendingStatus((p) => {
            const next = { ...p };
            delete next[business.id];
            return next;
          });
        },
      },
    );
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
        accessorKey: "website",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiGlobe size={14} />
            Website
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => {
          const website = info.getValue<string | null>();
          if (!website)
            return <span className="text-gray-400 text-sm italic">N/A</span>;

          const display = website
            .replace(/^https?:\/\//i, "")
            .replace(/\/$/, "");

          return (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-600 text-sm hover:underline truncate block max-w-[200px]"
              title={website}
            >
              {display}
            </a>
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
      {
        accessorKey: "leadStatus",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-gray-700"
          >
            <FiFlag size={14} />
            Status
            {column.getIsSorted() === "asc" ? (
              <FiArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <FiArrowDown size={14} />
            ) : null}
          </button>
        ),
        cell: (info) => {
          const row = info.row.original;
          const current = info.getValue<LeadStatus>();
          const optimistic = pendingStatus[row.id];
          const displayed = optimistic ?? current;
          const isPending = optimistic !== undefined;

          return (
            <StatusDropdown
              value={displayed}
              onChange={(next) => handleStatusChange(row, next)}
              disabled={isPending}
            />
          );
        },
      },
    ],
    [pendingStatus],
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

    const numericError = validateNumericFields(form);
    if (numericError) {
      toast.error(numericError);
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
        toast.success("Business added");
        closeAdd();
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to add business");
      },
    });
  };

  const handleBulkFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setBulkFileName("");
      return;
    }

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
    reader.onerror = () => {
      toast.error("Failed to read file");
      setBulkFileName("");
    };
    reader.readAsText(file);
  };

  const handleBulkSubmit = () => {
    if (!id) return;

    const rows = parsedBulkRows;

    if (rows.length === 0) {
      toast.error("Please add at least one valid row");
      return;
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.businessName.trim()) {
        toast.error(`Row ${i + 1}: Business name is required`);
        return;
      }
      const err = validateNumericFields(row);
      if (err) {
        toast.error(`Row ${i + 1} (${row.businessName}): ${err}`);
        return;
      }
    }

    const missingPlaceId = rows.filter((r) => !r.placeId.trim()).length;
    if (missingPlaceId > 0) {
      toast(
        `${missingPlaceId} row(s) missing placeId — duplicates may occur on re-import`,
      );
    }

    bulkMutation.mutate(
      {
        businessListId: id,
        businesses: rows.map((r) => ({
          businessName: r.businessName.trim(),
          ...(r.placeId.trim() && { placeId: r.placeId.trim() }),
          ...(r.category.trim() && { category: r.category.trim() }),
          ...(sanitizePhone(r.phoneNumber) && {
            phoneNumber: sanitizePhone(r.phoneNumber)!,
          }),
          ...(sanitizeUrl(r.website) && {
            website: sanitizeUrl(r.website)!,
          }),
          ...(r.fullAddress.trim() && { fullAddress: r.fullAddress.trim() }),
          ...(r.city.trim() && { city: r.city.trim() }),
          ...(r.googleMapsUrl.trim() && {
            googleMapsUrl: r.googleMapsUrl.trim(),
          }),
          ...(r.rating && { rating: parseFloat(r.rating) }),
          ...(r.reviewCount && {
            reviewCount: parseInt(r.reviewCount, 10),
          }),
        })),
      },
      {
        onSuccess: (response: any) => {
          const data = response?.data ?? response;
          const inserted = data?.inserted ?? 0;
          const updated = data?.updated ?? 0;
          const skipped = data?.skipped ?? 0;
          const failed = data?.failed ?? 0;
          const total = inserted + updated;

          if (failed > 0) {
            toast.error(
              `${total} saved, ${failed} failed. Check console for details.`,
            );
            if (data?.errors?.length) {
              console.error("Bulk import errors:", data.errors);
            }
          } else if (skipped > 0) {
            toast.success(
              `${inserted} added, ${updated} updated, ${skipped} duplicate(s) skipped`,
            );
          } else {
            toast.success(`${inserted} added, ${updated} updated`);
          }

          closeAdd();
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to add businesses");
        },
      },
    );
  };

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
                  <NumberField
                    label="Rating (0–5)"
                    value={form.rating}
                    onChange={(v) => setForm((p) => ({ ...p, rating: v }))}
                    placeholder="4.5"
                    min={0}
                    max={5}
                    step={0.1}
                  />
                  <NumberField
                    label="Review Count"
                    value={form.reviewCount}
                    onChange={(v) => setForm((p) => ({ ...p, reviewCount: v }))}
                    placeholder="2310"
                    min={0}
                    step={1}
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
                    <FiCheckCircle size={14} className="text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">
                      {bulkPreviewCount} valid row
                      {bulkPreviewCount === 1 ? "" : "s"} detected
                    </span>
                  </div>
                )}

                {bulkText.trim() && bulkPreviewCount === 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">
                    <FiAlertTriangle size={14} className="text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">
                      No valid rows found — check your format
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

const NumberField = ({
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

export default Businesses;