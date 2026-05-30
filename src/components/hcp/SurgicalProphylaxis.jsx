import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Clock, ChevronRight, AlertTriangle,
  CheckCircle2, Pill, Stethoscope, XCircle,
} from 'lucide-react';

/* ── Surgery Data ────────────────────────────────────────── */
const SURGERIES = [
  {
    id: 'orthopedic',
    emoji: '🦴',
    title: 'Orthopedic',
    accent: '#F59E0B',
    first: 'Cefazolin 2g IV (3g if ≥120 kg)',
    alternatives: [
      'Cefuroxime 1.5g IV for mild penicillin allergy',
      'Clindamycin 900mg IV for severe penicillin allergy',
      'Add Vancomycin 15mg/kg IV if MRSA risk factor present',
    ],
    timing: 'Within 60 min before incision (Vancomycin: 120 min before)',
    duration: 'Single dose or ≤24h post-op',
  },
  {
    id: 'cesarean',
    emoji: '👶',
    title: 'Cesarean Section',
    accent: '#A78BFA',
    first: 'Cefazolin 2g IV',
    alternatives: [
      'Clindamycin 900mg IV + Gentamicin 5mg/kg IV for penicillin allergy',
    ],
    timing: 'Within 60 min BEFORE skin incision, not after cord clamping',
    duration: 'Single dose only',
  },
  {
    id: 'colorectal',
    emoji: '🩺',
    title: 'Colorectal',
    accent: '#10B981',
    first: 'Cefazolin 2g IV + Metronidazole 500mg IV',
    alternatives: [
      'Clindamycin 900mg IV + Gentamicin for penicillin allergy',
    ],
    timing: 'Within 60 min before incision',
    duration: 'Single dose or ≤24h post-op',
  },
  {
    id: 'neurosurgery',
    emoji: '🧠',
    title: 'Neurosurgery',
    accent: '#60A5FA',
    first: 'Cefazolin 2g IV',
    alternatives: [
      'Clindamycin 900mg IV for penicillin allergy',
      'Vancomycin 15mg/kg IV for MRSA risk or severe allergy',
    ],
    timing: 'Within 60 min before incision',
    duration: 'Single dose',
  },
  {
    id: 'thoracic',
    emoji: '🫁',
    title: 'Thoracic',
    accent: '#34D399',
    first: 'Cefazolin 2g IV',
    alternatives: [
      'Clindamycin 900mg IV for penicillin allergy',
      'Add Vancomycin 15mg/kg for MRSA risk or severe allergy',
    ],
    timing: 'Within 60 min before incision',
    duration: 'Stop at ≤24h post-op',
    note: 'Do NOT continue prophylaxis because of chest tube presence.',
  },
  {
    id: 'dental',
    emoji: '🦷',
    title: 'Dental (High Risk)',
    accent: '#F97316',
    first: 'Amoxicillin 2g PO',
    alternatives: [
      'Clindamycin 600mg PO for penicillin allergy',
    ],
    timing: '30–60 min before procedure',
    duration: 'Single dose only',
  },
  {
    id: 'cardiac',
    emoji: '🫀',
    title: 'Cardiac',
    accent: '#EF4444',
    first: 'Cefazolin 2g IV',
    alternatives: [
      'Vancomycin 15mg/kg + Cefazolin for MRSA risk',
      'Vancomycin 15mg/kg alone for severe penicillin allergy',
    ],
    timing: 'Within 60 min before incision',
    duration: 'Stop at ≤24h post-op',
  },
];

