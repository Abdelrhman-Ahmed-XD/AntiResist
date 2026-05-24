import { useRef } from 'react';
import { Pill } from "lucide-react";
import { motion, useInView } from "framer-motion";

const VP   = { once: true, amount: 0.08 };
const ease = [0.22, 1, 0.36, 1];

const GRAD = {
  background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const causes = [
  {
    n: 1,
    title: "Overuse in viral infections",
    desc: "Antibiotics are frequently prescribed for colds, flu, and other viral illnesses where they have no effect, accelerating resistance.",
  },
  {
    n: 2,
    title: "Misuse: wrong dose or incomplete duration",
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
  const headerRef = useRef(null);
  const cardsRef  = useRef(null);

  const headerInView = useInView(headerRef, VP);
  const cardsInView  = useInView(cardsRef,  VP);

  return (
    <section id="rational-use" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold mb-4" style={GRAD}>
              <Pill size={16} strokeWidth={1.5} />
              Point 2
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-dark mb-4">
              Most common causes of antibiotic resistance
            </h2>
            <p className="text-secondary leading-relaxed max-w-2xl mb-12">
              Resistance does not arise randomly. It is driven by specific, preventable behaviours
              in healthcare, agriculture, and the community.
            </p>
          </motion.div>
        </div>

        {/* Cause cards */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {causes.map(({ n, title, desc }, i) => (
            <motion.div
              key={n}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex gap-4"
              initial={{ opacity: 0, y: 24 }}
              animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.5, ease, delay: cardsInView ? i * 0.08 : 0 }}
              whileHover={{ y: -4, boxShadow: "0 10px 36px rgba(124,58,237,0.13)", borderColor: "rgba(124,58,237,0.22)" }}
            >
              <span
                className="flex-shrink-0 w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
              >
                {n}
              </span>
              <div>
                <p className="font-semibold text-dark mb-1">{title}</p>
                <p className="text-sm text-secondary leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
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
            <strong className="text-dark">Reference:</strong> WHO (2021). Antimicrobial resistance.
            Global action plan on antimicrobial resistance. World Health Organization.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
