import { Building2, Calendar } from "lucide-react";
import SpecialtyBadge from "./SpecialtyBadge";

const AVATAR_COLORS = {
  Doctor:             "bg-primary text-white",
  Pharmacist:         "bg-teal text-white",
  Nurse:              "bg-purple-500 text-white",
  "Medical Student":  "bg-amber-400 text-white",
  "Pharmacy Student": "bg-amber-400 text-white",
  Other:              "bg-gray-400 text-white",
};

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function SupporterCard({ name, specialty, workplace, comment, createdAt }) {
  const avatarStyle = AVATAR_COLORS[specialty] ?? AVATAR_COLORS.Other;

  const date = createdAt?.toDate
    ? createdAt.toDate().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : createdAt
    ? new Date(createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
      {/* Avatar + name + badge */}
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${avatarStyle}`}>
          {initials(name)}
        </div>
        <div>
          <p className="font-semibold text-dark text-sm">{name}</p>
          <SpecialtyBadge specialty={specialty} />
        </div>
      </div>

      {/* Workplace */}
      {workplace && (
        <p className="flex items-center gap-1.5 text-xs text-secondary">
          <Building2 size={13} strokeWidth={1.5} />
          {workplace}
        </p>
      )}

      {/* Quote */}
      {comment && (
        <blockquote className="text-sm text-dark italic leading-relaxed border-l-2 border-teal pl-3">
          "{comment}"
        </blockquote>
      )}

      {/* Date */}
      {date && (
        <p className="flex items-center gap-1.5 text-xs text-secondary mt-auto">
          <Calendar size={13} strokeWidth={1.5} />
          Joined {date}
        </p>
      )}
    </div>
  );
}
