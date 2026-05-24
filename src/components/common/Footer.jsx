import { useState } from "react";

function scrollToTop() {
  const start = window.scrollY;
  if (start === 0) return;
  const duration = 650;
  const startTime = performance.now();
  const ease = (t) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, start * (1 - ease(progress)));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const GRAD_TEXT = {
  background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

function LinkedInIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

const NAV_SECTIONS = [
  {
    heading: "Learn",
    links: [
      { label: "What is AMR?",           href: "/", anchor: "what-is-amr" },
      { label: "Rational Antibiotic Use", href: "/", anchor: "rational-use" },
      { label: "Impact on Healthcare",   href: "/", anchor: "impact" },
      { label: "How to Help",            href: "/", anchor: "how-to-help" },
    ],
  },
  {
    heading: "Portals",
    links: [
      { label: "Patient Portal",          href: "/portal",  anchor: null },
      { label: "Healthcare Professional", href: "/hcp",     anchor: null },
      { label: "Join the Movement",       href: "/join",    anchor: null },
      { label: "About Us",                href: "/about",   anchor: null },
    ],
  },
];

function FooterLink({ label, href, anchor }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  function handleClick(e) {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (anchor) {
      e.preventDefault();
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" }), 120);
      } else {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  return (
    <Link
      to={href}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-sm font-medium transition-all duration-200"
      style={hovered ? GRAD_TEXT : { color: "#6B7280" }}
    >
      {label}
    </Link>
  );
}

function DevelopedBy() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="https://www.linkedin.com/in/abdelrhman-ahmed-fathy2004"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ color: "#0077B5" }}><LinkedInIcon /></span>
      <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>Developed by</span>
      <span
        className="text-xs font-semibold transition-all duration-200"
        style={hovered ? GRAD_TEXT : { color: "#6B7280" }}
      >
        Abdelrhman Ahmed
      </span>
    </a>
  );
}

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        background: "linear-gradient(to right, rgba(240,233,255,0.96) 0%, rgba(233,241,255,0.96) 100%)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        borderColor: "rgba(124,58,237,0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" onClick={scrollToTop}
              className="flex items-center gap-2 mb-4">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <defs>
                  <clipPath id="ft-shield-l"><rect x="0" y="0" width="14" height="28" /></clipPath>
                  <clipPath id="ft-shield-r"><rect x="14" y="0" width="14" height="28" /></clipPath>
                  <clipPath id="ft-shield-inner"><path d="M14 2 L24 6.5 L24 14.5 Q24 21.5 14 26 Q4 21.5 4 14.5 L4 6.5 Z" /></clipPath>
                  <linearGradient id="ft-shield-border" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#60A5FA" />
                  </linearGradient>
                </defs>
                <path d="M14 2 L24 6.5 L24 14.5 Q24 21.5 14 26 Q4 21.5 4 14.5 L4 6.5 Z"
                  fill="#7C3AED" fillOpacity="0.82" clipPath="url(#ft-shield-l)" />
                <path d="M14 2 L24 6.5 L24 14.5 Q24 21.5 14 26 Q4 21.5 4 14.5 L4 6.5 Z"
                  fill="#2563EB" fillOpacity="0.82" clipPath="url(#ft-shield-r)" />
                <path d="M14 2 L24 6.5 L24 14.5 Q24 21.5 14 26 Q4 21.5 4 14.5 L4 6.5 Z"
                  fill="none" stroke="url(#ft-shield-border)" strokeWidth="1.2" />
                <g clipPath="url(#ft-shield-inner)" opacity="0.72">
                  <line x1="17.5" y1="13.0" x2="21.0" y2="13.0" stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="17.0" y1="14.8" x2="20.1" y2="16.5" stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="15.8" y1="16.0" x2="17.5" y2="19.1" stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="14.0" y1="16.5" x2="14.0" y2="20.0" stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="12.3" y1="16.0" x2="10.5" y2="19.1" stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="11.0" y1="14.8" x2="7.9"  y2="16.5" stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="10.5" y1="13.0" x2="7.0"  y2="13.0" stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="11.0" y1="11.3" x2="7.9"  y2="9.5"  stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="12.3" y1="10.0" x2="10.5" y2="6.9"  stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="14.0" y1="9.5"  x2="14.0" y2="6.0"  stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="15.8" y1="10.0" x2="17.5" y2="6.9"  stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="17.0" y1="11.3" x2="20.1" y2="9.5"  stroke="rgba(255,255,255,0.62)" strokeWidth="0.7" strokeLinecap="round" />
                  <circle cx="21.0" cy="13.0" r="1.0" fill="rgba(255,255,255,0.72)" />
                  <circle cx="20.1" cy="16.5" r="1.0" fill="rgba(255,255,255,0.72)" />
                  <circle cx="17.5" cy="19.1" r="1.0" fill="rgba(255,255,255,0.72)" />
                  <circle cx="14.0" cy="20.0" r="1.0" fill="rgba(255,255,255,0.72)" />
                  <circle cx="10.5" cy="19.1" r="1.0" fill="rgba(255,255,255,0.72)" />
                  <circle cx="7.9"  cy="16.5" r="1.0" fill="rgba(255,255,255,0.72)" />
                  <circle cx="7.0"  cy="13.0" r="1.0" fill="rgba(255,255,255,0.72)" />
                  <circle cx="7.9"  cy="9.5"  r="1.0" fill="rgba(255,255,255,0.72)" />
                  <circle cx="10.5" cy="6.9"  r="1.0" fill="rgba(255,255,255,0.72)" />
                  <circle cx="14.0" cy="6.0"  r="1.0" fill="rgba(255,255,255,0.72)" />
                  <circle cx="17.5" cy="6.9"  r="1.0" fill="rgba(255,255,255,0.72)" />
                  <circle cx="20.1" cy="9.5"  r="1.0" fill="rgba(255,255,255,0.72)" />
                  <circle cx="14" cy="13" r="3.5" fill="rgba(255,255,255,0.20)" stroke="rgba(255,255,255,0.65)" strokeWidth="0.8" />
                </g>
                <line x1="10" y1="10" x2="18" y2="19"
                  stroke="rgba(239,68,68,0.88)" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <span className="text-xl font-bold tracking-tight">
                <span style={{ color: "#7C3AED" }}>Anti</span>
                <span style={{ color: "#2563EB" }}>Resist</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm mb-5" style={{ color: "#6B7280" }}>
              A healthcare awareness campaign dedicated to promoting rational antibiotic
              use and combating antimicrobial resistance across Egypt  one prescription at a time.
            </p>

            <DevelopedBy />
          </div>

          {/* Nav columns */}
          {NAV_SECTIONS.map(({ heading, links }) => (
            <div key={heading}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#9CA3AF" }}>
                {heading}
              </p>
              <ul className="space-y-3">
                {links.map(({ label, href, anchor }) => (
                  <li key={label}>
                    <FooterLink label={label} href={href} anchor={anchor} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider + copyright */}
        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(124,58,237,0.10)" }}>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>
            © {new Date().getFullYear()} AntiResist. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#C4B5FD" }}>
            AMR Awareness &amp; Stewardship Platform · Egypt
          </p>
        </div>
      </div>
    </footer>
  );
}
