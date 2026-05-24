import { useRef } from 'react';
import { Shield } from "lucide-react";
import { motion, useInView } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

const VP = { once: true, amount: 0.08 };
const ease = [0.22, 1, 0.36, 1];

const GRAD = {
  background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const stats = [
  { value: "1.27M", label: "deaths directly caused by drug-resistant infections (2019)" },
  { value: "~5M",   label: "deaths globally linked to AMR annually" },
  { value: "#1",    label: "killed more than both HIV/AIDS and malaria in 2019" },
];

const chartData = [
  { name: "AMR",     deaths: 1.27 },
  { name: "HIV/AIDS",deaths: 0.86 },
  { name: "Malaria", deaths: 0.64 },
];

const COLORS = { AMR: "#7C3AED", "HIV/AIDS": "#6366F1", Malaria: "#2563EB" };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-purple-100 rounded-xl shadow-sm px-4 py-2 text-sm">
      <p className="font-semibold text-dark">{label}</p>
      <p className="text-secondary">{payload[0].value}M deaths</p>
    </div>
  );
};

export default function WhatIsAMR() {
  const headerRef = useRef(null);
  const cardsRef  = useRef(null);
  const chartRef  = useRef(null);

  const headerInView = useInView(headerRef, VP);
  const cardsInView  = useInView(cardsRef,  VP);
  const chartInView  = useInView(chartRef,  VP);

  return (
    <section id="what-is-amr" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold mb-4" style={GRAD}>
              <Shield size={16} strokeWidth={1.5} />
              Point 1
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-dark mb-4">
              What is antimicrobial resistance?
            </h2>
            <p className="text-secondary leading-relaxed max-w-2xl mb-12">
              Antimicrobial resistance (AMR) occurs when bacteria, viruses, fungi, and parasites
              evolve to resist the medicines designed to kill them. As a result, infections become
              harder to treat, increasing the risk of disease spread, severe illness, and death.
            </p>
          </motion.div>
        </div>

        {/* Stat cards */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={value}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6"
              initial={{ opacity: 0, y: 24 }}
              animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.5, ease, delay: cardsInView ? i * 0.1 : 0 }}
              whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(124,58,237,0.14)", borderColor: "rgba(124,58,237,0.25)" }}
            >
              <p className="text-4xl font-semibold mb-2" style={GRAD}>{value}</p>
              <p className="text-sm text-secondary leading-relaxed">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Bar chart */}
        <div ref={chartRef}>
          <motion.div
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={chartInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.55, ease }}
            whileHover={{ boxShadow: "0 8px 32px rgba(124,58,237,0.10)" }}
          >
            <h3 className="text-lg font-semibold text-dark mb-1">
              AMR vs. other leading infectious killers
            </h3>
            <p className="text-sm text-secondary mb-6">Deaths in millions (2019)</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} barSize={48} margin={{ top: 0, right: 16, left: -16, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}M`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124,58,237,0.04)" }} />
                <Bar dataKey="deaths" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4">
              {chartData.map(({ name }) => (
                <span key={name} className="flex items-center gap-1.5 text-xs text-secondary">
                  <span className="w-3 h-3 rounded-sm inline-block" style={{ background: COLORS[name] }} />
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
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
            <strong className="text-dark">Reference:</strong> Murray CJ, et al. (2022). Global burden of bacterial
            antimicrobial resistance in 2019: a systematic analysis. <em>The Lancet</em>, 399(10325), 629 to 655.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
