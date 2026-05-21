import { Link, Outlet } from 'react-router-dom';
import { GamificationProvider } from '../../context/GamificationContext';
import PortalNavbar from './PortalNavbar';

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

const PORTAL_LINKS = [
  { label: 'What is AMR?',    href: '/portal/learn'    },
  { label: 'Patient Quiz',    href: '/portal/quiz'     },
  { label: 'Symptom Checker', href: '/portal/symptoms' },
  { label: 'Drug Library',    href: '/portal/drugs'    },
  { label: 'Your Progress',   href: '/portal/progress' },
];

const SITE_LINKS = [
  { label: 'Home',        to: '/'      },
  { label: 'HCP Portal',  to: '/hcp'   },
  { label: 'About',       to: '/about' },
];

export default function PortalLayout() {
  return (
    <GamificationProvider>
      <div className="min-h-screen portal-scroll" style={{ background: '#07071a' }}>
        <PortalNavbar />
        <main>
          <Outlet />
        </main>

        <footer className="border-t border-purple-900/30 pt-14 pb-8 px-4 sm:px-6 lg:px-8"
          style={{ background: 'rgba(7,7,26,0.6)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
              <div>
                <p className="text-white font-bold text-base mb-2 tracking-tight">AntiResist</p>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">
                  Patient education portal on antibiotic resistance. For awareness only — always consult a healthcare professional.
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">Portal</p>
                <ul className="space-y-2.5">
                  {PORTAL_LINKS.map(({ label, href }) => (
                    <li key={href}>
                      <Link to={href} className="text-slate-500 hover:text-violet-400 text-sm transition-colors duration-200">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">Site</p>
                <ul className="space-y-2.5">
                  {SITE_LINKS.map(({ label, to }) => (
                    <li key={to}>
                      <Link to={to} className="text-slate-500 hover:text-violet-400 text-sm transition-colors duration-200">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="h-px w-full mb-6"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(138,43,226,0.25), transparent)' }} />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-slate-600 text-xs">© {new Date().getFullYear()} AntiResist. Patient Education Portal.</p>
              <a href="https://www.linkedin.com/in/abdelrhman-ahmed-fathy2004" target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-2">
                <span className="text-slate-500 text-xs group-hover:text-slate-400 transition-colors duration-200">Developed by</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700/60
                  group-hover:border-[#0077B5]/50 transition-all duration-200">
                  <span className="text-[#0077B5] inline-flex"><LinkedInIcon /></span>
                  <span className="text-slate-400 group-hover:text-slate-300 text-xs font-medium">Abdelrhman Ahmed</span>
                </span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </GamificationProvider>
  );
}
