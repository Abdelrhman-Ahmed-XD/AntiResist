import { motion } from 'framer-motion';
import {
  XCircle, AlertTriangle, Sun, Droplets, Thermometer,
  Package, Trash2, CheckCircle2,
} from 'lucide-react';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const PILLARS = [
  {
    id: 'use',
    emoji: '💊',
    title: 'Use It Right',
    accent: '#F59E0B',
    glow: 'rgba(245,158,11,0.35)',
    items: [
      { icon: XCircle,       color: '#EF4444', label: "Don't use leftover antibiotics",  detail: 'Increases resistance and delays proper treatment for the actual infection.' },
      { icon: XCircle,       color: '#EF4444', label: "Don't share antibiotics",          detail: 'Each prescription is tailored to a specific person, infection, and dosage.' },
      { icon: XCircle,       color: '#EF4444', label: "Don't stop early — complete the course", detail: 'Even if you feel better, stopping early can leave bacteria alive and resistant.' },
      { icon: AlertTriangle, color: '#F59E0B', label: 'Always check expiry dates',       detail: 'Expired antibiotics lose potency and may cause unintended harm.' },
    ],
  },
  {
    id: 'store',
    emoji: '📦',
    title: 'Store It Right',
    accent: '#3B82F6',
    glow: 'rgba(59,130,246,0.35)',
    items: [
      { icon: Sun,         color: '#F59E0B', label: 'Keep away from heat & sunlight',         detail: 'Store in a cool, dry place — not near a stove or on a windowsill.' },
      { icon: Droplets,    color: '#60A5FA', label: 'Avoid humidity — never in bathrooms',     detail: 'Moisture degrades tablets and capsules, reducing their effectiveness.' },
      { icon: Thermometer, color: '#34D399', label: 'Refrigerate specific liquid antibiotics', detail: 'Amoxicillin suspension and Augmentin liquid must be refrigerated after mixing.' },
      { icon: Package,     color: '#A78BFA', label: 'Keep in original packaging',              detail: 'Labels carry dosing info, batch numbers, and expiry dates.' },
    ],
  },
  {
    id: 'dispose',
    emoji: '♻️',
    title: 'Dispose It Right',
    accent: '#10B981',
    glow: 'rgba(16,185,129,0.35)',
    items: [
      { icon: XCircle,      color: '#EF4444', label: "Don't flush or pour down the sink",   detail: 'Antibiotic residues contaminate water supplies and drive environmental resistance.' },
      { icon: CheckCircle2, color: '#10B981', label: 'Use local pharmacy take-back programs', detail: 'Return unused antibiotics to pharmacies or designated collection points.' },
      { icon: CheckCircle2, color: '#10B981', label: 'Remove personal information first',    detail: 'Scratch out your name and prescription details before returning the packaging.' },
    ],
  },
];

export default function MedicineCabinet() {
  return (
    <section id="medicine-cabinet" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label mb-4 mx-auto">Patient Safety</div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Smart Medicine Cabinet
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Three rules every patient must follow to protect themselves — and fight antibiotic resistance.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {PILLARS.map(({ id, emoji, title, accent, glow, items }) => (
            <motion.div
              key={id}
              variants={cardVariant}
              whileHover={{ y: -5, boxShadow: `0 0 28px ${glow}`, borderColor: accent + '55' }}
              className="glass-card rounded-2xl p-8 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: accent + '18', border: `1px solid ${accent}30` }}
                >
                  {emoji}
                </div>
                <h3 className="text-white font-bold text-xl">{title}</h3>
              </div>

              <div className="space-y-4">
                {items.map(({ icon: Icon, color, label, detail }) => (
                  <div key={label} className="flex gap-3">
                    <Icon size={16} style={{ color }} className="shrink-0 mt-0.5" strokeWidth={2} />
                    <div>
                      <span className="text-sm font-semibold text-white block mb-0.5">{label}</span>
                      <p className="text-slate-400 text-xs leading-relaxed">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 h-px w-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${glow}, transparent)` }} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
