import { Shield } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

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

const COLORS = { AMR: "#2E5BFF", "HIV/AIDS": "#93C5FD", Malaria: "#6EE7B7" };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-2 text-sm">
      <p className="font-semibold text-dark">{label}</p>
      <p className="text-secondary">{payload[0].value}M deaths</p>
    </div>
  );
};

export default function WhatIsAMR() {
  return (
    <section id="what-is-amr" className="bg-bg py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Badge */}
        <div className="flex items-center gap-2 text-sm font-medium text-teal mb-4">
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

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {stats.map(({ value, label }) => (
            <div key={value} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <p className="text-4xl font-semibold text-primary mb-2">{value}</p>
              <p className="text-sm text-secondary leading-relaxed">{label}</p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-dark mb-1">
            AMR vs. other leading infectious killers
          </h3>
          <p className="text-sm text-secondary mb-6">Deaths in millions (2019)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barSize={48} margin={{ top: 0, right: 16, left: -16, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}M`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
              <Bar dataKey="deaths" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4">
            {chartData.map(({ name }) => (
              <span key={name} className="flex items-center gap-1.5 text-xs text-secondary">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: COLORS[name] }} />
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Reference */}
        <div className="text-xs text-secondary border border-gray-100 rounded-xl p-4">
          <strong className="text-dark">Reference:</strong> Murray CJ, et al. (2022). Global burden of bacterial
          antimicrobial resistance in 2019: a systematic analysis. <em>The Lancet</em>, 399(10325), 629–655.
        </div>
      </div>
    </section>
  );
}
