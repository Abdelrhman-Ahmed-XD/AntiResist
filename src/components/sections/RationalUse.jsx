import { Pill } from "lucide-react";

const causes = [
  {
    n: 1,
    title: "Overuse in viral infections",
    desc: "Antibiotics are frequently prescribed for colds, flu, and other viral illnesses where they have no effect, accelerating resistance.",
  },
  {
    n: 2,
    title: "Misuse — wrong dose or duration",
    desc: "Incomplete courses, incorrect dosing, or stopping treatment early allows partially resistant bacteria to survive and multiply.",
  },
  {
    n: 3,
    title: "Broad-spectrum overuse",
    desc: "Using wide-spectrum antibiotics when narrow-spectrum agents would suffice kills beneficial bacteria and drives resistance faster.",
  },
  {
    n: 4,
    title: "Poor infection control",
    desc: "Inadequate hand hygiene, sterilisation, and isolation practices in healthcare settings spread resistant organisms between patients.",
  },
  {
    n: 5,
    title: "Agricultural overuse",
    desc: "Antibiotics used as growth promoters and disease prevention in livestock create reservoirs of resistant bacteria that can transfer to humans.",
  },
  {
    n: 6,
    title: "Lack of diagnostic testing",
    desc: "Prescribing without culture and sensitivity data leads to empiric therapy with broad agents rather than targeted treatment.",
  },
];

export default function RationalUse() {
  return (
    <section id="rational-use" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Badge */}
        <div className="flex items-center gap-2 text-sm font-medium text-teal mb-4">
          <Pill size={16} strokeWidth={1.5} />
          Point 2
        </div>

        <h2 className="text-3xl sm:text-4xl font-semibold text-dark mb-4">
          Most common causes of antibiotic resistance
        </h2>
        <p className="text-secondary leading-relaxed max-w-2xl mb-12">
          Resistance does not arise randomly — it is driven by specific, preventable behaviours
          in healthcare, agriculture, and the community.
        </p>

        {/* Cause cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {causes.map(({ n, title, desc }) => (
            <div key={n} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex gap-4">
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-teal/10 text-teal font-semibold text-sm flex items-center justify-center">
                {n}
              </span>
              <div>
                <p className="font-semibold text-dark mb-1">{title}</p>
                <p className="text-sm text-secondary leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reference */}
        <div className="text-xs text-secondary border border-gray-100 rounded-xl p-4">
          <strong className="text-dark">Reference:</strong> WHO (2021). Antimicrobial resistance.
          Global action plan on antimicrobial resistance. World Health Organization.
        </div>
      </div>
    </section>
  );
}
