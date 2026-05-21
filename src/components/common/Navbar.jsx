import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Pill, Globe, HeartHandshake,
  Users, Info, LogIn, Menu, X, Stethoscope,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { icon: Shield,         label: "What is AMR",  href: "#what-is-amr",  scroll: true },
  { icon: Pill,           label: "Rational Use",  href: "#rational-use", scroll: true },
  { icon: Globe,          label: "Impact",        href: "#impact",       scroll: true },
  { icon: HeartHandshake, label: "How to Help",   href: "#how-to-help",  scroll: true },
  { icon: Info,           label: "About",         href: "/about",        scroll: false },
];

function scrollTo(id) {
  document.getElementById(id.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
}

function scrollToTop() {
  const start = window.scrollY;
  if (start === 0) return;
  const duration = 650;
  const startTime = performance.now();
  const ease = (t) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, start * (1 - ease(progress)));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const GRAD_TEXT = {
  background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

function NavItem({ icon: Icon, label, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative flex flex-col items-center gap-0.5 cursor-pointer outline-none"
      whileTap={{ scale: 0.93 }}
    >
      <motion.div animate={{ color: hovered ? "#7C3AED" : "#6B7280" }} transition={{ duration: 0.2 }}>
        <Icon size={17} strokeWidth={1.6} />
      </motion.div>
      <motion.span
        className="text-xs font-medium"
        animate={hovered ? GRAD_TEXT : { color: "#6B7280", WebkitTextFillColor: "#6B7280" }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
      <motion.span
        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
        style={{ background: "linear-gradient(90deg, #7C3AED, #2563EB)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.button>
  );
}

const mobileMenu = {
  hidden: { opacity: 0, height: 0, y: -8 },
  show:   { opacity: 1, height: "auto", y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, height: 0, y: -8, transition: { duration: 0.2 } },
};

function UserAvatar({ user, size = 7 }) {
  const initial = (user.displayName?.[0] || user.email?.[0] || "U").toUpperCase();
  if (user.photoURL) {
    return <img src={user.photoURL} alt="Profile" className={`w-${size} h-${size} rounded-full object-cover shrink-0`} />;
  }
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}
      style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
    >
      {initial}
    </div>
  );
}

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavClick(link) {
    setMenuOpen(false);
    if (link.scroll) {
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => scrollTo(link.href), 100);
      } else {
        scrollTo(link.href);
      }
    }
  }

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Profile";

  const navBg = scrolled
    ? "linear-gradient(to right, rgba(240,233,255,0.66) 0%, rgba(233,241,255,0.66) 100%)"
    : "linear-gradient(to right, rgba(240,233,255,0.88) 0%, rgba(233,241,255,0.88) 100%)";

  return (
    <motion.nav
      className="sticky top-0 z-50 border-b transition-all duration-300"
      animate={{
        borderColor: scrolled ? "rgba(124,58,237,0.18)" : "rgba(124,58,237,0.10)",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.10), 0 1px 0 rgba(124,58,237,0.08)" : "0 1px 8px rgba(0,0,0,0.06)",
      }}
      style={{
        background: navBg,
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">

          {/* ── Logo ───────────────────────────────── */}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="shrink-0">
            <Link to="/" className="flex items-center gap-2" onClick={scrollToTop}>
              <motion.div
                whileHover={{ filter: "drop-shadow(0 0 10px rgba(124,58,237,0.65))" }}
                transition={{ duration: 0.25 }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <defs>
                    <clipPath id="nav-shield-left"><rect x="0" y="0" width="14" height="28" /></clipPath>
                    <clipPath id="nav-shield-right"><rect x="14" y="0" width="14" height="28" /></clipPath>
                    <clipPath id="nav-shield-inner"><path d="M14 2 L24 6.5 L24 14.5 Q24 21.5 14 26 Q4 21.5 4 14.5 L4 6.5 Z" /></clipPath>
                    <linearGradient id="nav-shield-border" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#A78BFA" />
                      <stop offset="100%" stopColor="#60A5FA" />
                    </linearGradient>
                  </defs>
                  {/* Purple left half */}
                  <path d="M14 2 L24 6.5 L24 14.5 Q24 21.5 14 26 Q4 21.5 4 14.5 L4 6.5 Z"
                    fill="#7C3AED" fillOpacity="0.82" clipPath="url(#nav-shield-left)" />
                  {/* Blue right half */}
                  <path d="M14 2 L24 6.5 L24 14.5 Q24 21.5 14 26 Q4 21.5 4 14.5 L4 6.5 Z"
                    fill="#2563EB" fillOpacity="0.82" clipPath="url(#nav-shield-right)" />
                  {/* Gradient outline */}
                  <path d="M14 2 L24 6.5 L24 14.5 Q24 21.5 14 26 Q4 21.5 4 14.5 L4 6.5 Z"
                    fill="none" stroke="url(#nav-shield-border)" strokeWidth="1.2" />
                  {/* Corona bacteria inside shield (12 spikes + knob tips) */}
                  <g clipPath="url(#nav-shield-inner)" opacity="0.72">
                    <line x1="17.5" y1="13.0" x2="21.0" y2="13.0" stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                    <line x1="17.0" y1="14.8" x2="20.1" y2="16.5" stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                    <line x1="15.8" y1="16.0" x2="17.5" y2="19.1" stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                    <line x1="14.0" y1="16.5" x2="14.0" y2="20.0" stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                    <line x1="12.3" y1="16.0" x2="10.5" y2="19.1" stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                    <line x1="11.0" y1="14.8" x2="7.9"  y2="16.5" stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                    <line x1="10.5" y1="13.0" x2="7.0"  y2="13.0" stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                    <line x1="11.0" y1="11.3" x2="7.9"  y2="9.5"  stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                    <line x1="12.3" y1="10.0" x2="10.5" y2="6.9"  stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                    <line x1="14.0" y1="9.5"  x2="14.0" y2="6.0"  stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                    <line x1="15.8" y1="10.0" x2="17.5" y2="6.9"  stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                    <line x1="17.0" y1="11.3" x2="20.1" y2="9.5"  stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                    <circle cx="21.0" cy="13.0" r="1.0" fill="rgba(255,255,255,0.72)" />
                    <circle cx="20.1" cy="16.5" r="1.0" fill="rgba(255,255,255,0.72)" />
                    <circle cx="17.5" cy="19.1" r="1.0" fill="rgba(255,255,255,0.72)" />
                    <circle cx="14.0" cy="20.0" r="1.0" fill="rgba(255,255,255,0.72)" />
                    <circle cx="10.5" cy="19.1" r="1.0" fill="rgba(255,255,255,0.72)" />
                    <circle cx="7.9"  cy="16.5" r="1.0" fill="rgba(255,255,255,0.72)" />
                    <circle cx="7.0"  cy="13.0" r="1.0" fill="rgba(255,255,255,0.72)" />
                    <circle cx="7.9"  cy="9.5"  r="1.0" fill="rgba(255,255,255,0.72)" />
                    <circle cx="10.5" cy="6.9"  r="1.0" fill="rgba(255,255,255,0.72)" />
                    <circle cx="14.0" cy="6.0"  r="1.0" fill="rgba(255,255,255,0.72)" />
                    <circle cx="17.5" cy="6.9"  r="1.0" fill="rgba(255,255,255,0.72)" />
                    <circle cx="20.1" cy="9.5"  r="1.0" fill="rgba(255,255,255,0.72)" />
                    <circle cx="14" cy="13" r="3.5" fill="rgba(255,255,255,0.20)" stroke="rgba(255,255,255,0.65)" strokeWidth="0.8" />
                  </g>
                  {/* No-bacteria prohibition slash */}
                  <line x1="10" y1="10" x2="18" y2="19"
                    stroke="rgba(239,68,68,0.88)" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </motion.div>
              <span className="text-xl font-bold tracking-tight">
                <span style={{ color: "#7C3AED" }}>Anti</span>
                <span style={{ color: "#2563EB" }}>Resist</span>
              </span>
            </Link>
          </motion.div>

          {/* ── Nav links — center ──────────────────── */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-7">
            {NAV_LINKS.map(({ icon, label, href, scroll }) => (
              <NavItem
                key={label}
                icon={icon}
                label={label}
                onClick={() => scroll ? handleNavClick({ href, scroll }) : navigate(href)}
              />
            ))}
          </div>

          {/* ── Right CTAs ──────────────────────────── */}
          <div className="hidden md:flex items-center gap-2 shrink-0">

            {/* Patient Portal */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link to="/portal"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{ background: "rgba(124,58,237,0.14)", border: "1px solid rgba(124,58,237,0.35)", color: "#7C3AED" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.24)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.14)"; }}
              >
                <Stethoscope size={13} strokeWidth={1.6} />
                Patient Portal
              </Link>
            </motion.div>

            {/* Healthcare Professional */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link to="/hcp"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{ background: "rgba(37,99,235,0.14)", border: "1px solid rgba(37,99,235,0.35)", color: "#2563EB" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(37,99,235,0.24)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(37,99,235,0.14)"; }}
              >
                <Users size={13} strokeWidth={1.6} />
                Healthcare Pro
              </Link>
            </motion.div>

            {/* Auth-conditional */}
            {user ? (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to={`/profile/${user.uid}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200"
                  style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.22)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.12)"; }}
                >
                  <UserAvatar user={user} size={6} />
                  <span className="text-xs font-semibold max-w-[80px] truncate" style={{ color: "#7C3AED" }}>
                    {displayName}
                  </span>
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.04, boxShadow: "0 4px 18px rgba(124,58,237,0.38)" }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Link to="/join"
                    className="text-xs font-semibold px-4 py-1.5 rounded-lg text-white transition-all duration-300"
                    style={{ background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, #6D28D9 0%, #1D4ED8 100%)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)"; }}
                  >
                    Join the Movement
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/sign-in"
                    className="flex items-center gap-1 text-xs font-semibold transition-colors duration-200"
                    style={{ color: "#5B21B6" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#2563EB"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#5B21B6"; }}
                  >
                    <LogIn size={14} strokeWidth={1.6} />
                    Login
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ────────────────────── */}
          <motion.button
            className="md:hidden ml-auto p-2 rounded-xl border border-purple-300/60"
            onClick={() => setMenuOpen(o => !o)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen
                ? <motion.span key="x"   initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90,  opacity: 0 }} transition={{ duration: 0.15 }}><X    size={20} /></motion.span>
                : <motion.span key="ham" initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} /></motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={mobileMenu} initial="hidden" animate="show" exit="exit"
            className="md:hidden border-t border-purple-200/50 px-4 py-4 flex flex-col gap-3 overflow-hidden"
            style={{ background: "linear-gradient(to right, rgba(191,168,255,0.97), rgba(168,196,255,0.97))", backdropFilter: "blur(22px)" }}
          >
            {NAV_LINKS.map(({ icon: Icon, label, href, scroll }, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setMenuOpen(false);
                  if (scroll) {
                    if (window.location.pathname !== "/") {
                      navigate("/");
                      setTimeout(() => scrollTo(href), 420);
                    } else {
                      setTimeout(() => scrollTo(href), 280);
                    }
                  } else {
                    navigate(href);
                  }
                }}
                className="flex items-center gap-3 text-sm font-medium text-gray-700 py-1 text-left transition-colors duration-200"
                onMouseEnter={e => e.currentTarget.style.color = "#7C3AED"}
                onMouseLeave={e => e.currentTarget.style.color = "#374151"}
              >
                <Icon size={17} strokeWidth={1.5} />
                {label}
              </motion.button>
            ))}
            <div className="pt-2 border-t border-purple-200/50 flex flex-col gap-2">
              <Link to="/portal" onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #7C3AED, #6366F1)" }}>
                <Stethoscope size={14} /> Patient Portal
              </Link>
              <Link to="/hcp" onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #2563EB, #0EA5E9)" }}>
                <Users size={14} /> Healthcare Professional
              </Link>
              {user ? (
                <Link to={`/profile/${user.uid}`} onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.28)", color: "#7C3AED" }}>
                  <UserAvatar user={user} size={6} /> {displayName}
                </Link>
              ) : (
                <>
                  <Link to="/join" onClick={() => setMenuOpen(false)}
                    className="py-2.5 rounded-xl text-sm font-semibold text-white text-center"
                    style={{ background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)" }}>
                    Join the Movement
                  </Link>
                  <Link to="/sign-in" onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 py-2.5 rounded-xl border border-purple-200/60 transition-all duration-200"
                    onMouseEnter={e => { e.currentTarget.style.color = "#7C3AED"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#374151"; }}
                  >
                    <LogIn size={16} /> Login
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
