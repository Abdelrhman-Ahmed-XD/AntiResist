import { useRef } from 'react';
import { Globe, BedDouble, Scissors, Activity } from "lucide-react";
import { motion, useInView } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

const VP   = { once: true, amount: 0.08 };
const ease = [0.22, 1, 0.36, 1];

const GRAD = {
  background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const impactCards = [
  {
    icon: BedDouble,
    title: "General Wards",
    points: [
      "Longer hospital stays due to treatment failures",
      "Higher costs from second and third line agents",
      "Increased in hospital mortality rates",
    ],
  },
  {
    icon: Scissors,
    title: "Surgical Procedures",
    points: [
      "Higher risk of post operative infections",
      "Limited prophylaxis options for high risk surgery",
      "Delayed wound healing from resistant organisms",
    ],
  },
  {
    icon: Activity,
    title: "ICUs",
    points: [
      "Extended mechanical ventilation days",
      "Critically limited last resort treatment options",
      "Higher case fatality rates in sepsis patients",
    ],
  },
];

const egyptData = [
  { name: "MRSA",              rate: 63,   color: "#F97316" },
  { name: "ESBL E.coli/K.pn.",  rate: 85,   color: "#EF4444" },
  { name: "Colistin-R CRKP",    rate: 45.7, color: "#3B82F6" },
  { name: "MDR A. baumannii",   rate: 100,  color: "#DC2626" },
  { name: "MDR P. aeruginosa",  rate: 70,   color: "#EF4444" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-2 text-sm">
      <p className="font-semibold text-dark">{label}</p>
      <p className="text-secondary">{payload[0].value}% resistance rate</p>
    </div>
  );
};

export default function Impact() {
  const headerRef = useRef(null);
  const cardsRef  = useRef(null);
  const chartRef  = useRef(null);

  const headerInView = useInView(headerRef, VP);
  const cardsInView  = useInView(cardsRef,  VP);
  const chartInView  = useInView(chartRef,  VP);

  return (
    <section id="impact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold mb-4" style={GRAD}>
              <Globe size={16} strokeWidth={1.5} />
              Point 3
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-dark mb-4">
              Impact of AMR on healthcare systems
            </h2>
            <p className="text-secondary leading-relaxed max-w-2xl mb-12">
              Resistant infections affect every area of the hospital, driving up costs,
              lengthening stays, and limiting treatment options across all specialties.
            </p>
          </motion.div>
        </div>

        {/* Impact cards */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {impactCards.map(({ icon: Icon, title, points }, i) => (
            <motion.div
              key={title}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6"
              initial={{ opacity: 0, y: 24 }}
              animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.5, ease, delay: cardsInView ? i * 0.12 : 0 }}
              whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(37,99,235,0.13)", borderColor: "rgba(37,99,235,0.22)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(37,99,235,0.12))", border: "1px solid rgba(124,58,237,0.2)" }}>
                <Icon size={20} strokeWidth={1.5} style={{ color: "#7C3AED" }} />
              </div>
              <p className="font-semibold text-dark mb-3">{title}</p>
              <ul className="space-y-2">
                {points.map((pt) => (
                  <li key={pt} className="text-sm text-secondary flex gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#7C3AED,#2563EB)" }} />
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Egypt resistance chart */}
        <div ref={chartRef}>
          <motion.div
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={chartInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.55, ease }}
          >
            <h3 className="text-xl font-semibold text-dark mb-1">
              Resistance rates in Egypt
            </h3>
            <p className="text-sm text-secondary mb-6">
              Percentage of isolates resistant to key antibiotics (reported ranges, Egyptian studies)
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={egyptData}
                layout="vertical"
                barSize={22}
                margin={{ top: 0, right: 40, left: 10, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
                <Bar dataKey="rate" radius={[0, 6, 6, 0]}>
                  {egyptData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <p className="text-xs text-secondary mb-6">
          * Rates represent ranges reported across Egyptian hospital-based studies. Values may vary by region and study period.
        </p>

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
            <strong className="text-dark">Reference:</strong> Saber S, et al. (2023). Antimicrobial resistance
            patterns in Egyptian hospitals: a systematic review. <em>Journal of Global Antimicrobial Resistance</em>;
            Karam G, et al. (2016). Antimicrobial resistance threats in the 21st century. <em>Journal of Global Antimicrobial Resistance</em>, 6, 1 to 3.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
