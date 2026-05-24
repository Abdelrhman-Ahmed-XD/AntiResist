import { useRef } from 'react';
import { motion, useInView } from "framer-motion";

const VP   = { once: true, amount: 0.08 };
const ease = [0.22, 1, 0.36, 1];

const aware = [
  {
    label: "Access",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    desc: "First line antibiotics for common infections. Widely available, low cost, low resistance risk. Examples: amoxicillin, doxycycline.",
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
    desc: "Last resort antibiotics for multidrug resistant infections. Use only when all other options have failed. Examples: colistin, carbapenems.",
  },
];

export default function HowToHelp() {
  const headerRef = useRef(null);
  const cardsRef  = useRef(null);

  const headerInView = useInView(headerRef, VP);
  const cardsInView  = useInView(cardsRef,  VP);

  return (
    <section id="how-to-help" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* WHO AWaRe */}
        <div ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.55, ease }}
          >
            <h3 className="text-3xl sm:text-4xl font-semibold text-dark mb-3">WHO AWaRe Classification</h3>
            <p className="text-secondary text-base mb-8 max-w-2xl leading-relaxed">
              The AWaRe framework groups antibiotics into three categories to guide prescribing decisions and monitor resistance.
            </p>
          </motion.div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {aware.map(({ label, color, bg, desc }, i) => (
            <motion.div
              key={label}
              className={`border rounded-2xl p-5 ${bg}`}
              initial={{ opacity: 0, y: 24 }}
              animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.5, ease, delay: cardsInView ? i * 0.12 : 0 }}
              whileHover={{ y: -6, boxShadow: "0 14px 40px rgba(0,0,0,0.10)", scale: 1.02 }}
            >
              <p className={`text-lg font-semibold mb-2 ${color}`}>{label}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
