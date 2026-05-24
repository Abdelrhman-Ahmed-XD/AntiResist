import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, LogIn, LogOut, Home, Menu, X, Stethoscope } from 'lucide-react';
import { useHCPScore } from '../../context/HCPScoreContext';
import { useAuth } from '../../context/AuthContext';
import { signOut } from '../../firebase/auth';

function NavShieldIcon() {
  const CX = 260, CY = 210, R_BODY = 44, R_SPK = 78, R_TIP = 7.5;
  const spikes = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return {
      x1: CX + Math.cos(a) * R_BODY, y1: CY + Math.sin(a) * R_BODY,
      x2: CX + Math.cos(a) * R_SPK,  y2: CY + Math.sin(a) * R_SPK,
      tx: CX + Math.cos(a) * (R_SPK + R_TIP + 2),
      ty: CY + Math.sin(a) * (R_SPK + R_TIP + 2),
    };
  });
  const slashOff = (R_SPK + R_TIP + 4) * 0.707;

  return (
    <svg width="22" height="28" viewBox="90 8 340 412" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="hsh-fill" cx="38%" cy="28%">
          <stop offset="0%"   stopColor="#1D4ED8" stopOpacity="0.52" />
          <stop offset="55%"  stopColor="#1E3A8A" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#172554" stopOpacity="0.14" />
        </radialGradient>
        <linearGradient id="hsh-border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#BFDBFE" />
          <stop offset="50%"  stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <radialGradient id="hsh-corona" cx="35%" cy="30%">
          <stop offset="0%"   stopColor="#60A5FA" />
          <stop offset="55%"  stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </radialGradient>
      </defs>
      <path d="M260,18 L415,85 L415,210 Q415,335 260,408 Q105,335 105,210 L105,85 Z"
        fill="url(#hsh-fill)" />
      <path d="M260,18 L415,85 L415,210 Q415,335 260,408 Q105,335 105,210 L105,85 Z"
        fill="none" stroke="url(#hsh-border)" strokeWidth="5" />
      {spikes.map((s, i) => (
        <g key={i}>
          <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke="#93C5FD" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx={s.tx} cy={s.ty} r={R_TIP} fill="#BFDBFE" opacity="0.88" />
        </g>
      ))}
      <circle cx={CX} cy={CY} r={R_BODY}
        fill="url(#hsh-corona)" stroke="#60A5FA" strokeWidth="3.6" />
      <circle cx={CX} cy={CY} r="19"
        fill="rgba(37,99,235,0.55)" stroke="rgba(147,197,253,0.28)" strokeWidth="2" />
      <circle cx={CX} cy={CY} r="7.5" fill="rgba(191,219,254,0.75)" />
      <line
        x1={CX - slashOff} y1={CY - slashOff}
        x2={CX + slashOff} y2={CY + slashOff}
        stroke="rgba(239,68,68,0.90)" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

const NAV = [
  { label: 'AWaRe',        href: '/hcp/aware'    },
  { label: 'Quiz',         href: '/hcp/quiz'     },
  { label: 'Support Tool', href: '/hcp/tool'     },
  { label: 'Trends',       href: '/hcp/trends'   },
  { label: 'My Progress',  href: '/hcp/progress' },
];

const mobileMenu = {
  hidden: { opacity: 0, height: 0, y: -8 },
  show:   { opacity: 1, height: 'auto', y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, height: 0, y: -8,
    transition: { duration: 0.2 } },
};

function UserAvatar({ user, size = 6 }) {
  const initial = (user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase();
  if (user.photoURL) {
    return <img src={user.photoURL} alt="Profile" className={`w-${size} h-${size} rounded-full object-cover shrink-0`} />;
  }
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}
      style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}
    >
      {initial}
    </div>
  );
}

