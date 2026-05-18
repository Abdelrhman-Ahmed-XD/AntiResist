import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";
import { getSupporter, updateSupporter } from "../firebase/firestore";

const SPECIALTIES = [
  "Doctor",
  "Pharmacist",
  "Nurse",
  "Medical Student",
  "Pharmacy Student",
  "Other",
];

const EMPTY = { name: "", specialty: "", workplace: "", comment: "" };

export default function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [docId,   setDocId]   = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [fetching, setFetching] = useState(true);
  const [saving,  setSaving]  = useState(false);

  // Load existing supporter data
  useEffect(() => {
    if (!user) return;
    getSupporter(user.uid)
      .then((data) => {
        if (data) {
          setDocId(data.id);
          setForm({
            name:      data.name      ?? "",
            specialty: data.specialty ?? "",
            workplace: data.workplace ?? "",
            comment:   data.comment   ?? "",
          });
        }
      })
      .finally(() => setFetching(false));
  }, [user]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name      = "Full name is required.";
    if (!form.specialty)   e.specialty = "Please select your specialty.";
    return e;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (!docId) { toast.error("Profile document not found."); return; }

    setSaving(true);
    try {
      await updateSupporter(docId, {
        name:      form.name.trim(),
        specialty: form.specialty,
        workplace: form.workplace.trim(),
        comment:   form.comment.trim(),
      });
      toast.success("Profile updated.");
      navigate(`/profile/${user.uid}`);
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (fetching) {
    return (
      <>
        <Navbar />
        <main className="bg-bg min-h-screen flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-teal" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-bg min-h-screen py-16">
        <div className="max-w-lg mx-auto px-4">

          {/* Back link */}
          <button
            onClick={() => navigate(`/profile/${user.uid}`)}
            className="flex items-center gap-1.5 text-sm text-secondary hover:text-dark mb-6 transition-colors"
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
            Back to profile
          </button>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100">
              <h1 className="text-xl font-semibold text-dark">Edit profile</h1>
              <p className="text-sm text-secondary mt-1">
                Changes are saved to your public supporter profile.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="px-8 py-8 space-y-5">

              {/* Full name */}
              <Field label="Full name" error={errors.name}>
                <input
                  type="text"
                  placeholder="Dr. Ahmed Hassan"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputCls(errors.name)}
                />
              </Field>

              {/* Specialty */}
              <Field label="Specialty" error={errors.specialty}>
                <select
                  value={form.specialty}
                  onChange={(e) => set("specialty", e.target.value)}
                  className={inputCls(errors.specialty) + " bg-white"}
                >
                  <option value="">Select your specialty…</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              {/* Workplace */}
              <Field label="Workplace" hint="Optional" error={errors.workplace}>
                <input
                  type="text"
                  placeholder="Hospital or institution name"
                  value={form.workplace}
                  onChange={(e) => set("workplace", e.target.value)}
                  className={inputCls(errors.workplace)}
                />
              </Field>

              {/* Comment */}
              <Field label="Your message" hint="Optional — shown on your public profile" error={errors.comment}>
                <textarea
                  rows={4}
                  placeholder="Why does fighting AMR matter to you?"
                  value={form.comment}
                  onChange={(e) => set("comment", e.target.value)}
                  className={inputCls(errors.comment) + " resize-none"}
                />
              </Field>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-teal text-white text-sm font-medium rounded-xl hover:bg-teal/90 transition-colors disabled:opacity-60"
                >
                  {saving
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Save size={15} strokeWidth={1.5} />}
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/profile/${user.uid}`)}
                  className="px-6 py-2.5 text-sm font-medium text-secondary hover:text-dark border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium text-dark">{label}</label>
        {hint && <span className="text-xs text-secondary">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}

function inputCls(hasError) {
  return [
    "w-full px-4 py-2.5 rounded-xl border text-sm text-dark placeholder:text-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors",
    hasError ? "border-danger" : "border-gray-200",
  ].join(" ");
}
