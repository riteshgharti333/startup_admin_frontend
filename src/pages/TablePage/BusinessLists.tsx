import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiTag,
  FiSearch,
  FiCalendar,
  FiUsers,
  FiLoader,
  FiAlertCircle,
  FiLayers,
  FiChevronRight,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiUploadCloud,
  FiFileText,
} from "react-icons/fi";
import { MdBusiness } from "react-icons/md";
import { toast } from "react-hot-toast";
import DeleteModal from "../../components/DeleteModal";

interface BusinessList {
  id: string;
  title: string;
  category: string;
  location: string;
  keyword: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { businesses: number };
}

interface CreateForm {
  title: string;
  category: string;
  location: string;
  keyword: string;
  description: string;
}

const seedLists: BusinessList[] = [
  {
    id: "16e083a4-d23b-4f41-b97d-e35ae69aa766",
    title: "Cafe Restaurants in NYC",
    category: "Restaurant",
    location: "New York, USA",
    keyword: "pizza",
    description: "Lead list scraped from Google Maps",
    createdAt: "2026-11-09T12:59:57.859Z",
    updatedAt: "2026-11-09T12:59:57.859Z",
    _count: { businesses: 3 },
  },
  {
    id: "840bd465-53d2-43cf-a274-3597d5fa1619",
    title: "Pizza Restaurants in NYC",
    category: "Restaurant",
    location: "New York, USA",
    keyword: "pizza",
    description: "Lead list scraped from Google Maps",
    createdAt: "2026-11-09T12:59:33.158Z",
    updatedAt: "2026-11-09T12:59:33.158Z",
    _count: { businesses: 0 },
  },
  {
    id: "d834f778-6697-4ebc-8123-a37580b4dc7f",
    title: "Pizza Restaurants in NYC",
    category: "Restaurant",
    location: "New York, USA",
    keyword: "pizza",
    description: "Lead list scraped from Google Maps",
    createdAt: "2026-11-09T12:48:13.774Z",
    updatedAt: "2026-11-09T12:48:13.774Z",
    _count: { businesses: 0 },
  },
  {
    id: "50882cc6-388f-401c-b249-d9152ed4095d",
    title: "Pizza Restaurants in NYC",
    category: "Restaurant",
    location: "New York, USA",
    keyword: "pizza",
    description: "Lead list scraped from Google Maps",
    createdAt: "2026-11-09T12:42:26.855Z",
    updatedAt: "2026-11-09T12:42:26.855Z",
    _count: { businesses: 0 },
  },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const emptyForm: CreateForm = {
  title: "",
  category: "",
  location: "",
  keyword: "",
  description: "",
};

const uid = () =>
  `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const BusinessLists = () => {
  const navigate = useNavigate();

  const [lists, setLists] = useState<BusinessList[]>(seedLists);
  const [search, setSearch] = useState("");

  const [editTarget, setEditTarget] = useState<BusinessList | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<BusinessList | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [createMode, setCreateMode] = useState<"single" | "bulk">("single");
  const [createForm, setCreateForm] = useState<CreateForm>(emptyForm);
  const [bulkText, setBulkText] = useState("");
  const [bulkFileName, setBulkFileName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return lists;
    return lists.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.keyword.toLowerCase().includes(q),
    );
  }, [lists, search]);

  const totalBusinesses = useMemo(
    () => lists.reduce((sum, l) => sum + (l._count?.businesses || 0), 0),
    [lists],
  );

  const openEdit = (list: BusinessList) => {
    setEditTarget(list);
    setEditTitle(list.title);
  };

  const closeEdit = () => {
    if (isSaving) return;
    setEditTarget(null);
    setEditTitle("");
  };

  const handleSaveEdit = async () => {
    if (!editTarget) return;
    const trimmed = editTitle.trim();
    if (!trimmed) {
      toast.error("Title cannot be empty");
      return;
    }
    if (trimmed === editTarget.title) {
      closeEdit();
      return;
    }
    setIsSaving(true);
    const toastId = toast.loading("Updating list...");
    try {
      await new Promise((r) => setTimeout(r, 500));
      setLists((prev) =>
        prev.map((l) =>
          l.id === editTarget.id
            ? { ...l, title: trimmed, updatedAt: new Date().toISOString() }
            : l,
        ),
      );
      toast.success("List updated successfully!", { id: toastId });
      setEditTarget(null);
      setEditTitle("");
    } catch {
      toast.error("Failed to update list", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const toastId = toast.loading("Deleting list...");
    try {
      await new Promise((r) => setTimeout(r, 500));
      setLists((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      toast.success("List deleted successfully!", { id: toastId });
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete list", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const resetCreate = () => {
    setCreateForm(emptyForm);
    setBulkText("");
    setBulkFileName("");
    setCreateMode("single");
  };

  const closeCreate = () => {
    if (isCreating) return;
    setShowCreate(false);
    resetCreate();
  };

  const handleCreateSingle = async () => {
    if (!createForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!createForm.category.trim()) {
      toast.error("Category is required");
      return;
    }
    if (!createForm.location.trim()) {
      toast.error("Location is required");
      return;
    }
    if (!createForm.keyword.trim()) {
      toast.error("Keyword is required");
      return;
    }

    setIsCreating(true);
    const toastId = toast.loading("Creating list...");
    try {
      await new Promise((r) => setTimeout(r, 500));
      const now = new Date().toISOString();
      const newList: BusinessList = {
        id: uid(),
        title: createForm.title.trim(),
        category: createForm.category.trim(),
        location: createForm.location.trim(),
        keyword: createForm.keyword.trim(),
        description: createForm.description.trim() || null,
        createdAt: now,
        updatedAt: now,
        _count: { businesses: 0 },
      };
      setLists((prev) => [newList, ...prev]);
      toast.success("List created successfully!", { id: toastId });
      closeCreate();
    } catch {
      toast.error("Failed to create list", { id: toastId });
    } finally {
      setIsCreating(false);
    }
  };

  const parseBulkInput = (raw: string): CreateForm[] => {
    const trimmed = raw.trim();
    if (!trimmed) return [];

    // JSON array
    if (trimmed.startsWith("[")) {
      try {
        const arr = JSON.parse(trimmed);
        if (Array.isArray(arr)) {
          return arr
            .map((row) => ({
              title: String(row.title ?? "").trim(),
              category: String(row.category ?? "").trim(),
              location: String(row.location ?? "").trim(),
              keyword: String(row.keyword ?? "").trim(),
              description: String(row.description ?? "").trim(),
            }))
            .filter((r) => r.title && r.category && r.location && r.keyword);
        }
      } catch {
        /* fall through to CSV */
      }
    }

    // CSV: title,category,location,keyword,description
    const lines = trimmed.split(/\r?\n/).filter((l) => l.trim());
    const rows: CreateForm[] = [];
    lines.forEach((line, idx) => {
      if (idx === 0 && /title/i.test(line)) return; // skip header
      const cols = line.split(",").map((c) => c.trim());
      const [title, category, location, keyword, description = ""] = cols;
      if (title && category && location && keyword) {
        rows.push({ title, category, location, keyword, description });
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

  const handleBulkSubmit = async () => {
    const rows = parseBulkInput(bulkText);
    if (rows.length === 0) {
      toast.error("Please add at least one valid row");
      return;
    }
    setIsCreating(true);
    const toastId = toast.loading(`Creating ${rows.length} lists...`);
    try {
      await new Promise((r) => setTimeout(r, 700));
      const now = new Date().toISOString();
      const created: BusinessList[] = rows.map((r) => ({
        id: uid(),
        title: r.title,
        category: r.category,
        location: r.location,
        keyword: r.keyword,
        description: r.description || null,
        createdAt: now,
        updatedAt: now,
        _count: { businesses: 0 },
      }));
      setLists((prev) => [...created, ...prev]);
      toast.success(`${created.length} lists created!`, { id: toastId });
      closeCreate();
    } catch {
      toast.error("Failed to create lists", { id: toastId });
    } finally {
      setIsCreating(false);
    }
  };

  const bulkPreviewCount = useMemo(
    () => parseBulkInput(bulkText).length,
    [bulkText],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/30">
              <MdBusiness className="text-white" size={18} />
            </span>
            Business Lists
            <span className="text-xs font-normal text-gray-500">
              ({lists.length})
            </span>
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm">
            {totalBusinesses} businesses across all lists
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lists..."
              className="w-56 pl-9 pr-3 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 text-sm"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md shadow-blue-500/30 flex items-center gap-1.5"
          >
            <FiPlus size={16} />
            New List
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="liquid-glass rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
            <FiLayers className="text-blue-600" size={22} />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            {search ? "No matching lists" : "No business lists yet"}
          </h3>
          <p className="text-gray-500 text-sm max-w-sm">
            {search
              ? `No lists match "${search}". Try a different keyword.`
              : "Get started by creating your first business lead list."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((list) => {
            const businessCount = list._count?.businesses ?? 0;
            return (
              <div
                key={list.id}
                onClick={() => navigate(`/business-lists/${list.id}`)}
                className="liquid-glass rounded-xl p-4 cursor-pointer group transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/30 flex-shrink-0">
                    <MdBusiness className="text-white" size={16} />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      businessCount > 0
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <FiUsers size={10} />
                    {businessCount}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {list.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                  {list.description || "No description"}
                </p>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <FiTag className="text-blue-600 flex-shrink-0" size={12} />
                    <span className="font-medium truncate">
                      {list.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <FiMapPin
                      className="text-blue-600 flex-shrink-0"
                      size={12}
                    />
                    <span className="truncate">{list.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <FiSearch
                      className="text-blue-600 flex-shrink-0"
                      size={12}
                    />
                    <span className="truncate">{list.keyword}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-[11px] text-gray-500">
                    <FiCalendar size={10} />
                    {formatDate(list.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(list);
                      }}
                      className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Edit title"
                      aria-label="Edit list title"
                    >
                      <FiEdit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(list);
                      }}
                      className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete list"
                      aria-label="Delete list"
                    >
                      <FiTrash2 size={13} />
                    </button>
                    <FiChevronRight
                      size={14}
                      className="text-blue-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------- CREATE MODAL ---------- */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={closeCreate}
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
                    New Business List
                  </h3>
                  <p className="text-xs text-gray-500">
                    Add a single list or bulk import
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCreate}
                disabled={isCreating}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Mode tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setCreateMode("single")}
                className={`py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  createMode === "single"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <FiFileText size={15} />
                Single
              </button>
              <button
                type="button"
                onClick={() => setCreateMode("bulk")}
                className={`py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  createMode === "bulk"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <FiUploadCloud size={15} />
                Bulk
              </button>
            </div>

            {createMode === "single" ? (
              <div className="space-y-3">
                <CreateField
                  label="Title"
                  required
                  value={createForm.title}
                  onChange={(v) => setCreateForm((p) => ({ ...p, title: v }))}
                  placeholder="e.g. Cafe Restaurants in NYC"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CreateField
                    label="Category"
                    required
                    value={createForm.category}
                    onChange={(v) =>
                      setCreateForm((p) => ({ ...p, category: v }))
                    }
                    placeholder="e.g. Restaurant"
                  />
                  <CreateField
                    label="Keyword"
                    required
                    value={createForm.keyword}
                    onChange={(v) =>
                      setCreateForm((p) => ({ ...p, keyword: v }))
                    }
                    placeholder="e.g. pizza"
                  />
                </div>
                <CreateField
                  label="Location"
                  required
                  value={createForm.location}
                  onChange={(v) =>
                    setCreateForm((p) => ({ ...p, location: v }))
                  }
                  placeholder="e.g. New York, USA"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) =>
                      setCreateForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Optional description..."
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
                    Or paste rows (CSV: title,category,location,keyword)
                  </label>
                  <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-xs"
                    placeholder={`title,category,location,keyword\nCafe NYC,Restaurant,New York,pizza\nSushi LA,Sushi,Los Angeles,sushi`}
                  />
                </div>

                {bulkPreviewCount > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100">
                    <FiUsers size={14} className="text-emerald-600" />
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
                onClick={closeCreate}
                disabled={isCreating}
                className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={
                  createMode === "single"
                    ? handleCreateSingle
                    : handleBulkSubmit
                }
                disabled={isCreating}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-md shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <FiLoader className="animate-spin" size={15} />
                ) : (
                  <FiSave size={15} />
                )}
                {isCreating
                  ? "Creating..."
                  : createMode === "single"
                    ? "Create List"
                    : `Bulk Create (${bulkPreviewCount})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- EDIT TITLE MODAL ---------- */}
      {editTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={closeEdit}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FiEdit2 className="text-blue-600" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Edit List Title
                  </h3>
                  <p className="text-xs text-gray-500">
                    Update the display name of this list
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                disabled={isSaving}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") closeEdit();
                }}
                autoFocus
                disabled={isSaving}
                maxLength={120}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50"
                placeholder="Enter list title"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {editTitle.length}/120
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={closeEdit}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSaving || !editTitle.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-md shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <FiLoader className="animate-spin" size={15} />
                ) : (
                  <FiSave size={15} />
                )}
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- DELETE MODAL ---------- */}
      {deleteTarget && (
        <DeleteModal
          title="Delete Business List"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This will also remove all ${deleteTarget._count.businesses} businesses in this list. This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

const CreateField = ({
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

export default BusinessLists;
