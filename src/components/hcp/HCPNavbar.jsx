import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Award } from 'lucide-react';
import { useHCPScore } from '../../context/HCPScoreContext';

const NAV = [
  { label: 'AWaRe',        href: '/hcp/aware'  },
  { label: 'Quiz',         href: '/hcp/quiz'   },
  { label: 'Support Tool', href: '/hcp/tool'   },
  { label: 'Trends',       href: '/hcp/trends' },
];

export default function HCPNavbar() {
  const { score, completed } = useHCPScore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8"
      style={{ background: 'rgba(7,7,26,0.82)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(59,130,246,0.15)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14">

        <Link to="/hcp" className="flex items-center gap-2 text-white font-bold text-sm">
          <ShieldCheck size={18} style={{ color: '#3B82F6' }} />
          <span>Anti<span style={{ color: '#3B82F6' }}>Resist</span></span>
          <span className="text-xs px-2 py-0.5 rounded-full ml-1 hidden sm:inline"
            style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA' }}>
            Healthcare Professional
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          {NAV.map(({ label, href }) => (
            <Link key={href} to={href}
              className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Score display */}
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
            className="text-xs px-4 py-2 rounded-full font-semibold transition-all duration-200 hidden sm:block"
            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA' }}>
            Patient Portal →
          </Link>
        </div>
      </div>
    </nav>
  );
}
