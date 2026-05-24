import { Link, Outlet } from 'react-router-dom';
import { GamificationProvider } from '../../context/GamificationContext';
import PortalNavbar from './PortalNavbar';
import FloatingParticles from './FloatingParticles';

function LinkedInIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

const PORTAL_LINKS = [
  { label: 'What is AMR?',    href: '/portal/learn'    },
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
      <div className="min-h-screen portal-scroll" style={{ background: '#07071a', position: 'relative' }}>
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0, opacity: 0.45 }}
          aria-hidden="true"
        >
          <FloatingParticles purple />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
        <PortalNavbar />
        <main className="pt-16">
          <Outlet />
        </main>

        <footer className="border-t border-purple-900/30 pt-14 pb-8 px-4 sm:px-6 lg:px-8"
          style={{ background: 'rgba(7,7,26,0.6)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
              {/* Brand column */}
              <div>
                <p className="text-white font-bold text-base mb-2 tracking-tight">AntiResist</p>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[200px] mb-3">
                  Patient education portal on antibiotic resistance. For awareness only. Always consult a healthcare professional.
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://www.facebook.com/share/1BfcnpPXWD/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Facebook"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 hover:scale-105"
                    style={{
                      background: "rgba(167,139,250,0.08)",
                      border: "1px solid rgba(167,139,250,0.3)",
                    }}
                  >
                    <span style={{ color: '#1877F2' }}><FacebookIcon /></span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/abdelrhman-ahmed-fathy2004"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group hidden sm:inline-flex items-center gap-1.5"
                  >
                    <span style={{ color: '#0077B5' }}><LinkedInIcon /></span>
                    <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-200">Developed by</span>
                    <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-200">Abdelrhman Ahmed</span>
                  </a>
                </div>
              </div>

              {/* Portal + Site nav side by side with divider */}
              <div className="sm:col-span-2 flex gap-0">
                <div className="flex-1">
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
                <div className="w-px mx-8 self-stretch" style={{ background: 'rgba(167,139,250,0.15)' }} />
                <div className="flex-1">
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

              {/* Developed by — mobile only, below nav columns */}
              <div className="flex sm:hidden justify-center">
                <a
                  href="https://www.linkedin.com/in/abdelrhman-ahmed-fathy2004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5"
                >
                  <span style={{ color: '#0077B5' }}><LinkedInIcon /></span>
                  <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-200">Developed by</span>
                  <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-200">Abdelrhman Ahmed</span>
                </a>
              </div>
            </div>
            <div className="h-px w-full mb-6"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(138,43,226,0.25), transparent)' }} />
            <div className="flex items-center justify-center">
              <p className="text-slate-600 text-xs">© {new Date().getFullYear()} AntiResist. Patient Education Portal.</p>
            </div>
          </div>
        </footer>
        </div>
      </div>
    </GamificationProvider>
  );
}
