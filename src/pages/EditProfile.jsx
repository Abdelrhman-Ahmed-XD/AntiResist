import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HomeParticles from "../components/sections/HomeParticles";
import { useAuth } from "../context/AuthContext";
import { updateDisplayName } from "../firebase/auth";
import { auth } from "../firebase/config";
import { getSupporter, updateSupporter, addSupporter, createUserProfile, updateUserProfile } from "../firebase/firestore";

const SPECIALTIES = [
  "Doctor", "Pharmacist", "Nurse", "Medical Student", "Pharmacy Student", "Other",
];

function StyledInput({ hasError, style: extStyle = {}, className = "", ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      className={`w-full px-4 py-3 rounded-xl text-sm bg-white outline-none transition-all duration-150 placeholder:text-gray-400 text-gray-900 ${className}`}
      style={{
        border: `1.5px solid ${hasError ? "#EF4444" : focused ? "#7C3AED" : "rgba(124,58,237,0.22)"}`,
        boxShadow: focused && !hasError ? "0 0 0 3px rgba(124,58,237,0.10)" : "none",
        ...extStyle,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    />
  );
}

function StyledSelect({ hasError, children, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      className="w-full px-4 py-3 rounded-xl text-sm bg-white outline-none transition-all duration-150 text-gray-900 cursor-pointer"
      style={{
        border: `1.5px solid ${hasError ? "#EF4444" : focused ? "#7C3AED" : "rgba(124,58,237,0.22)"}`,
        boxShadow: focused && !hasError ? "0 0 0 3px rgba(124,58,237,0.10)" : "none",
        appearance: "auto",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    >
      {children}
    </select>
  );
}

function StyledTextarea({ hasError, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      className="w-full px-4 py-3 rounded-xl text-sm bg-white outline-none transition-all duration-150 placeholder:text-gray-400 text-gray-900 resize-none"
      style={{
        border: `1.5px solid ${hasError ? "#EF4444" : focused ? "#7C3AED" : "rgba(124,58,237,0.22)"}`,
        boxShadow: focused && !hasError ? "0 0 0 3px rgba(124,58,237,0.10)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    />
  );
}

function Field({ label, hint, error, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            key={error}
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            className="text-xs mt-1.5 font-medium overflow-hidden"
            style={{ color: "#EF4444" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [docId,     setDocId]     = useState(null);
  const [name,      setName]      = useState("");
  const [specialty, setSpecialty] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [comment,   setComment]   = useState("");
  const [errors,    setErrors]    = useState({});
  const [fetching,  setFetching]  = useState(true);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    if (!user) return;
    let done = false;
    const timer = setTimeout(() => { if (!done) { done = true; setFetching(false); } }, 5000);

    Promise.race([
      getSupporter(user.uid),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 4800)),
    ])
      .then((data) => {
        if (!done && data) {
          setDocId(data.id);
          setName(data.name ?? "");
          setSpecialty(data.specialty ?? "");
          setWorkplace(data.workplace ?? "");
          setComment(data.comment ?? "");
        }
      })
      .catch(() => {})
      .finally(() => { done = true; clearTimeout(timer); setFetching(false); });
  }, [user]);

  function clr(field) {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!name.trim()) e.name      = "Full name is required.";
    if (!specialty)   e.specialty = "Please select your specialty.";
    return e;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSaving(true);
    try {
      const payload = {
        name:      name.trim(),
        specialty,
        workplace: workplace.trim(),
        comment:   comment.trim(),
      };

      if (docId) {
        await updateSupporter(docId, payload);
      } else {
        const ref = await addSupporter(user.uid, payload);
        setDocId(ref?.id ?? null);
      }

      // Keep userProfiles in sync (name used for certificate; setDoc+merge creates if absent)
      await updateUserProfile(user.uid, { name: payload.name, specialty: payload.specialty });
      // Always use auth.currentUser — context user may be a prototype copy without getIdToken
      if (auth.currentUser) await updateDisplayName(auth.currentUser, payload.name);

      toast.success("Profile updated.");
      navigate(`/profile/${user.uid}`);
    } catch (err) {
      console.error("EditProfile save error:", err?.code, err?.message);
      const msg = err?.code === "permission-denied"
        ? "Permission denied — Firestore rules may not be deployed yet."
        : err?.message || "Failed to save. Please try again.";
      toast.error(msg, { duration: 5000 });
    } finally {
      setSaving(false);
    }
  }

  if (fetching) {
    return (
      <>
        <Navbar />
        <div className="relative" style={{ overflowX: "clip", minHeight: "100vh" }}>
          <HomeParticles repel={false} />
          <div className="relative z-10 flex items-center justify-center" style={{ minHeight: "100vh" }}>
            <Loader2 size={32} className="animate-spin text-purple-500" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative" style={{ overflowX: "clip", minHeight: "100vh" }}>
        <HomeParticles repel={false} />
        <div className="relative z-10 py-28 px-4 flex justify-center">
          <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Back link */}
            <button
              onClick={() => navigate(`/profile/${user?.uid}`)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 mb-5 transition-colors duration-200"
            >
              <ArrowLeft size={15} strokeWidth={1.5} />
              Back to profile
            </button>

            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(124,58,237,0.18)",
                boxShadow: "0 16px 56px rgba(124,58,237,0.18), 0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              {/* Gradient header */}
              <div
                className="px-8 py-7"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)" }}
              >
                <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Edit profile</h1>
                <p className="text-white/75 text-sm leading-relaxed">
                  Changes are saved to your public supporter profile.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="px-8 py-8 space-y-5">

                <Field label="Full name" error={errors.name}>
                  <StyledInput
                    type="text"
                    placeholder="Dr. Ahmed Hassan"
                    value={name}
                    onChange={e => { setName(e.target.value); clr("name"); }}
                    hasError={!!errors.name}
                    autoComplete="name"
                  />
                </Field>

                <Field label="Specialty" error={errors.specialty}>
                  <StyledSelect
                    value={specialty}
                    onChange={e => { setSpecialty(e.target.value); clr("specialty"); }}
                    hasError={!!errors.specialty}
                  >
                    <option value="">Select your specialty…</option>
                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </StyledSelect>
                </Field>

                <Field label="Workplace" hint="Optional" error={errors.workplace}>
                  <StyledInput
                    type="text"
                    placeholder="Hospital or institution name"
                    value={workplace}
                    onChange={e => setWorkplace(e.target.value)}
                    hasError={!!errors.workplace}
                    autoComplete="organization"
                  />
                </Field>

                <Field label="Your message" hint="Optional · shown on your public profile" error={errors.comment}>
                  <StyledTextarea
                    rows={4}
                    placeholder="Why does fighting AMR matter to you?"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    hasError={!!errors.comment}
                  />
                </Field>

                <div className="flex items-center gap-3 pt-1">
                  <motion.button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
                      boxShadow: "0 4px 20px rgba(124,58,237,0.38)",
                    }}
                    whileHover={!saving ? { scale: 1.015, boxShadow: "0 6px 28px rgba(124,58,237,0.48)" } : {}}
                    whileTap={!saving ? { scale: 0.98 } : {}}
                    transition={{ duration: 0.15 }}
                  >
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} strokeWidth={1.5} />}
                    {saving ? "Saving…" : "Save changes"}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => navigate(`/profile/${user?.uid}`)}
                    className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 rounded-xl transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
