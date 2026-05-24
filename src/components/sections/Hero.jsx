import { useState, useEffect } from "react";
import { Users, LayoutGrid, Globe } from "lucide-react";
import { motion } from "framer-motion";
import ShieldScene from "../portal/ShieldScene";
import { getStats, incrementVisitors } from "../../firebase/firestore";

export const STATS_CACHE_KEY = 'ar_stats_v3';
const CACHE_KEY = STATS_CACHE_KEY;
const CACHE_TTL = 30 * 1000;
// Shared across StrictMode's double-invoke so both runs wait for the same increment
let _incrementPromise = null;

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch { return null; }
}

function writeCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

const fadeUp  = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.60, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.13 } } };
const shieldIn = { hidden: { opacity: 0, scale: 0.92, x: 24 }, show: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.12 } } };

const GRAD_TEXT = {
  background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

export default function Hero() {
  const [stats, setStats] = useState(() => readCache() ?? { supporters: 200, visitors: 439 });


  useEffect(() => {
    let live = true;

    // Both StrictMode runs share the same promise so both wait for the increment
    if (!_incrementPromise) {
      _incrementPromise = incrementVisitors();
    }

    _incrementPromise
      .then(() => getStats())
      .then(fresh => {
        if (!live) return;
        writeCache(fresh);
        setStats(fresh);
      });

    return () => { live = false; };
  }, []);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      {/* Decorative pill shapes */}
      <svg className="absolute top-10 right-[45%] opacity-20 pointer-events-none" width="32" height="60" viewBox="0 0 32 60" aria-hidden="true">
        <defs>
          <linearGradient id="pill-g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="30" height="58" rx="15" fill="url(#pill-g1)" />
      </svg>
      <svg className="absolute bottom-24 left-[42%] opacity-15 pointer-events-none rotate-45" width="22" height="42" viewBox="0 0 22 42" aria-hidden="true">
        <defs>
          <linearGradient id="pill-g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="20" height="40" rx="10" fill="url(#pill-g2)" />
      </svg>
      <svg className="absolute top-32 left-[10%] opacity-10 pointer-events-none -rotate-12" width="18" height="36" viewBox="0 0 18 36" aria-hidden="true">
        <defs>
          <linearGradient id="pill-g3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="16" height="34" rx="8" fill="url(#pill-g3)" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — text */}
          <motion.div
            className="flex flex-col gap-6"
            variants={stagger} initial="hidden" animate="show"
          >
            {/* Badge chip */}
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 self-start text-sm font-semibold px-4 py-1.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(37,99,235,0.12) 100%)",
                border: "1px solid rgba(124,58,237,0.25)",
                ...GRAD_TEXT,
              }}
            >
              🔬 Awareness Campaign
            </motion.span>

            {/* Heading */}
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl font-semibold text-gray-900 leading-tight tracking-tight">
              Join the fight against{" "}
              <span style={GRAD_TEXT}>antibiotic resistance</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={fadeUp} className="text-lg text-secondary leading-relaxed max-w-lg">
              Dedicated portals for patients and healthcare professionals, built to educate,
              empower, and equip the fight against antimicrobial resistance in Egypt.
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo("portals")}
                className="inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)", boxShadow: "0 4px 20px rgba(124,58,237,0.32)" }}
              >
                <LayoutGrid size={17} strokeWidth={1.8} />
                Explore Portals
              </button>
              <button
                onClick={() => scrollTo("what-is-amr")}
                className="inline-flex items-center justify-center font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "rgba(124,58,237,0.10)", border: "1.5px solid rgba(124,58,237,0.55)", color: "#6D28D9" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.18)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.80)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.10)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.55)"; }}
              >
                Learn More
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(37,99,235,0.08) 100%)",
                  border: "1px solid rgba(124,58,237,0.18)",
                  color: "#6B7280",
                }}
              >
                <Users size={15} strokeWidth={1.5} style={{ color: "#7C3AED" }} />
                <span><strong style={{ color: "#374151" }}>{stats.supporters.toLocaleString()}+</strong> healthcare professionals</span>
              </span>
              <span
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium"
                style={{
                  background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.08) 100%)",
                  border: "1px solid rgba(37,99,235,0.18)",
                  color: "#6B7280",
                }}
              >
                <Globe size={15} strokeWidth={1.5} style={{ color: "#2563EB" }} />
                <span><strong style={{ color: "#374151" }}>{stats.visitors.toLocaleString()}+</strong> website visitors</span>
              </span>
            </motion.div>
          </motion.div>

          {/* Right — ShieldScene */}
          <motion.div
            className="relative flex items-center justify-center"
            variants={shieldIn} initial="hidden" animate="show"
          >
            <ShieldScene colorScheme="split" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
