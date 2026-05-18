import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Pill,
  Globe,
  HeartHandshake,
  Users,
  Info,
  User,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { icon: Shield,        label: "What is AMR",  href: "#what-is-amr",  scroll: true },
  { icon: Pill,          label: "Rational Use",  href: "#rational-use", scroll: true },
  { icon: Globe,         label: "Impact",        href: "#impact",       scroll: true },
  { icon: HeartHandshake,label: "How to Help",   href: "#how-to-help",  scroll: true },
  { icon: Users,         label: "Support Wall",  href: "/support-wall", scroll: false },
  { icon: Info,          label: "About",         href: "/about",        scroll: false },
];

function scrollTo(id) {
  document.getElementById(id.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNavClick(link) {
    setMenuOpen(false);
    if (link.scroll) {
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => scrollTo(link.href), 100);
      } else {
        scrollTo(link.href);
      }
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Wordmark */}
          <Link to="/" className="text-xl font-bold text-primary tracking-tight">
            AntiResist
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ icon: Icon, label, href, scroll }) =>
              scroll ? (
                <button
                  key={label}
                  onClick={() => handleNavClick({ href, scroll })}
                  className="flex flex-col items-center gap-0.5 group"
                >
                  <Icon size={18} strokeWidth={1.5} className="text-gray-400 group-hover:text-primary transition-colors" />
                  <span className="text-xs text-gray-500 group-hover:text-primary transition-colors">{label}</span>
                </button>
              ) : (
                <Link key={label} to={href} className="flex flex-col items-center gap-0.5 group">
                  <Icon size={18} strokeWidth={1.5} className="text-gray-400 group-hover:text-primary transition-colors" />
                  <span className="text-xs text-gray-500 group-hover:text-primary transition-colors">{label}</span>
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/join"
              className="bg-teal text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              Join the Movement
            </Link>
            <Link
              to={user ? `/profile/${user.uid}` : "/sign-in"}
              className="p-2 rounded-xl border border-gray-200 hover:border-primary transition-colors"
            >
              <User size={18} strokeWidth={1.5} className="text-gray-500" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl border border-gray-200"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ icon: Icon, label, href, scroll }) =>
            scroll ? (
              <button
                key={label}
                onClick={() => handleNavClick({ href, scroll })}
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary"
              >
                <Icon size={18} strokeWidth={1.5} />
                {label}
              </button>
            ) : (
              <Link
                key={label}
                to={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary"
              >
                <Icon size={18} strokeWidth={1.5} />
                {label}
              </Link>
            )
          )}
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <Link
              to="/join"
              onClick={() => setMenuOpen(false)}
              className="bg-teal text-white text-sm font-medium px-5 py-2.5 rounded-xl text-center hover:opacity-90"
            >
              Join the Movement
            </Link>
            <Link
              to={user ? `/profile/${user.uid}` : "/sign-in"}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 border border-gray-200 text-sm text-gray-600 py-2.5 rounded-xl hover:border-primary hover:text-primary"
            >
              <User size={16} strokeWidth={1.5} />
              {user ? "My Profile" : "Sign In"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