export default function HCPNavbar() {
  const [open, setOpen] = useState(false);
  const { score = 0, completed = false } = useHCPScore() ?? {};
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Profile';

  async function handleLogout() {
    await signOut();
    navigate('/');
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-blue-900/40"
      style={{ background: 'rgba(7,7,26,0.82)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/hcp" className="flex items-center gap-2 text-white font-bold text-sm">
            <NavShieldIcon />
            <span>Anti<span style={{ color: '#3B82F6' }}>Resist</span></span>
            <span className="text-xs px-2 py-0.5 rounded-full ml-1 hidden sm:inline"
              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA' }}>
              Healthcare Professional
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/"
              className="flex items-center gap-1 text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
              <Home size={13} /> Home
            </Link>
            {NAV.map(({ label, href }) => (
              <Link key={href} to={href}
                className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
                {label}
              </Link>
            ))}
          </div>

          {/* Right: Score + Patient Portal + profile/logout */}
          <div className="hidden md:flex items-center gap-2">
            <motion.div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA' }}
              animate={{ boxShadow: completed
                ? ['0 0 0px rgba(59,130,246,0)', '0 0 14px rgba(59,130,246,0.5)', '0 0 0px rgba(59,130,246,0)']
                : '0 0 0 rgba(59,130,246,0)' }}
              transition={{ duration: 2, repeat: Infinity }}
              key={score}
            >
              <Award size={13} style={{ color: '#60A5FA' }} />
              <motion.span
                key={score}
                initial={{ scale: 1.4, color: '#BFDBFE' }}
                animate={{ scale: 1,   color: '#93C5FD' }}
                transition={{ duration: 0.35 }}
              >
                {score} pts
              </motion.span>
            </motion.div>

            <Link to="/portal"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-200"
              style={{ background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.28)', color: '#A78BFA' }}>
              <Stethoscope size={12} />
              Patient Portal
            </Link>

            {user ? (
              <>
                <Link
                  to={`/profile/${user.uid}?from=hcp`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
                  style={{ background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.28)' }}
                >
                  <UserAvatar user={user} size={6} />
                  <span className="text-blue-300 text-xs max-w-[70px] truncate">{displayName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', color: '#FCA5A5' }}
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/sign-in"
                state={{ from: location.pathname }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={{ background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.28)', color: '#93C5FD' }}
              >
                <LogIn size={13} />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <motion.button
            className="md:hidden p-2 rounded-lg border border-blue-800/50 text-slate-400"
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
            className="md:hidden border-t border-blue-900/40 px-4 py-4 flex flex-col gap-3 overflow-hidden"
            style={{ background: 'rgba(7,7,26,0.97)' }}
          >
            <Link to="/" onClick={() => setOpen(false)}>
              <motion.span
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-slate-300 hover:text-blue-400 text-sm font-medium py-1 transition-colors"
              >
                <Home size={14} /> Home
              </motion.span>
            </Link>

            {NAV.map(({ label, href }, i) => (
              <Link key={label} to={href} onClick={() => setOpen(false)}>
                <motion.span
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (i + 1) * 0.06 }}
                  className="block text-slate-300 hover:text-blue-400 text-sm font-medium py-1 transition-colors"
                >
                  {label}
                </motion.span>
              </Link>
            ))}

            <div className="pt-2 border-t border-blue-900/40 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-blue-300 text-sm font-semibold">
                  <Award size={13} style={{ color: '#60A5FA' }} />
                  {score} pts
                </div>
                <Link to="/portal" onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.28)', color: '#A78BFA' }}>
                  <Stethoscope size={12} />
                  Patient Portal
                </Link>
              </div>

              {user ? (
                <>
                  <Link to={`/profile/${user.uid}?from=hcp`} onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.28)' }}>
                    <UserAvatar user={user} size={6} />
                    <span className="text-blue-300 truncate max-w-[160px]">{displayName}</span>
                  </Link>
                  <button
                    onClick={() => { setOpen(false); handleLogout(); }}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', color: '#FCA5A5' }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </>
              ) : (
                <Link to="/sign-in" state={{ from: location.pathname }} onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.28)', color: '#93C5FD' }}>
                  <LogIn size={14} />
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
