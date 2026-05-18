import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Building2, Calendar, Pencil, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import SpecialtyBadge from "../components/common/SpecialtyBadge";
import { getSupporter } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";

const AVATAR_COLORS = {
  Doctor:             "bg-primary",
  Pharmacist:         "bg-teal",
  Nurse:              "bg-purple-500",
  "Medical Student":  "bg-amber-400",
  "Pharmacy Student": "bg-amber-400",
  Other:              "bg-gray-400",
};

const COVER_COLORS = {
  Doctor:             "from-primary/80 to-primary",
  Pharmacist:         "from-teal/80 to-teal",
  Nurse:              "from-purple-500/80 to-purple-600",
  "Medical Student":  "from-amber-400/80 to-amber-500",
  "Pharmacy Student": "from-amber-400/80 to-amber-500",
  Other:              "from-gray-400/80 to-gray-500",
};

function initials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

function formatDate(createdAt) {
  if (!createdAt) return null;
  const d = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function Profile() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [supporter, setSupporter] = useState(null);
  const [fetching, setFetching]   = useState(true);
  const [notFound, setNotFound]   = useState(false);

  const isOwner = !authLoading && user?.uid === uid;

  useEffect(() => {
    setFetching(true);
    setNotFound(false);
    getSupporter(uid)
      .then((data) => {
        if (!data) setNotFound(true);
        else setSupporter(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setFetching(false));
  }, [uid]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (fetching || authLoading) {
    return (
      <>
        <Navbar />
        <main className="bg-bg min-h-screen flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-teal" />
        </main>
        <Footer />
      </>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <>
        <Navbar />
        <main className="bg-bg min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <AlertCircle size={40} strokeWidth={1.5} className="text-secondary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-dark mb-2">Profile not found</h2>
            <p className="text-secondary text-sm mb-6">
              This supporter profile doesn't exist or may have been removed.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-teal text-white rounded-full text-sm font-medium hover:bg-teal/90 transition-colors"
            >
              Back to home
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const avatarColor = AVATAR_COLORS[supporter.specialty] ?? AVATAR_COLORS.Other;
  const coverGrad   = COVER_COLORS[supporter.specialty]  ?? COVER_COLORS.Other;
  const joinedDate  = formatDate(supporter.createdAt);

  return (
    <>
      <Navbar />
      <main className="bg-bg min-h-screen pb-20">

        {/* Cover banner */}
        <div className={`h-48 sm:h-60 bg-gradient-to-br ${coverGrad}`} />

        <div className="max-w-2xl mx-auto px-4">

          {/* Avatar + edit button row */}
          <div className="flex items-end justify-between -mt-14 sm:-mt-16 mb-6">
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-white flex items-center justify-center text-white text-3xl font-semibold flex-shrink-0 ${avatarColor}`}
            >
              {initials(supporter.name)}
            </div>

            {isOwner && (
              <Link
                to="/profile/edit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-dark hover:border-teal hover:text-teal transition-colors bg-white shadow-sm"
              >
                <Pencil size={14} strokeWidth={1.5} />
                Edit profile
              </Link>
            )}
          </div>

          {/* Name + badge */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-dark mb-2">
            {supporter.name}
          </h1>
          <div className="mb-4">
            <SpecialtyBadge specialty={supporter.specialty} />
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-secondary mb-8">
            {supporter.workplace && (
              <span className="flex items-center gap-1.5">
                <Building2 size={14} strokeWidth={1.5} />
                {supporter.workplace}
              </span>
            )}
            {joinedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} strokeWidth={1.5} />
                Joined {joinedDate}
              </span>
            )}
          </div>

          {/* Quote card */}
          {supporter.comment && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
                Their message
              </p>
              <blockquote className="text-dark italic leading-relaxed border-l-2 border-teal pl-4">
                "{supporter.comment}"
              </blockquote>
            </div>
          )}

          {/* Commitment card */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
              Commitment
            </p>
            <p className="text-sm text-dark leading-relaxed">
              <span className="font-semibold">{supporter.name}</span> has publicly committed to
              promoting rational antibiotic use and fighting antimicrobial resistance as part of
              the AntiResist campaign.
            </p>
          </div>

          {/* CTA for visitors */}
          {!isOwner && (
            <div className="mt-8 text-center">
              <p className="text-sm text-secondary mb-3">
                Inspired by {supporter.name.split(" ")[0]}? Add your name to the movement.
              </p>
              <Link
                to="/join"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal text-white text-sm font-medium rounded-full hover:bg-teal/90 transition-colors"
              >
                Join AntiResist
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
