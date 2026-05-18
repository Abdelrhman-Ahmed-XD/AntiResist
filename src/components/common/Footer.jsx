import { Link } from "react-router-dom";
import { Shield, X, GitBranch, Link2, Mail } from "lucide-react";

const NAV_SECTIONS = [
  {
    heading: "Learn",
    links: [
      { label: "What is AMR?", href: "/#what-is-amr" },
      { label: "Rational Antibiotic Use", href: "/#rational-use" },
      { label: "Impact on Healthcare", href: "/#impact" },
      { label: "How to Help", href: "/#how-to-help" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Support Wall", href: "/support-wall" },
      { label: "Campaign Gallery", href: "/support-wall#gallery" },
      { label: "Join the Movement", href: "/join" },
      { label: "About Us", href: "/about" },
    ],
  },
];

const SOCIALS = [
  { icon: X,        href: "#", label: "X (Twitter)" },
  { icon: Link2,    href: "#", label: "LinkedIn"     },
  { icon: GitBranch,href: "#", label: "GitHub"       },
  { icon: Mail,     href: "mailto:bedoamado1212@gmail.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield size={22} strokeWidth={1.5} className="text-teal" />
              <span className="text-xl font-bold tracking-tight">AntiResist</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              A healthcare awareness campaign dedicated to promoting rational antibiotic
              use and combating antimicrobial resistance across Egypt — one prescription at a time.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal transition-colors"
                >
                  <Icon size={15} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_SECTIONS.map(({ heading, links }) => (
            <div key={heading}>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                {heading}
              </p>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    {href.startsWith("/") && !href.includes("#") ? (
                      <Link
                        to={href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} AntiResist. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Built for Egyptian healthcare professionals · AMR Awareness Campaign
          </p>
        </div>
      </div>
    </footer>
  );
}