const STEWARDSHIP_RULES = [
  { icon: XCircle,      color: '#EF4444', text: 'Do not prescribe prophylaxis "just in case"' },
  { icon: Clock,        color: '#F59E0B', text: 'Timing over duration — timing is the most critical factor' },
  { icon: CheckCircle2, color: '#10B981', text: 'Discontinue within 24h of procedure completion' },
  { icon: Pill,         color: '#60A5FA', text: 'Single-dose is usually sufficient for most procedures' },
  { icon: XCircle,      color: '#EF4444', text: 'Prophylaxis is NOT treatment — do not extend if infection suspected' },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const cardAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function SurgicalProphylaxis() {
  const [selected, setSelected] = useState(null);
  const surgery = SURGERIES.find(s => s.id === selected);

  return (
    <section id="surgical-prophylaxis" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34D399' }}
          >
            <Shield size={12} />
            Surgical Stewardship
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
            Surgical <span style={{ color: '#10B981' }}>Prophylaxis</span> Guide
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Select a procedure type to view evidence-based antimicrobial prophylaxis recommendations.
          </p>
        </motion.div>

        {/* Surgery type grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-8"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {SURGERIES.map(({ id, emoji, title, accent }) => (
            <motion.button
              key={id}
              variants={cardAnim}
              onClick={() => setSelected(selected === id ? null : id)}
              whileHover={{ y: -3, boxShadow: `0 8px 24px ${accent}30` }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl transition-all duration-200"
              style={{
                background: selected === id ? `${accent}18` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${selected === id ? accent + '50' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: selected === id ? `0 0 20px ${accent}30` : 'none',
              }}
            >
              <span className="text-3xl">{emoji}</span>
              <span
                className="text-xs font-semibold text-center leading-tight"
                style={{ color: selected === id ? accent : '#94A3B8' }}
              >
                {title}
              </span>
              {selected === id && (
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {!surgery ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center py-14 rounded-2xl mb-8"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
            >
              <Stethoscope size={36} className="text-slate-600 mb-3" />
              <p className="text-slate-500 text-sm">Select a procedure above to view prophylaxis recommendations</p>
            </motion.div>
          ) : (
            <motion.div
              key={surgery.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl p-6 sm:p-8 mb-8"
              style={{
                background: `${surgery.accent}0d`,
                border: `1px solid ${surgery.accent}35`,
                backdropFilter: 'blur(20px)',
                boxShadow: `0 0 32px ${surgery.accent}18`,
              }}
            >
              {/* Panel header */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{surgery.emoji}</span>
                <div>
                  <h3 className="text-white font-bold text-xl">{surgery.title}</h3>
                  <p className="text-slate-400 text-sm">Antimicrobial Prophylaxis Protocol</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* First-line */}
                <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${surgery.accent}25` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Pill size={15} style={{ color: surgery.accent }} />
                    <span className="font-semibold text-sm" style={{ color: surgery.accent }}>First-Line Agent</span>
                  </div>
                  <p className="text-white font-bold text-base">{surgery.first}</p>
                </div>

                {/* Alternatives */}
                <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <ChevronRight size={15} style={{ color: '#94A3B8' }} />
                    <span className="font-semibold text-sm text-slate-400">Alternatives</span>
                  </div>
                  <ul className="space-y-1.5">
                    {surgery.alternatives.map((alt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-500 mt-0.5 shrink-0 text-xs">•</span>
                        <span className="text-slate-300 text-sm leading-snug">{alt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Timing */}
                <div className="rounded-xl p-5" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={15} style={{ color: '#F59E0B' }} />
                    <span className="font-semibold text-sm text-amber-300">Timing</span>
                  </div>
                  <p className="text-slate-200 text-sm">{surgery.timing}</p>
                </div>

                {/* Duration */}
                <div className="rounded-xl p-5" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.22)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={15} style={{ color: '#10B981' }} />
                    <span className="font-semibold text-sm text-emerald-300">Duration</span>
                  </div>
                  <p className="text-slate-200 text-sm">{surgery.duration}</p>
                </div>
              </div>

              {/* Special note */}
              {surgery.note && (
                <div className="mt-5 flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <AlertTriangle size={16} style={{ color: '#EF4444' }} className="shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm font-semibold">{surgery.note}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Stewardship Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(16,185,129,0.08) 100%)',
            border: '1px solid rgba(59,130,246,0.25)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <Shield size={20} style={{ color: '#60A5FA' }} />
            <h3 className="text-white font-bold text-base uppercase tracking-wide">
              Global Antimicrobial Stewardship Rules
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {STEWARDSHIP_RULES.map(({ icon: Icon, color, text }, i) => (
              <div
                key={i}
                className="flex flex-col items-start gap-2 p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Icon size={18} style={{ color }} strokeWidth={2} />
                <p className="text-slate-300 text-xs leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-slate-600 text-xs text-center mt-6">
          Based on ASHP/IDSA/SIS/SHEA guidelines. Always apply local resistance patterns and institutional protocols. Consult pharmacy for weight-based dosing adjustments.
        </p>
      </div>
    </section>
  );
}
