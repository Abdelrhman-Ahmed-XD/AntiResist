import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Building2, Calendar, Pencil, AlertCircle, Loader2, Camera, LogOut, ShieldCheck, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { updateProfile } from "firebase/auth";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HomeParticles from "../components/sections/HomeParticles";
import SpecialtyBadge from "../components/common/SpecialtyBadge";
import { getSupporter, updateSupporter, updateUserProfile, getUserProfile } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../firebase/auth";
import { uploadToCloudinary } from "../lib/cloudinaryUpload";
import { auth } from "../firebase/config";

async function downloadCertificate(name, filename = "AntiResist-Certificate.png") {
  const displayName = name?.trim() || "AMR Advocate";
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = "/certificate.jpg"; });
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const fontSize = Math.round(img.naturalHeight * 0.058);
  ctx.font = `700 ${fontSize}px 'Times New Roman', Georgia, serif`;
  ctx.fillStyle = "#1a3a5c";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(displayName, img.naturalWidth / 2, img.naturalHeight * 0.405);
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }, "image/png");
}

const AVATAR_COLORS = {
  Doctor:             "bg-violet-600",
  Pharmacist:         "bg-indigo-500",
  Nurse:              "bg-purple-500",
  "Medical Student":  "bg-blue-500",
  "Pharmacy Student": "bg-blue-500",
  Other:              "bg-slate-500",
};

function initials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
}

