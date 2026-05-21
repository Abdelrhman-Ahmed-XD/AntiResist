import { useState } from "react";
import { motion } from "framer-motion";
import { HeartHandshake, Check } from "lucide-react";

const roles = ["Doctors", "Pharmacists", "Nurses", "Laboratory"];

const responsibilities = {
  Doctors: [
    { title: "Verify bacterial indication", desc: "Prescribe antibiotics only when there is clear evidence of a bacterial infection, not for viral illnesses." },
    { title: "Culture before empiric therapy", desc: "Send blood, urine, or wound cultures before starting antibiotics whenever clinically feasible." },
    { title: "De-escalate based on results", desc: "Narrow antibiotic coverage once culture and sensitivity results are available." },
    { title: "Document indication & duration", desc: "Record the indication, chosen agent, dose, and planned duration clearly in the patient's notes." },
  ],
  Pharmacists: [
    { title: "Verify prescriptions", desc: "Review antibiotic dose, route, frequency, and duration for appropriateness before dispensing." },
    { title: "Counsel patients thoroughly", desc: "Provide clear, plain-language instructions on completing the full course and avoiding sharing medication." },
    { title: "Identify drug interactions", desc: "Flag clinically significant drug–drug and drug–disease interactions and communicate them to the prescriber." },
    { title: "Participate in stewardship rounds", desc: "Collaborate with clinical teams to review antibiotic use data and identify targets for improvement." },
  ],
  Nurses: [
    { title: "Administer on schedule", desc: "Ensure antibiotics are given at the correct intervals to maintain therapeutic drug levels." },
    { title: "Monitor for adverse effects", desc: "Observe for allergic reactions, C. difficile symptoms, and treatment failures. Report promptly." },
    { title: "Enforce infection control", desc: "Follow hand hygiene, PPE, and isolation protocols rigorously to prevent transmission of resistant organisms." },
    { title: "Reinforce patient education", desc: "Remind patients to complete their full antibiotic course and not to share medication with others." },
  ],
  Laboratory: [
    { title: "Deliver rapid diagnostics", desc: "Provide timely culture and sensitivity reports to enable early targeted therapy decisions." },
    { title: "Report local resistance patterns", desc: "Distribute updated antibiogram data to clinical teams regularly so empiric choices reflect local epidemiology." },
    { title: "Alert on critical resistance", desc: "Immediately notify the responsible clinician when a critical or unexpected resistance pattern is detected." },
    { title: "Maintain quality assurance", desc: "Calibrate equipment and participate in external proficiency programmes to ensure testing accuracy." },
  ],
};

const aware = [
  {
    label: "Access",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    desc: "First-line antibiotics for common infections. Widely available, low cost, low resistance risk. Examples: amoxicillin, doxycycline.",
  },
  {
    label: "Watch",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    desc: "Higher resistance potential. Priority stewardship targets. Use only when Access agents are insufficient. Examples: fluoroquinolones, cephalosporins.",
  },
  {
    label: "Reserve",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    desc: "Last-resort antibiotics for multidrug-resistant infections. Use only when all other options have failed. Examples: colistin, carbapenems.",
  },
];

const tips = [
  { title: "Complete the full course", desc: "Never stop antibiotics early, even if you feel better. Incomplete courses allow resistant bacteria to survive." },
  { title: "Never self-prescribe", desc: "Always consult a licensed healthcare professional before starting antibiotic therapy." },
  { title: "Culture first when possible", desc: "Send specimens for culture and sensitivity before starting antibiotics to enable targeted therapy." },
  { title: "De-escalate to targeted therapy", desc: "Switch from broad-spectrum to narrow-spectrum agents as soon as culture results are available." },
  { title: "Practice strict hand hygiene", desc: "Thorough handwashing is the single most effective measure to prevent spread of resistant organisms." },
  { title: "Educate every patient", desc: "Explain why completing the full course matters and why antibiotics should never be shared or saved." },
];

export default function HowToHelp() {
  const [activeRole, setActiveRole] = useState("Doctors");

  return (
    <section id="how-to-help" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <div className="flex items-center gap-2 text-sm font-semibold mb-4"
            style={{ background: "linear-gradient(135deg,#7C3AED 0%,#2563EB 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            <HeartHandshake size={16} strokeWidth={1.5} />
            Point 4
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold text-dark mb-4">
            How you can help — antibiotic stewardship
          </h2>
          <p className="text-secondary leading-relaxed max-w-2xl mb-12">
            Antibiotic Stewardship (AMS) is a coordinated programme that promotes the appropriate
            use of antimicrobials to improve patient outcomes, reduce resistance, and decrease
            unnecessary costs. Every healthcare professional has a role to play.
          </p>
        </motion.div>

        {/* Role tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {roles.map((role) => (
            <motion.button
              key={role}
              onClick={() => setActiveRole(role)}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={
                activeRole === role
                  ? {
                      background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
                      color: "#fff",
                      border: "1px solid transparent",
                      boxShadow: "0 4px 14px rgba(124,58,237,0.30)",
                    }
                  : {
                      background: "rgba(255,255,255,0.7)",
                      color: "#6B7280",
                      border: "1px solid #E5E7EB",
                    }
              }
            >
              {role}
            </motion.button>
          ))}
        </div>

        {/* Responsibility cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {responsibilities[activeRole].map(({ title, desc }) => (
            <motion.div
              key={title}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex gap-4"
              whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(124,58,237,0.12)", borderColor: "rgba(124,58,237,0.20)" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)" }}>
                <Check size={15} strokeWidth={2.5} color="white" />
              </span>
              <div>
                <p className="font-semibold text-dark mb-1">{title}</p>
                <p className="text-sm text-secondary leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* WHO AWaRe */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-dark mb-2">WHO AWaRe Classification</h3>
          <p className="text-secondary text-sm mb-6">
            The AWaRe framework groups antibiotics into three categories to guide prescribing decisions and monitor resistance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {aware.map(({ label, color, bg, desc }, i) => (
              <motion.div
                key={label}
                className={`border rounded-2xl p-5 ${bg}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.50, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
                whileHover={{ y: -6, boxShadow: "0 14px 40px rgba(0,0,0,0.10)", scale: 1.02 }}
              >
                <p className={`text-lg font-semibold mb-2 ${color}`}>{label}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Practical tips */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-dark mb-6">Practical tips</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tips.map(({ title, desc }) => (
              <motion.div
                key={title}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5"
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(124,58,237,0.12)", borderColor: "rgba(124,58,237,0.20)" }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              >
                <p className="font-semibold text-dark mb-1">{title}</p>
                <p className="text-sm text-secondary leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reference */}
        <motion.div
          className="rounded-xl p-4 text-xs text-secondary flex gap-3 items-start shadow-sm"
          style={{ background: "linear-gradient(180deg,#7C3AED,#2563EB) 0 0 / 3px 100% no-repeat, white", border: "1px solid rgba(124,58,237,0.15)", borderLeft: "none" }}
          whileHover={{ boxShadow: "0 8px 28px rgba(124,58,237,0.12)", scale: 1.01 }}
          transition={{ duration: 0.25 }}
        >
          <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
            style={{ background: "linear-gradient(135deg,#7C3AED,#2563EB)" }}>
            R
          </span>
          <span>
            <strong className="text-dark">Reference:</strong> WHO (2019). Antimicrobial stewardship programmes in health-care facilities
            in low- and middle-income countries. WHO Practical Toolkit; Pulcini C, et al. (2019).
            Developing core elements and checklist items for global hospital antimicrobial stewardship programmes.
            <em> Clinical Microbiology and Infection</em>, 25(1), 20–25.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
