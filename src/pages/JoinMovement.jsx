import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HomeParticles from "../components/sections/HomeParticles";
import { signUp } from "../firebase/auth";
import { addSupporter, createUserProfile } from "../firebase/firestore";

const GRAD = {
  background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const SPECIALTIES = [
  "Doctor", "Pharmacist", "Nurse", "Medical Student", "Pharmacy Student", "Other",
];

const INITIAL = {
  name: "", email: "", password: "", confirm: "", specialty: "", workplace: "",
};

const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } };

/* ── Shared input/select component ─────────────────────────── */
function StyledInput({ hasError, className = "", style: extStyle = {}, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      className={`w-full px-4 py-3 rounded-xl text-sm bg-white outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-900 ${className}`}
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
      className="w-full px-4 py-3 rounded-xl text-sm bg-white outline-none transition-all duration-200 text-gray-900 cursor-pointer"
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

function FormField({ label, hint, error, children }) {
  return (
    <motion.div variants={fadeUp}>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs mt-1.5 font-medium"
            style={{ color: "#EF4444" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── White shield logo for gradient header ─────────────────── */
function ShieldLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <defs>
        <clipPath id="jm-shield-clip"><path d="M14 2 L24 6.5 L24 14.5 Q24 21.5 14 26 Q4 21.5 4 14.5 L4 6.5 Z" /></clipPath>
      </defs>
      <path d="M14 2 L24 6.5 L24 14.5 Q24 21.5 14 26 Q4 21.5 4 14.5 L4 6.5 Z"
        fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.78)" strokeWidth="1.2" />
      <g clipPath="url(#jm-shield-clip)" opacity="0.72">
        <line x1="17.5" y1="13.0" x2="21.0" y2="13.0" stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="17.0" y1="14.8" x2="20.1" y2="16.5" stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="15.8" y1="16.0" x2="17.5" y2="19.1" stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="14.0" y1="16.5" x2="14.0" y2="20.0" stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="12.3" y1="16.0" x2="10.5" y2="19.1" stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="11.0" y1="14.8" x2="7.9"  y2="16.5" stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="10.5" y1="13.0" x2="7.0"  y2="13.0" stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="11.0" y1="11.3" x2="7.9"  y2="9.5"  stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="12.3" y1="10.0" x2="10.5" y2="6.9"  stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="14.0" y1="9.5"  x2="14.0" y2="6.0"  stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="15.8" y1="10.0" x2="17.5" y2="6.9"  stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="17.0" y1="11.3" x2="20.1" y2="9.5"  stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <circle cx="21.0" cy="13.0" r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="20.1" cy="16.5" r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="17.5" cy="19.1" r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="14.0" cy="20.0" r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="10.5" cy="19.1" r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="7.9"  cy="16.5" r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="7.0"  cy="13.0" r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="7.9"  cy="9.5"  r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="10.5" cy="6.9"  r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="14.0" cy="6.0"  r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="17.5" cy="6.9"  r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="20.1" cy="9.5"  r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="14" cy="13" r="3.5" fill="rgba(255,255,255,0.20)" stroke="rgba(255,255,255,0.65)" strokeWidth="0.8" />
      </g>
      <line x1="10" y1="10" x2="18" y2="19" stroke="rgba(255,120,120,0.95)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export default function JoinMovement() {
  const navigate = useNavigate();
  const [form, setForm]         = useState(INITIAL);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())                     e.name     = "Full name is required.";
    if (!form.email.trim())                    e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = "Enter a valid email address.";
    if (form.password.length < 6)              e.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirm)        e.confirm  = "Passwords do not match.";
    if (!form.specialty)                       e.specialty = "Please select your specialty.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }

    setLoading(true);
    try {
      const { user } = await signUp(form.email.trim(), form.password);
      await Promise.all([
        addSupporter(user.uid, {
          name:      form.name.trim(),
          specialty: form.specialty,
          workplace: form.workplace.trim(),
        }),
        createUserProfile(user.uid, {
          name:      form.name.trim(),
          specialty: form.specialty,
        }),
      ]);
      toast.success("Welcome to AntiResist! Your profile is live.");
      navigate(`/profile/${user.uid}`);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setErrors({ email: "This email is already registered. Sign in instead." });
      } else {
        toast.error(err.message ?? "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="relative" style={{ overflowX: "clip", minHeight: "100vh" }}>
        <HomeParticles />
        <div className="relative z-10 py-28 px-4 flex justify-center">
          <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glass card */}
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
                className="px-8 py-8"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <ShieldLogo />
                  <span className="text-white/80 text-sm font-medium tracking-wide">AntiResist Campaign</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
                  Join the movement
                </h1>
                <p className="text-white/75 text-sm leading-relaxed">
                  Add your name to the wall of healthcare professionals fighting
                  antimicrobial resistance across Egypt.
                </p>
              </div>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
                noValidate
                className="px-8 py-8 space-y-5"
                initial="hidden"
                animate="show"
                variants={stagger}
              >
                <FormField label="Full name" error={errors.name}>
                  <StyledInput
                    type="text"
                    placeholder="Dr. Ahmed Hassan"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    hasError={!!errors.name}
                  />
                </FormField>

                <FormField label="Email address" error={errors.email}>
                  <StyledInput
                    type="email"
                    placeholder="you@hospital.eg"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    hasError={!!errors.email}
                  />
                </FormField>

                <FormField label="Password" error={errors.password}>
                  <div className="relative">
                    <StyledInput
                      type={showPass ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      hasError={!!errors.password}
                      style={{ paddingRight: "3rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
                      style={{ color: "#9CA3AF" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#7C3AED"}
                      onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}
                    >
                      {showPass ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                    </button>
                  </div>
                </FormField>

                <FormField label="Confirm password" error={errors.confirm}>
                  <StyledInput
                    type="password"
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={(e) => set("confirm", e.target.value)}
                    hasError={!!errors.confirm}
                  />
                </FormField>

                <FormField label="Specialty" error={errors.specialty}>
                  <StyledSelect
                    value={form.specialty}
                    onChange={(e) => set("specialty", e.target.value)}
                    hasError={!!errors.specialty}
                  >
                    <option value="">Select your specialty…</option>
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </StyledSelect>
                </FormField>

                <FormField label="Workplace" hint="Optional" error={errors.workplace}>
                  <StyledInput
                    type="text"
                    placeholder="Hospital or institution name"
                    value={form.workplace}
                    onChange={(e) => set("workplace", e.target.value)}
                    hasError={!!errors.workplace}
                  />
                </FormField>

                {/* Submit */}
                <motion.div variants={fadeUp}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
                      boxShadow: "0 4px 20px rgba(124,58,237,0.38)",
                    }}
                    whileHover={!loading ? { scale: 1.015, boxShadow: "0 6px 28px rgba(124,58,237,0.48)" } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    transition={{ duration: 0.15 }}
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? "Creating your profile…" : "Join AntiResist"}
                  </motion.button>
                </motion.div>

                <motion.p variants={fadeUp} className="text-center text-sm text-gray-500">
                  Already registered?{" "}
                  <Link
                    to="/sign-in"
                    className="font-semibold transition-colors duration-200"
                    style={{ color: "#7C3AED" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#2563EB"}
                    onMouseLeave={e => e.currentTarget.style.color = "#7C3AED"}
                  >
                    Sign in
                  </Link>
                </motion.p>
              </motion.form>
            </div>

            {/* Tagline below card */}
            <motion.p
              className="text-center text-xs mt-5 text-gray-500"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}
            >
              🔬 Fighting AMR — one prescription at a time
            </motion.p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
