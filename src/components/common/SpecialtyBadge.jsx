const STYLES = {
  Doctor:             "bg-blue-100 text-blue-700",
  Pharmacist:         "bg-teal/10 text-teal",
  Nurse:              "bg-purple-100 text-purple-700",
  "Medical Student":  "bg-amber-100 text-amber-700",
  "Pharmacy Student": "bg-amber-100 text-amber-700",
  Other:              "bg-gray-100 text-gray-600",
};

export default function SpecialtyBadge({ specialty, light = false }) {
  if (light) {
    return (
      <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full text-white"
        style={{ background: "rgba(255,255,255,0.20)", border: "1px solid rgba(255,255,255,0.35)" }}>
        {specialty}
      </span>
    );
  }
  const style = STYLES[specialty] ?? STYLES.Other;
  return (
    <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${style}`}>
      {specialty}
    </span>
  );
}
