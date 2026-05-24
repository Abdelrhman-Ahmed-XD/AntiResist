import { motion } from "framer-motion";
import { Target, Eye, HeartHandshake, Shield } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HomeParticles from "../components/sections/HomeParticles";

const FACEBOOK_URL = "https://www.facebook.com/share/1BfcnpPXWD/";

const GRAD_TEXT = {
  background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

function FacebookIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

const CARDS = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To raise awareness about antimicrobial resistance (AMR) among both patients and healthcare professionals, and encourage the responsible use of antibiotics through education, interaction, and stewardship awareness.",
    accent: "#7C3AED",
    iconBg: "rgba(124,58,237,0.10)",
    iconBorder: "rgba(124,58,237,0.22)",
  },
  {
    icon: Eye,
    title: "Our Vision",
    desc: "A future where antibiotics are used wisely, patients are better informed, and healthcare professionals work together to reduce antimicrobial resistance and protect effective treatment for future generations.",
    accent: "#2563EB",
    iconBg: "rgba(37,99,235,0.10)",
    iconBorder: "rgba(37,99,235,0.22)",
  },
  {
    icon: HeartHandshake,
    title: "Our Approach",
    desc: "We combine interactive learning, stewardship awareness, and community engagement to help patients and healthcare professionals make safer, evidence-based decisions about antibiotic use.",
    accent: "#0891B2",
    iconBg: "rgba(8,145,178,0.10)",
    iconBorder: "rgba(8,145,178,0.22)",
  },
];

const fadeUp  = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.13 } } };

const GLASS = {
  background: "rgba(255,255,255,0.86)",
  backdropFilter: "blur(22px)",
  WebkitBackdropFilter: "blur(22px)",
  border: "1px solid rgba(124,58,237,0.14)",
  boxShadow: "0 8px 36px rgba(124,58,237,0.09), 0 2px 8px rgba(0,0,0,0.04)",
};

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <div className="relative" style={{ overflowX: "clip", minHeight: "100vh" }}>
        <HomeParticles repel={false} />

        <main className="relative z-10 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">

            {/* ── Hero ─────────────────────────────────────────────── */}
            <motion.div
              className="text-center mb-20"
              variants={stagger} initial="hidden" animate="show"
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
                style={{ background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.26)", ...GRAD_TEXT }}
              >
                <Shield size={14} strokeWidth={1.8} />
                About AntiResist
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-5xl sm:text-6xl font-semibold leading-tight tracking-tight mb-6"
                style={{ color: "#1A2233" }}
              >
                Fighting AMR{" "}
                <span style={GRAD_TEXT}>together</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg leading-relaxed max-w-2xl mx-auto mb-10"
                style={{ color: "#6B7280" }}
              >
                AntiResist is a healthcare awareness platform dedicated to promoting rational antibiotic use
                and empowering both patients and healthcare professionals to tackle antimicrobial resistance across Egypt.
              </motion.p>

            </motion.div>

            {/* ── Mission / Vision / Approach ──────────────────────── */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14"
              variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}
            >
              {CARDS.map(({ icon: Icon, title, desc, accent, iconBg, iconBorder }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="rounded-2xl p-8 flex flex-col"
                  style={GLASS}
                  whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(124,58,237,0.14), 0 2px 8px rgba(0,0,0,0.05)" }}
                  transition={{ duration: 0.25 }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 shrink-0"
                    style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
                  >
                    <Icon size={22} strokeWidth={1.5} style={{ color: accent }} />
                  </div>
                  <h3 className="text-base font-bold mb-3" style={{ color: "#1A2233" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* ── Facebook CTA ──────────────────────────────────────── */}
            <motion.div
              className="rounded-3xl p-10 sm:p-14 text-center"
              style={GLASS}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{ background: "rgba(24,119,242,0.10)", border: "1px solid rgba(24,119,242,0.28)" }}
              >
                <FacebookIcon size={28} color="#1877F2" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ color: "#1A2233" }}>
                Stay connected with us
              </h2>
              <p className="text-sm leading-relaxed max-w-lg mx-auto mb-8" style={{ color: "#6B7280" }}>
                Follow AntiResist on Facebook to stay up to date with our latest awareness campaigns,
                educational content, and community updates from across Egypt.
              </p>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #1877F2 0%, #0D6EFD 100%)", boxShadow: "0 4px 20px rgba(24,119,242,0.38)" }}
              >
                <FacebookIcon size={16} color="white" />
                Follow on Facebook
              </a>
            </motion.div>

          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