function formatDate(createdAt) {
  if (!createdAt) return null;
  const d = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function aboutText(name, specialty) {
  const first = name?.split(" ")[0] || name || "This user";
  if (["Doctor", "Pharmacist", "Nurse"].includes(specialty)) {
    return `${first} is a ${specialty.toLowerCase()} on the AntiResist platform, dedicated to antimicrobial stewardship and responsible antibiotic use in clinical practice.`;
  }
  if (specialty === "Medical Student") {
    return `${first} is a medical student using AntiResist to build a strong foundation in antimicrobial resistance and evidence-based prescribing.`;
  }
  if (specialty === "Pharmacy Student") {
    return `${first} is a pharmacy student using AntiResist to deepen their understanding of antimicrobial resistance and rational drug use.`;
  }
  return `${first} is part of the AntiResist community, learning about antimicrobial resistance and promoting the responsible use of antibiotics.`;
}

export default function Profile() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromCtx = searchParams.get("from"); // "portal" | "hcp" | null
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [supporter,    setSupporter]    = useState(null);
  const [fetching,     setFetching]     = useState(true);
  const [notFound,     setNotFound]     = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const [userProfile,  setUserProfile]  = useState(null);
  const fileInputRef = useRef(null);

  const isOwner = !authLoading && user?.uid === uid;

  useEffect(() => {
    if (!authLoading && user?.uid === uid) {
      getUserProfile(uid).then(setUserProfile).catch(() => {});
    }
  }, [uid, user, authLoading]);

  useEffect(() => {
    setFetching(true);
    setNotFound(false);
    let done = false;
    const timer = setTimeout(() => {
      if (!done) { done = true; setNotFound(true); setFetching(false); }
    }, 5000);
    getSupporter(uid)
      .then((data) => { if (!done) { done = true; if (!data) setNotFound(true); else setSupporter(data); } })
      .catch(() => { if (!done) { done = true; setNotFound(true); } })
      .finally(() => { clearTimeout(timer); setFetching(false); });
  }, [uid]);

  async function handleLogout() {
    await signOut();
    navigate(fromCtx === "portal" ? "/portal" : fromCtx === "hcp" ? "/hcp" : "/");
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5 MB."); return; }

    setUploading(true);
    try {
      const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const { secure_url: photoURL } = await uploadToCloudinary(file, preset, "profile-pictures", uid);
      await Promise.all([
        updateProfile(auth.currentUser, { photoURL }),
        supporter?.id && updateSupporter(supporter.id, { photoURL }),
        updateUserProfile(uid, { photoURL }),
      ]);
      setSupporter((prev) => ({ ...prev, photoURL }));
      refreshUser();
      toast.success("Profile photo updated.");
    } catch (err) {
      toast.error(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }


  // ── Loading ──────────────────────────────────────────────────────────────────
  if (fetching || authLoading) {
    return (
      <>
        <Navbar />
        <div className="relative" style={{ overflowX: "clip", minHeight: "100vh" }}>
          <HomeParticles repel={false} />
          <div className="relative z-10 flex items-center justify-center" style={{ minHeight: "100vh" }}>
            <Loader2 size={32} className="animate-spin text-purple-500" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────────
  if (notFound) {
    const isIncomplete = !authLoading && user?.uid === uid;
    const gradBtn = { background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)" };

    return (
      <>
        <Navbar />
        <div className="relative" style={{ overflowX: "clip", minHeight: "100vh" }}>
          <HomeParticles repel={false} />
          <div className="relative z-10 flex items-center justify-center px-4" style={{ minHeight: "100vh" }}>
            <motion.div
              className="text-center max-w-sm"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(124,58,237,0.3)" }}>
                <AlertCircle size={28} className="text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                {isIncomplete ? "Complete your profile" : "Profile not found"}
              </h2>
              <p className="text-sm mb-6 text-slate-400">
                {isIncomplete
                  ? "Your account was created but your profile details are missing."
                  : "This profile doesn't exist or may have been removed."}
              </p>
              {isIncomplete ? (
                <Link to="/profile/edit"
                  className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold text-white"
                  style={gradBtn}>
                  Complete profile
                </Link>
              ) : (
                <button onClick={() => navigate(fromCtx === "portal" ? "/portal" : fromCtx === "hcp" ? "/hcp" : "/")}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold text-white"
                  style={gradBtn}>
                  Go back
                </button>
              )}
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ── Profile data ─────────────────────────────────────────────────────────────
  const photoURL    = supporter.photoURL || (isOwner ? user?.photoURL : null);
  const avatarColor = AVATAR_COLORS[supporter.specialty] ?? AVATAR_COLORS.Other;
  const joinedDate  = formatDate(supporter.createdAt);

  // ── Profile ───────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className="relative" style={{ overflowX: "clip", minHeight: "100vh" }}>
        <HomeParticles repel={false} />

        <div className="relative z-10 py-28 px-4 flex justify-center">
          <motion.div
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glass card */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(124,58,237,0.18)",
                boxShadow: "0 16px 56px rgba(124,58,237,0.18), 0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              {/* ── Gradient header ── */}
              <div
                className="px-8 py-10 relative"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)" }}
              >
                <div className="flex flex-col sm:flex-row items-start gap-6">

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {photoURL ? (
                      <img src={photoURL} alt={supporter.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white/30" />
                    ) : (
                      <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white/30 ${avatarColor}`}>
                        {initials(supporter.name)}
                      </div>
                    )}
                    {isOwner && (
                      <>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 hover:bg-white border border-white/60 shadow transition-all disabled:opacity-60"
                          title="Change photo"
                        >
                          {uploading
                            ? <Loader2 size={14} className="animate-spin text-purple-600" />
                            : <Camera size={14} className="text-purple-600" />}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Name + meta */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                      {supporter.name}
                    </h1>
                    <div className="mb-3">
                      <SpecialtyBadge specialty={supporter.specialty} light />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-white/70">
                      {supporter.workplace && (
                        <span className="flex items-center gap-1.5">
                          <Building2 size={13} strokeWidth={1.5} />
                          {supporter.workplace}
                        </span>
                      )}
                      {joinedDate && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} strokeWidth={1.5} />
                          Joined {joinedDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {isOwner && (
                    <div className="flex items-center gap-2 sm:self-start shrink-0">
                      <Link
                        to="/profile/edit"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-white/15 hover:bg-white/25 border border-white/30 text-white transition-all duration-200"
                      >
                        <Pencil size={13} strokeWidth={1.5} />
                        Edit
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                        style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "#FCA5A5" }}
                      >
                        <LogOut size={13} strokeWidth={1.5} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Card content ── */}
              <div className="px-8 py-8 space-y-6">

                {/* Message */}
                {supporter.comment && (
                  <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100">
                    <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-3">
                      Their message
                    </p>
                    <blockquote className="italic leading-relaxed border-l-2 border-purple-400 pl-4 text-gray-700">
                      "{supporter.comment}"
                    </blockquote>
                  </div>
                )}

                {/* About (replaces Commitment) */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-purple-100">
                  <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-3 flex items-center gap-1.5">
                    <ShieldCheck size={13} strokeWidth={2} />
                    About
                  </p>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {aboutText(supporter.name, supporter.specialty)}
                  </p>
                </div>

                {/* Certificates — owner only */}
                {isOwner && (userProfile?.points >= 60 || userProfile?.hcpScore >= 80) && (
                  <div className="p-5 rounded-2xl" style={{ background: '#F9F5FF', border: '1px solid rgba(124,58,237,0.12)' }}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-3 flex items-center gap-1.5">
                      <Download size={13} strokeWidth={2} /> Your Certificates
                    </p>
                    <div className="flex flex-col gap-3">
                      {userProfile?.points >= 60 && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-100">
                          <div>
                            <p className="text-gray-800 text-sm font-semibold">Patient Portal Certificate</p>
                            <p className="text-gray-400 text-xs">Antibiotic Stewardship Supporter</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                            onClick={() => downloadCertificate(supporter.name || user?.displayName, "AntiResist-Certificate.png")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                            style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}>
                            <Download size={12} /> Download
                          </motion.button>
                        </div>
                      )}
                      {userProfile?.hcpScore >= 80 && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
                          <div>
                            <p className="text-gray-800 text-sm font-semibold">HCP Certificate</p>
                            <p className="text-gray-400 text-xs">Expert Antimicrobial Steward</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                            onClick={() => downloadCertificate(supporter.name || user?.displayName, "AntiResist-HCP-Certificate.png")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                            style={{ background: 'linear-gradient(135deg, #1D4ED8, #0EA5E9)' }}>
                            <Download size={12} /> Download
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Visitor CTA */}
                {!isOwner && (
                  <div className="pt-2 text-center">
                    <p className="text-sm text-gray-400 mb-4">
                      Want to track your AMR learning journey and earn badges?
                    </p>
                    <Link
                      to="/join"
                      className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200"
                      style={{
                        background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
                        boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
                      }}
                    >
                      Create an account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
