import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Users, ImageIcon, MessageSquare, ArrowLeft, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import SupportersTab from "./SupportersTab";
import GalleryTab from "./GalleryTab";
import CommentsTab from "./CommentsTab";

const TABS = [
  { id: "supporters", label: "Supporters", icon: Users },
  { id: "gallery",    label: "Gallery",    icon: ImageIcon },
  { id: "comments",   label: "Comments",   icon: MessageSquare },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab,    setActiveTab]    = useState("supporters");
  const [sidebarOpen,  setSidebarOpen]  = useState(false);

  function switchTab(id) {
    setActiveTab(id);
    setSidebarOpen(false);
  }

  const ActiveIcon = TABS.find((t) => t.id === activeTab)?.icon ?? Users;

  return (
    <div className="min-h-screen bg-bg flex">

      {/* ── Sidebar ── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-dark flex flex-col transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
          <Shield size={20} strokeWidth={1.5} className="text-teal flex-shrink-0" />
          <span className="text-white font-bold text-lg tracking-tight">AntiResist</span>
          <span className="ml-auto text-xs text-white/40 font-medium">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => switchTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-teal text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </nav>

        {/* User + back link */}
        <div className="px-6 py-5 border-t border-white/10 space-y-3">
          {user && (
            <p className="text-xs text-white/40 truncate">{user.email}</p>
          )}
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            Back to site
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-secondary hover:text-dark"
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 text-dark">
            <ActiveIcon size={18} strokeWidth={1.5} className="text-teal" />
            <h1 className="font-semibold capitalize">{activeTab}</h1>
          </div>
        </header>

        {/* Tab content */}
        <main className="flex-1 p-6">
          {activeTab === "supporters" && <SupportersTab />}
          {activeTab === "gallery"    && <GalleryTab />}
          {activeTab === "comments"   && <CommentsTab />}
        </main>
      </div>
    </div>
  );
}
