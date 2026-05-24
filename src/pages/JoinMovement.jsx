import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HomeParticles from "../components/sections/HomeParticles";
import { signUp, updateDisplayName } from "../firebase/auth";
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

/* ── Input: no framer-motion so every keystroke stays fast ── */
function StyledInput({ hasError, className = "", style: extStyle = {}, ...props }) {
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

/* Plain div field wrapper — no motion, no re-render cost on keystroke */
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

function validate({ name, email, password, confirm, specialty }) {
  const e = {};
  const tn = name.trim();
  const te = email.trim();

  if (!tn)
    e.name = "Full name is required.";
  else if (tn.length < 2)
    e.name = "Name must be at least 2 characters.";
  else if (!/^[\p{L}\s'-]+$/u.test(tn))
    e.name = "Name can only contain letters, spaces, hyphens, and apostrophes.";

  if (!te)
    e.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(te))
    e.email = "Enter a valid email address.";

  if (!password)
    e.password = "Password is required.";
  else if (password.length < 8)
    e.password = "Password must be at least 8 characters.";
  else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password))
    e.password = "Password must contain at least one letter and one number.";

  if (!confirm)
    e.confirm = "Please confirm your password.";
  else if (password !== confirm)
    e.confirm = "Passwords do not match.";

  if (!specialty)
    e.specialty = "Please select your specialty.";

  return e;
}

export default function JoinMovement() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || null;

  /* Individual state per field — changing one field only re-renders that input */
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [specialty, setSpecialty] = useState("");
  const [workplace, setWorkplace] = useState("");

  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);

  function clr(field) {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate({ name, email, password, confirm, specialty });
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { user } = await signUp(email.trim(), password);
      await updateDisplayName(user, name.trim());

      try {
        await Promise.all([
          addSupporter(user.uid, {
            name:      name.trim(),
            specialty,
            workplace: workplace.trim(),
          }),
          createUserProfile(user.uid, {
            name:      name.trim(),
            specialty,
          }),
        ]);
      } catch (fsErr) {
        console.warn("Could not save profile data:", fsErr.message);
      }

      toast.success("Welcome to AntiResist!");
      navigate(from || `/profile/${user.uid}`);
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
        <HomeParticles repel={false} />
        <div className="relative z-10 py-28 px-4 flex justify-center">
          <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
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
                  <span className="text-white/80 text-sm font-medium tracking-wide">AntiResist</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
                  Create your account
                </h1>
                <p className="text-white/75 text-sm leading-relaxed">
                  Join the fight against antimicrobial resistance. Track your learning, earn badges, and download your certificate.
                </p>
              </div>

              {/* Form — plain divs, no motion wrappers around fields */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="px-8 py-8 space-y-5"
              >
                <Field label="Full name" error={errors.name}>
                  <StyledInput
                    type="text"
                    placeholder="e.g. Ahmed Hassan"
                    value={name}
                    onChange={e => { setName(e.target.value); clr("name"); }}
                    hasError={!!errors.name}
                    autoComplete="name"
                  />
                </Field>

                <Field label="Email address" error={errors.email}>
                  <StyledInput
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); clr("email"); }}
                    hasError={!!errors.email}
                    autoComplete="email"
                  />
                </Field>

                <Field
                  label="Password"
                  hint="Min. 8 chars, letters + numbers"
                  error={errors.password}
                >
                  <div className="relative">
                    <StyledInput
                      type={showPass ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); clr("password"); }}
                      hasError={!!errors.password}
                      autoComplete="new-password"
                      style={{ paddingRight: "3rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-150"
                    >
                      {showPass ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                    </button>
                  </div>
                </Field>

                <Field label="Confirm password" error={errors.confirm}>
                  <div className="relative">
                    <StyledInput
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={confirm}
                      onChange={e => { setConfirm(e.target.value); clr("confirm"); }}
                      hasError={!!errors.confirm}
                      autoComplete="new-password"
                      style={{ paddingRight: "3rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-150"
                    >
                      {showConfirm ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                    </button>
                    {confirm && password && password === confirm && (
                      <span className="absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      </span>
                    )}
                  </div>
                </Field>

                <Field label="Specialty" error={errors.specialty}>
                  <StyledSelect
                    value={specialty}
                    onChange={e => { setSpecialty(e.target.value); clr("specialty"); }}
                    hasError={!!errors.specialty}
                  >
                    <option value="">Select your specialty…</option>
                    {SPECIALTIES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
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
                  {loading ? "Creating your account…" : "Create Account"}
                </motion.button>

                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to="/sign-in"
                    state={{ from }}
                    className="font-semibold text-purple-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>

            <motion.p
              className="text-center text-xs mt-5 text-gray-500"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}
            >
              🔬 Fighting AMR — one responsible prescription at a time
            </motion.p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
