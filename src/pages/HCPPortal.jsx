import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, ShieldCheck, Activity, ChevronRight, Brain, TrendingUp, FlaskConical, Microscope } from 'lucide-react';
import ShieldScene      from '../components/portal/ShieldScene';
import FloatingParticles from '../components/portal/FloatingParticles';
import HCPDashboard    from '../components/hcp/HCPDashboard';
import AWaReSection    from '../components/hcp/AWaReSection';

const STATS = [
  { icon: Activity,     value: '700k+', label: 'AMR deaths / year globally',            color: '#EF4444' },
  { icon: TrendingUp,   value: '10M',   label: 'Projected deaths by 2050',              color: '#F97316' },
  { icon: FlaskConical, value: '<5',    label: 'New antibiotic classes since 1987',      color: '#F59E0B' },
  { icon: ShieldCheck,  value: '30%',   label: 'Antibiotic prescriptions inappropriate', color: '#10B981' },
];

const FEATURES = [
  { icon: ShieldCheck, title: 'WHO AWaRe Framework',    desc: 'Access, Watch, Reserve classification + IV-to-PO switch criteria', href: '/hcp/aware' },
  { icon: Brain,       title: 'Stewardship Challenge',  desc: '20-question clinical assessment across 4 stewardship domains',    href: '/hcp/quiz'  },
  { icon: Stethoscope, title: 'Empirical Therapy Tool', desc: 'Dynamic infection-specific antibiotic guidance with stewardship actions', href: '/hcp/tool' },
  { icon: Microscope,  title: 'Egypt Resistance Trends',desc: 'Pathogen-antibiotic resistance rates from Egyptian AMR surveillance', href: '/hcp/trends' },
];

const stagger  = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp   = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const shieldIn = {
  hidden: { opacity: 0, scale: 0.9, x: 24 },
  show:   { opacity: 1, scale: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.12 } },
};

export default function HCPPortal() {
  const sectionRef = useRef(null);

  return (
    <>
      {/* ── HERO ── */}
      <section ref={sectionRef} id="hcp-hero" className="relative min-h-screen flex flex-col overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ backgroundImage: "url('/portal-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0" style={{ background: 'rgba(7,7,26,0.62)' }} />
          <div className="absolute inset-0" style={{
            background:
              'radial-gradient(ellipse 70% 55% at 55% 40%, rgba(37,99,235,0.20) 0%, transparent 65%),' +
              'radial-gradient(ellipse 50% 60% at 20% 65%, rgba(16,185,129,0.10) 0%, transparent 55%)',
          }} />
        </div>

        {/* Mouse-reactive floating pills + bacteria */}
        <FloatingParticles containerRef={sectionRef} />

        {/* 2-column hero — text left, shield right */}
        <div className="relative flex-1 flex items-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 pt-24 lg:py-10 lg:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center w-full">

            {/* Left */}
            <motion.div className="flex flex-col items-start" initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-semibold uppercase tracking-widest"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA' }}>
                <Stethoscope size={12} />
                Healthcare Professional Portal
              </motion.div>

              <motion.h1 variants={fadeUp}
                className="text-5xl sm:text-6xl lg:text-[4.2rem] font-extrabold leading-[1.08] tracking-tight text-white mb-5">
                Stewardship
                <br />
                <motion.span
                  style={{ color: '#3B82F6' }}
                  animate={{ opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Intelligence
                </motion.span>
                <br />
                <span className="text-slate-300 font-semibold text-4xl sm:text-5xl">at Your Fingertips.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-md mb-9">
                Evidence-based antimicrobial stewardship tools for clinicians, pharmacists, and infection specialists.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <Link to="/hcp/aware"
                  className="flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-white text-sm
                    bg-gradient-to-r from-blue-600 to-blue-700
                    shadow-[0_2px_16px_rgba(37,99,235,0.28)] transition-shadow duration-300">
                  Explore AWaRe Framework
                  <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>→</motion.span>
                </Link>
                <Link to="/hcp/quiz"
                  className="px-7 py-3 rounded-full font-semibold text-blue-300 text-sm border border-blue-500/30 transition-all duration-250
                    hover:bg-blue-500/10 hover:border-blue-400/50">
                  Take the Assessment
                </Link>
              </motion.div>
            </motion.div>

            {/* Right — blue shield */}
            <motion.div
              className="relative flex items-center justify-center lg:justify-end"
              variants={shieldIn} initial="hidden" animate="show"
            >
              <ShieldScene colorScheme="blue" />
            </motion.div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            initial="hidden" animate="show" variants={stagger}
          >
            {FEATURES.map(({ icon: Icon, title, desc, href }) => (
              <Link key={title} to={href}>
                <motion.div variants={fadeUp}
                  className="glass-card rounded-2xl p-5 text-left flex flex-col gap-3 h-full transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -4, boxShadow: '0 8px 28px rgba(37,99,235,0.18), 0 0 0 1px rgba(59,130,246,0.2)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                    <Icon size={17} style={{ color: '#60A5FA' }} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">{title}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="relative w-full border-t border-blue-900/30 py-8 mt-auto"
          style={{ background: 'rgba(7,7,26,0.5)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {STATS.map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon size={18} style={{ color }} className="mb-1" />
                  <span className="text-2xl font-extrabold text-white">{value}</span>
                  <span className="text-slate-500 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AWaRe section (Prescribe Smarter, Not Broader) ── */}
      <div className="border-t border-blue-900/30" style={{ background: 'rgba(7,7,26,0.4)' }}>
        <AWaReSection />
      </div>

      {/* ── Dashboard cards (All Stewardship Resources) ── */}
      <HCPDashboard />
    </>
  );
}
