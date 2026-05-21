import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, Zap, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';

const LINKS = [
  { label: 'Learn',      href: '/portal/learn'    },
  { label: 'Quiz',       href: '/portal/quiz'     },
  { label: 'Drug Guide', href: '/portal/drugs'    },
  { label: 'Progress',   href: '/portal/progress' },
  { label: 'About',      href: '/about'           },
];

const mobileMenu = {
  hidden: { opacity: 0, height: 0, y: -8 },
  show:   { opacity: 1, height: 'auto', y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, height: 0, y: -8,
    transition: { duration: 0.2 } },
};

const linkHover = {
  color: 'rgba(255,255,255,1)',
  y: -1,
  transition: { duration: 0.15 },
};

export default function PortalNavbar() {
  const [open, setOpen] = useState(false);
  const { points } = useGamification();

  const scrollTo = (id) => {
    document.getElementById(id.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 border-b border-purple-900/40"
      style={{ background: 'rgba(10,10,28,0.80)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/portal" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.08, boxShadow: '0 0 16px rgba(138,43,226,0.7)' }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-lg bg-purple-900/60 border border-purple-500/40 flex items-center justify-center"
            >
              <Shield size={18} className="text-purple-400" />
            </motion.div>
            <span className="text-white font-bold text-lg tracking-tight">
              Anti<span className="text-purple-400">Resist</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {LINKS.map(({ label, href }) => (
              <Link key={label} to={href}>
                <motion.span
                  className="text-slate-400 text-sm font-medium block"
                  whileHover={linkHover}
                >
                  {label}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Right: points + HCP link + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div
              className="flex items-center gap-1.5 bg-purple-900/40 border border-purple-500/30
                rounded-full px-3 py-1.5 text-sm font-semibold text-purple-300"
              animate={{ boxShadow: points > 0
                ? ['0 0 0px rgba(168,85,247,0)', '0 0 14px rgba(168,85,247,0.5)', '0 0 0px rgba(168,85,247,0)']
                : '0 0 0 rgba(168,85,247,0)' }}
              transition={{ duration: 2, repeat: Infinity }}
              key={points}
            >
              <Zap size={13} className="text-purple-400" />
              <motion.span
                key={points}
                initial={{ scale: 1.4, color: '#E9D5FF' }}
                animate={{ scale: 1,   color: '#D8B4FE' }}
                transition={{ duration: 0.35 }}
              >
                {points} pts
              </motion.span>
            </motion.div>

            <Link
              to="/hcp"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA' }}
            >
              <Stethoscope size={13} />
              For Healthcare Professionals
            </Link>

            <motion.a
              href="#portal-hero"
              onClick={e => { e.preventDefault(); scrollTo('#portal-hero'); }}
              className="px-5 py-2 rounded-full text-sm font-semibold text-white
                bg-gradient-to-r from-violet-600 to-indigo-600
                shadow-[0_2px_14px_rgba(109,40,217,0.3)]"
              whileHover={{ scale: 1.06, boxShadow: '0 0 24px rgba(138,43,226,0.7)' }}
              whileTap={{ scale: 0.96 }}
            >
              Start Exploring
            </motion.a>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            className="md:hidden p-2 rounded-lg border border-purple-800/50 text-slate-400"
            onClick={() => setOpen(o => !o)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open
                ? <motion.span key="x"   initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={20} /></motion.span>
                : <motion.span key="ham" initial={{ rotate: 90, opacity: 0 }}  animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} /></motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={mobileMenu}
            initial="hidden"
            animate="show"
            exit="exit"
            className="md:hidden border-t border-purple-900/40 px-4 py-4 flex flex-col gap-3 overflow-hidden"
            style={{ background: 'rgba(10,10,28,0.97)' }}
          >
            {LINKS.map(({ label, href }, i) => (
              <Link key={label} to={href} onClick={() => setOpen(false)}>
                <motion.span
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="block text-slate-300 hover:text-purple-400 text-sm font-medium py-1 transition-colors"
                >
                  {label}
                </motion.span>
              </Link>
            ))}
            <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-purple-300 text-sm font-semibold">
                <Zap size={13} className="text-purple-400" />
                {points} pts
              </div>
              <motion.a
                href="#portal-hero"
                onClick={e => { e.preventDefault(); scrollTo('#portal-hero'); setOpen(false); }}
                className="px-4 py-2 rounded-full text-sm font-semibold text-white
                  bg-gradient-to-r from-purple-600 to-indigo-600"
                whileTap={{ scale: 0.95 }}
              >
                Start Exploring
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
