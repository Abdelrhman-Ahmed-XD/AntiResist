import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Stethoscope, LogIn, LogOut, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from '../../firebase/auth';
import { useGamification } from '../../context/GamificationContext';
import { useAuth } from '../../context/AuthContext';

function UserAvatar({ user, size = 6 }) {
  const initial = (user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase();
  if (user.photoURL) {
    return <img src={user.photoURL} alt="Profile" className={`w-${size} h-${size} rounded-full object-cover shrink-0`} />;
  }
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}
      style={{ background: 'linear-gradient(135deg, #A78BFA, #6D28D9)' }}
    >
      {initial}
    </div>
  );
}

/* Mini replica of the ShieldScene hero icon */
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
        <radialGradient id="nsh-fill" cx="38%" cy="28%">
          <stop offset="0%"   stopColor="#6D28D9" stopOpacity="0.52" />
          <stop offset="55%"  stopColor="#3B0764" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#1E0B4E" stopOpacity="0.14" />
        </radialGradient>
        <linearGradient id="nsh-border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#DDD6FE" />
          <stop offset="50%"  stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <radialGradient id="nsh-corona" cx="35%" cy="30%">
          <stop offset="0%"   stopColor="#A78BFA" />
          <stop offset="55%"  stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#3B0764" />
        </radialGradient>
      </defs>
      {/* Shield body */}
      <path d="M260,18 L415,85 L415,210 Q415,335 260,408 Q105,335 105,210 L105,85 Z"
        fill="url(#nsh-fill)" />
      <path d="M260,18 L415,85 L415,210 Q415,335 260,408 Q105,335 105,210 L105,85 Z"
        fill="none" stroke="url(#nsh-border)" strokeWidth="5" />
      {/* Corona spikes */}
      {spikes.map((s, i) => (
        <g key={i}>
          <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke="#C4B5FD" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx={s.tx} cy={s.ty} r={R_TIP} fill="#DDD6FE" opacity="0.88" />
        </g>
      ))}
      {/* Corona body */}
      <circle cx={CX} cy={CY} r={R_BODY}
        fill="url(#nsh-corona)" stroke="#A78BFA" strokeWidth="3.6" />
      <circle cx={CX} cy={CY} r="19"
        fill="rgba(109,40,217,0.55)" stroke="rgba(196,181,253,0.28)" strokeWidth="2" />
      <circle cx={CX} cy={CY} r="7.5" fill="rgba(196,181,253,0.75)" />
      {/* Red prohibition slash */}
      <line
        x1={CX - slashOff} y1={CY - slashOff}
        x2={CX + slashOff} y2={CY + slashOff}
        stroke="rgba(239,68,68,0.90)" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

const LINKS = [
  { label: 'Learn',            href: '/portal/learn'    },
  { label: 'Symptom Checker',  href: '/portal/symptoms' },
  { label: 'Quiz',             href: '/portal/quiz'     },
  { label: 'Drugs',            href: '/portal/drugs'    },
  { label: 'Progress',         href: '/portal/progress' },
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
  const { points = 0 } = useGamification() ?? {};
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const displayName = user?.displayName || 'Profile';

  async function handleLogout() {
    await signOut();
    navigate('/');
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-purple-900/40"
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
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <NavShieldIcon />
            </motion.div>
            <span className="text-white font-bold text-lg tracking-tight">
              Anti<span className="text-purple-400">Resist</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/">
              <motion.span
                className="text-slate-400 text-sm font-medium flex items-center gap-1"
                whileHover={linkHover}
              >
                <Home size={13} />
                Home
              </motion.span>
            </Link>
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

          {/* Right: points + HCP + profile/logout */}
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA' }}
            >
              <Stethoscope size={13} />
              For Healthcare Professionals
            </Link>

            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={`/profile/${user.uid}?from=portal`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
                    style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.30)' }}
                  >
                    <UserAvatar user={user} size={6} />
                    <span className="max-w-[80px] truncate text-purple-300">{displayName}</span>
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                  onClick={handleLogout}
                  title="Sign out"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', color: '#FCA5A5' }}
                >
                  <LogOut size={13} />
                  Out
                </motion.button>
              </>
            ) : (
              <Link
                to="/sign-in"
                state={{ from: location.pathname }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={{ background: 'rgba(167,139,250,0.10)', border: '1px solid rgba(167,139,250,0.25)', color: '#C4B5FD' }}
              >
                <LogIn size={13} />
                Sign In
              </Link>
            )}
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
            {/* Home link */}
            <Link to="/" onClick={() => setOpen(false)}>
              <motion.span
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-slate-300 hover:text-purple-400 text-sm font-medium py-1 transition-colors"
              >
                <Home size={14} /> Home
              </motion.span>
            </Link>

            {LINKS.map(({ label, href }, i) => (
              <Link key={label} to={href} onClick={() => setOpen(false)}>
                <motion.span
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (i + 1) * 0.06 }}
                  className="block text-slate-300 hover:text-purple-400 text-sm font-medium py-1 transition-colors"
                >
                  {label}
                </motion.span>
              </Link>
            ))}

            <div className="pt-2 border-t border-purple-900/40 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-purple-300 text-sm font-semibold">
                  <Zap size={13} className="text-purple-400" />
                  {points} pts
                </div>
                <Link to="/hcp" onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA' }}>
                  <Stethoscope size={12} />
                  For Healthcare Professionals
                </Link>
              </div>

              {user ? (
                <>
                  <Link to={`/profile/${user.uid}?from=portal`} onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: 'rgba(167,139,250,0.10)', border: '1px solid rgba(167,139,250,0.25)' }}>
                    <UserAvatar user={user} size={6} />
                    <span className="text-purple-300 truncate max-w-[160px]">{displayName}</span>
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
                  style={{ background: 'rgba(167,139,250,0.10)', border: '1px solid rgba(167,139,250,0.25)', color: '#C4B5FD' }}>
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
