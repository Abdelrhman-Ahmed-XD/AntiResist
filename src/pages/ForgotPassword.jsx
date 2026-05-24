import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HomeParticles from "../components/sections/HomeParticles";
import { resetPassword } from "../firebase/auth";

const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } };

function StyledInput({ hasError, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      className="w-full px-4 py-3 rounded-xl text-sm bg-white outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-900"
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
        <clipPath id="fp-shield-clip"><path d="M14 2 L24 6.5 L24 14.5 Q24 21.5 14 26 Q4 21.5 4 14.5 L4 6.5 Z" /></clipPath>
      </defs>
      <path d="M14 2 L24 6.5 L24 14.5 Q24 21.5 14 26 Q4 21.5 4 14.5 L4 6.5 Z"
        fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.78)" strokeWidth="1.2" />
      <g clipPath="url(#fp-shield-clip)" opacity="0.72">
        <line x1="17.5" y1="13.0" x2="21.0" y2="13.0" stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="14.0" y1="16.5" x2="14.0" y2="20.0" stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="10.5" y1="13.0" x2="7.0"  y2="13.0" stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="14.0" y1="9.5"  x2="14.0" y2="6.0"  stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="17.0" y1="14.8" x2="20.1" y2="16.5" stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="11.0" y1="14.8" x2="7.9"  y2="16.5" stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="11.0" y1="11.3" x2="7.9"  y2="9.5"  stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="17.0" y1="11.3" x2="20.1" y2="9.5"  stroke="rgba(255,255,255,0.65)" strokeWidth="0.7" strokeLinecap="round" />
        <circle cx="21.0" cy="13.0" r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="7.0"  cy="13.0" r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="14.0" cy="6.0"  r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="14.0" cy="20.0" r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="20.1" cy="16.5" r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="7.9"  cy="16.5" r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="7.9"  cy="9.5"  r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="20.1" cy="9.5"  r="1.0" fill="rgba(255,255,255,0.78)" />
        <circle cx="14" cy="13" r="3.5" fill="rgba(255,255,255,0.20)" stroke="rgba(255,255,255,0.65)" strokeWidth="0.8" />
      </g>
      <line x1="10" y1="10" x2="18" y2="19" stroke="rgba(255,120,120,0.95)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export default function ForgotPassword() {
  const [email, setEmail]   = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address."); return; }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else {
        toast.error("Could not send reset email. Please try again.");
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
        <HomeParticles repel={false} />
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
              <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Reset your password</h1>
              <p className="text-white/75 text-sm leading-relaxed">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {sent ? (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="px-8 py-10 flex flex-col items-center text-center gap-4"
                >
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.1 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(37,99,235,0.12))", border: "1.5px solid rgba(124,58,237,0.25)" }}
                  >
                    <Mail size={28} strokeWidth={1.5} style={{ color: "#7C3AED" }} />
                  </motion.div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Check your inbox</h2>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      We've sent a password reset link to{" "}
                      <span className="font-semibold text-gray-700">{email}</span>.
                      Check your spam folder if you don't see it.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <CheckCircle size={15} style={{ color: "#22C55E" }} />
                    <span className="text-sm text-gray-400">Email sent successfully</span>
                  </div>

                  <Link
                    to="/sign-in"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
                    style={{ color: "#7C3AED" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#2563EB"}
                    onMouseLeave={e => e.currentTarget.style.color = "#7C3AED"}
                  >
                    <ArrowLeft size={14} strokeWidth={2} />
                    Back to sign in
                  </Link>
                </motion.div>
              ) : (
                /* ── Form state ── */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  className="px-8 py-8 space-y-5"
                  initial="hidden"
                  animate="show"
                  variants={stagger}
                >
                  <motion.div variants={fadeUp}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Email address
                    </label>
                    <StyledInput
                      type="email"
                      placeholder="you@hospital.eg"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      hasError={!!error}
                    />
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                          className="text-xs mt-1.5 font-medium" style={{ color: "#EF4444" }}
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

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
                      {loading ? "Sending reset link…" : "Send reset link"}
                    </motion.button>
                  </motion.div>

                  <motion.div variants={fadeUp} className="text-center">
                    <Link
                      to="/sign-in"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
                      style={{ color: "#7C3AED" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#2563EB"}
                      onMouseLeave={e => e.currentTarget.style.color = "#7C3AED"}
                    >
                      <ArrowLeft size={14} strokeWidth={2} />
                      Back to sign in
                    </Link>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
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
