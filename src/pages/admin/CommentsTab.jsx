import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MessageSquare, Trash2, Loader2, XCircle } from "lucide-react";
import { getSupporters, updateSupporter, deleteSupporter } from "../../firebase/firestore";
import SpecialtyBadge from "../../components/common/SpecialtyBadge";

export default function CommentsTab() {
  const [supporters, setSupporters] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [clearing,   setClearing]   = useState(null);
  const [deleting,   setDeleting]   = useState(null);

  useEffect(() => {
    getSupporters()
      .then((all) => setSupporters(all.filter((s) => s.comment)))
      .finally(() => setLoading(false));
  }, []);

  async function handleClearComment(s) {
    if (!window.confirm(`Clear comment from "${s.name}"?`)) return;
    setClearing(s.id);
    try {
      await updateSupporter(s.id, { comment: "" });
      setSupporters((prev) => prev.filter((x) => x.id !== s.id));
      toast.success("Comment cleared.");
    } catch {
      toast.error("Failed to clear comment.");
    } finally {
      setClearing(null);
    }
  }

  async function handleDelete(s) {
    if (!window.confirm(`Delete supporter "${s.name}" entirely? This cannot be undone.`)) return;
    setDeleting(s.id);
    try {
      await deleteSupporter(s.id);
      setSupporters((prev) => prev.filter((x) => x.id !== s.id));
      toast.success(`${s.name} removed.`);
    } catch {
      toast.error("Failed to delete.");
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
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-6 inline-block">
        <p className="text-2xl font-bold text-dark">{supporters.length}</p>
        <p className="text-xs text-secondary mt-0.5">Supporters with comments</p>
      </div>

      {supporters.length === 0 ? (
        <div className="text-center py-16 text-secondary">
          <MessageSquare size={32} strokeWidth={1.5} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No supporter comments to moderate.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {supporters.map((s) => (
            <div key={s.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-dark text-sm">{s.name}</p>
                    <SpecialtyBadge specialty={s.specialty} />
                  </div>
                  {s.workplace && (
                    <p className="text-xs text-secondary mb-3">{s.workplace}</p>
                  )}
                  <blockquote className="text-sm text-dark italic leading-relaxed border-l-2 border-teal pl-3">
                    "{s.comment}"
                  </blockquote>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleClearComment(s)}
                    disabled={clearing === s.id}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-secondary hover:text-amber-500 hover:border-amber-300 transition-colors disabled:opacity-50"
                    title="Clear comment only"
                  >
                    {clearing === s.id
                      ? <Loader2 size={13} className="animate-spin" />
                      : <XCircle size={13} strokeWidth={1.5} />}
                  </button>
                  <button
                    onClick={() => handleDelete(s)}
                    disabled={deleting === s.id}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-secondary hover:text-danger hover:border-danger transition-colors disabled:opacity-50"
                    title="Delete supporter"
                  >
                    {deleting === s.id
                      ? <Loader2 size={13} className="animate-spin" />
                      : <Trash2 size={13} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
