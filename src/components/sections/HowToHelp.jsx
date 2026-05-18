import { useState } from "react";
import { HeartHandshake, Check } from "lucide-react";

const roles = ["Doctors", "Pharmacists", "Nurses", "Laboratory"];

const responsibilities = {
  Doctors: [
    { title: "Verify bacterial indication", desc: "Prescribe antibiotics only when there is clear evidence of a bacterial infection — not for viral illnesses." },
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
    { title: "Monitor for adverse effects", desc: "Observe for allergic reactions, C. difficile symptoms, and treatment failures — report promptly." },
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
  { title: "Complete the full course", desc: "Never stop antibiotics early even if you feel better — incomplete courses allow resistant bacteria to survive." },
  { title: "Never self-prescribe", desc: "Always consult a licensed healthcare professional before starting antibiotic therapy." },
  { title: "Culture first when possible", desc: "Send specimens for culture and sensitivity before starting antibiotics to enable targeted therapy." },
  { title: "De-escalate to targeted therapy", desc: "Switch from broad-spectrum to narrow-spectrum agents as soon as culture results are available." },
  { title: "Practice strict hand hygiene", desc: "Thorough handwashing is the single most effective measure to prevent spread of resistant organisms." },
  { title: "Educate every patient", desc: "Explain why completing the full course matters and why antibiotics should never be shared or saved." },
];

export default function HowToHelp() {
  const [activeRole, setActiveRole] = useState("Doctors");

  return (
    <section id="how-to-help" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Badge */}
        <div className="flex items-center gap-2 text-sm font-medium text-teal mb-4">
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

        {/* Role tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeRole === role
                  ? "bg-teal text-white"
                  : "bg-bg text-secondary hover:text-dark border border-gray-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Responsibility cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {responsibilities[activeRole].map(({ title, desc }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center">
                <Check size={16} strokeWidth={2} className="text-teal" />
              </span>
              <div>
                <p className="font-semibold text-dark mb-1">{title}</p>
                <p className="text-sm text-secondary leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* WHO AWaRe */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-dark mb-2">WHO AWaRe Classification</h3>
          <p className="text-secondary text-sm mb-6">
            The AWaRe framework groups antibiotics into three categories to guide prescribing decisions and monitor resistance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {aware.map(({ label, color, bg, desc }) => (
              <div key={label} className={`border rounded-2xl p-5 ${bg}`}>
                <p className={`text-lg font-semibold mb-2 ${color}`}>{label}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Practical tips */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-dark mb-6">Practical tips</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tips.map(({ title, desc }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 border-l-4 border-l-success">
                <p className="font-semibold text-dark mb-1">{title}</p>
                <p className="text-sm text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reference */}
        <div className="text-xs text-secondary border border-gray-100 rounded-xl p-4">
          <strong className="text-dark">Reference:</strong> WHO (2019). Antimicrobial stewardship programmes in health-care facilities
          in low- and middle-income countries. WHO Practical Toolkit; Pulcini C, et al. (2019).
          Developing core elements and checklist items for global hospital antimicrobial stewardship programmes.
          <em> Clinical Microbiology and Infection</em>, 25(1), 20–25.
        </div>
      </div>
    </section>
  );
}
