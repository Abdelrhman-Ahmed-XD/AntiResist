import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HomeParticles from "../components/sections/HomeParticles";
import { signIn } from "../firebase/auth";
import { getSupporter } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";

const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } };

function StyledInput({ hasError, className = "", ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      className={`w-full px-4 py-3 rounded-xl text-sm bg-white outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-900 ${className}`}
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

function ShieldLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <defs>
        <clipPath id="si-shield-clip"><path d="M14 2 L24 6.5 L24 14.5 Q24 21.5 14 26 Q4 21.5 4 14.5 L4 6.5 Z" /></clipPath>
      </defs>
      <path d="M14 2 L24 6.5 L24 14.5 Q24 21.5 14 26 Q4 21.5 4 14.5 L4 6.5 Z"
        fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.78)" strokeWidth="1.2" />
      <g clipPath="url(#si-shield-clip)" opacity="0.72">
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

export default function SignIn() {
  const navigate       = useNavigate();
  const { user }       = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  if (user) {
    navigate(`/profile/${user.uid}`, { replace: true });
    return null;
  }

  function validate() {
    const e = {};
    if (!email.trim()) e.email    = "Email is required.";
    if (!password)     e.password = "Password is required.";
    return e;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      const { user: u } = await signIn(email.trim(), password);
      const supporter = await getSupporter(u.uid);
      toast.success("Welcome back!");
      navigate(supporter ? `/profile/${u.uid}` : "/");
    } catch (err) {
      const code = err.code;
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        setErrors({ email: "No account found with this email." });
      } else if (code === "auth/wrong-password") {
        setErrors({ password: "Incorrect password." });
      } else if (code === "auth/too-many-requests") {
        toast.error("Too many attempts. Please wait a moment and try again.");
      } else {
        toast.error(err.message ?? "Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div
        className="relative flex items-center justify-center px-4"
        style={{ overflowX: "clip", minHeight: "100vh", paddingTop: "6rem", paddingBottom: "6rem" }}
      >
        <HomeParticles />
        <motion.div
          className="relative z-10 w-full max-w-md"
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
              <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Welcome back</h1>
              <p className="text-white/75 text-sm leading-relaxed">
                Sign in to manage your profile and campaign contribution.
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
              {/* Email */}
              <motion.div variants={fadeUp}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <StyledInput
                  type="email"
                  placeholder="you@hospital.eg"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                  hasError={!!errors.email}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="text-xs mt-1.5 font-medium" style={{ color: "#EF4444" }}
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password */}
              <motion.div variants={fadeUp}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold transition-colors duration-200"
                    style={{ color: "#7C3AED" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#2563EB"}
                    onMouseLeave={e => e.currentTarget.style.color = "#7C3AED"}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <StyledInput
                    type={showPass ? "text" : "password"}
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                    hasError={!!errors.password}
                    className="pr-12"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
                    style={{ color: "#9CA3AF" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#7C3AED"}
                    onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}
                  >
                    {showPass ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="text-xs mt-1.5 font-medium" style={{ color: "#EF4444" }}
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

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
                  {loading ? "Signing in…" : "Sign in"}
                </motion.button>
              </motion.div>

              <motion.p variants={fadeUp} className="text-center text-sm text-gray-500">
                New to AntiResist?{" "}
                <Link
                  to="/join"
                  className="font-semibold transition-colors duration-200"
                  style={{ color: "#7C3AED" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#2563EB"}
                  onMouseLeave={e => e.currentTarget.style.color = "#7C3AED"}
                >
                  Join the movement
                </Link>
              </motion.p>
            </motion.form>
          </div>

          <motion.p
            className="text-center text-xs mt-5 text-gray-500"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}
          >
            🔬 Fighting AMR — one prescription at a time
          </motion.p>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
