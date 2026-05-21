import { Link, Outlet } from 'react-router-dom';
import HCPNavbar from './HCPNavbar';
import { HCPScoreProvider } from '../../context/HCPScoreContext';

const NAV = [
  { label: 'AWaRe',        href: '/hcp/aware'  },
  { label: 'Quiz',         href: '/hcp/quiz'   },
  { label: 'Support Tool', href: '/hcp/tool'   },
  { label: 'Trends',       href: '/hcp/trends' },
];

export default function HCPLayout() {
  return (
    <HCPScoreProvider>
    <div className="min-h-screen" style={{ background: '#07071a' }}>
      <HCPNavbar />
      <main>
        <Outlet />
      </main>

      <footer className="border-t border-blue-900/30 pt-14 pb-8 px-4 sm:px-6 lg:px-8"
        style={{ background: 'rgba(7,7,26,0.6)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
            <div>
              <p className="text-white font-bold text-base mb-2">AntiResist HCP</p>
              <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">
                Antimicrobial stewardship tools for healthcare professionals. Evidence-based guidance to optimise prescribing.
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">Tools</p>
              <ul className="space-y-2.5">
                {NAV.map(({ label, href }) => (
                  <li key={href}>
                    <Link to={href} className="text-slate-500 hover:text-blue-400 text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">Site</p>
              <ul className="space-y-2.5">
                {[['Home', '/'], ['Patient Portal', '/portal'], ['About', '/about']].map(([l, t]) => (
                  <li key={t}>
                    <Link to={t} className="text-slate-500 hover:text-blue-400 text-sm transition-colors duration-200">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="h-px w-full mb-6"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.25), transparent)' }} />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs">© {new Date().getFullYear()} AntiResist. Healthcare Professional Stewardship Portal.</p>
            <p className="text-slate-600 text-xs text-center sm:text-right max-w-sm">
              For educational and clinical decision-support only. Always apply local antibiogram data and clinical judgement.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </HCPScoreProvider>
  );
}
