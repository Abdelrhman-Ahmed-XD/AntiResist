import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Search, Trash2, ExternalLink, Loader2, Users } from "lucide-react";
import { getSupporters, deleteSupporter } from "../../firebase/firestore";
import SpecialtyBadge from "../../components/common/SpecialtyBadge";

export default function SupportersTab() {
  const [supporters, setSupporters] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [deleting,   setDeleting]   = useState(null);

  useEffect(() => {
    getSupporters()
      .then(setSupporters)
      .finally(() => setLoading(false));
  }, []);

  const filtered = supporters.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.specialty ?? "").toLowerCase().includes(q) ||
      (s.workplace ?? "").toLowerCase().includes(q)
    );
  });

  async function handleDelete(supporter) {
    if (!window.confirm(`Delete "${supporter.name}"? This cannot be undone.`)) return;
    setDeleting(supporter.id);
    try {
      await deleteSupporter(supporter.id);
      setSupporters((prev) => prev.filter((s) => s.id !== supporter.id));
      toast.success(`${supporter.name} removed.`);
    } catch {
      toast.error("Failed to delete. Please try again.");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={28} className="animate-spin text-teal" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total supporters", value: supporters.length },
          { label: "Showing",          value: filtered.length },
          { label: "With comments",    value: supporters.filter((s) => s.comment).length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <p className="text-2xl font-bold text-dark">{value}</p>
            <p className="text-xs text-secondary mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm mb-5">
        <Search size={15} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
        <input
          type="text"
          placeholder="Search name, specialty, workplace…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 text-sm text-dark placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-secondary">
          <Users size={32} strokeWidth={1.5} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No supporters found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold text-secondary uppercase tracking-wide">Name</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-secondary uppercase tracking-wide">Specialty</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-secondary uppercase tracking-wide hidden sm:table-cell">Workplace</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-secondary uppercase tracking-wide hidden md:table-cell">Joined</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-secondary uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((s) => {
                  const date = s.createdAt?.toDate
                    ? s.createdAt.toDate().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                    : s.createdAt
                    ? new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                    : "—";
                  return (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-dark">{s.name}</td>
                      <td className="px-5 py-4"><SpecialtyBadge specialty={s.specialty} /></td>
                      <td className="px-5 py-4 text-secondary hidden sm:table-cell max-w-[180px] truncate">{s.workplace || "—"}</td>
                      <td className="px-5 py-4 text-secondary hidden md:table-cell whitespace-nowrap">{date}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/profile/${s.uid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-secondary hover:text-teal hover:border-teal transition-colors"
                            title="View profile"
                          >
                            <ExternalLink size={13} strokeWidth={1.5} />
                          </Link>
                          <button
                            onClick={() => handleDelete(s)}
                            disabled={deleting === s.id}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-secondary hover:text-danger hover:border-danger transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === s.id
                              ? <Loader2 size={13} className="animate-spin" />
                              : <Trash2 size={13} strokeWidth={1.5} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
