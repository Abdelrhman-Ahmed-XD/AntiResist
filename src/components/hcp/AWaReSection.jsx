import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Lock, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react';

const AWARE = [
  {
    label: 'ACCESS',
    icon: CheckCircle,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.28)',
    glow: 'rgba(16,185,129,0.18)',
    desc: 'First-line antibiotics for common infections. Widely available, affordable, with low resistance-selection risk.',
    examples: ['Amoxicillin', 'Ampicillin', 'Metronidazole', 'Trimethoprim', 'Nitrofurantoin', 'Doxycycline', 'Benzylpenicillin', 'Cefalexin'],
    usage: 'Preferred empirical choice for most community infections',
    target: '≥60% of total antibiotic consumption',
  },
  {
    label: 'WATCH',
    icon: AlertTriangle,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.28)',
    glow: 'rgba(245,158,11,0.18)',
    desc: 'Higher resistance potential. Critical importance for specific infections. Prescribe with caution and clear indication.',
    examples: ['Ciprofloxacin', 'Levofloxacin', 'Azithromycin', 'Ceftriaxone', 'Cefepime', 'Piperacillin-Tazobactam', 'Moxifloxacin'],
    usage: 'Use only when Access antibiotics are inappropriate',
    target: '<40% of total antibiotic consumption',
  },
  {
    label: 'RESERVE',
    icon: Lock,
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.28)',
    glow: 'rgba(239,68,68,0.18)',
    desc: 'Last-resort antibiotics for MDR / XDR organisms. Use only when all alternatives have failed or are not suitable.',
    examples: ['Meropenem', 'Imipenem-Cilastatin', 'Colistin', 'Tigecycline', 'Linezolid', 'Daptomycin', 'Ceftazidime-Avibactam'],
    usage: 'Consult Infectious Disease, MDR/XDR organisms only',
    target: 'Minimise use, monitor prescribing closely',
  },
];

const IV_PO_CRITERIA = [
  { ok: true,  text: 'Haemodynamically stable (MAP ≥65 mmHg without vasopressors)' },
  { ok: true,  text: 'Afebrile for ≥24 h or improving temperature trend' },
  { ok: true,  text: 'GI tract functioning, tolerating oral intake / no vomiting' },
  { ok: true,  text: 'Oral antibiotic equivalent with adequate bioavailability available' },
  { ok: true,  text: 'WBC normalising / improving inflammatory markers' },
  { ok: false, text: 'Endocarditis, meningitis, or CNS infection (IV required throughout)' },
  { ok: false, text: 'Persistent bacteraemia or fungaemia' },
  { ok: false, text: 'Severe immunocompromised state (neutropenic fever, SOT)' },
  { ok: false, text: 'Poorly-absorbed oral formulation for selected pathogen/site' },
];

const IV_PO_PAIRS = [
  { iv: 'Ampicillin / Amoxicillin IV',            po: 'Amoxicillin 500–1000 mg TDS',             ba: '~70%' },
  { iv: 'Co-amoxiclav (Augmentin) IV',             po: 'Co-amoxiclav 625 mg TDS',                 ba: '~70%' },
  { iv: 'Ciprofloxacin IV',                         po: 'Ciprofloxacin 500–750 mg BD',             ba: '~80%' },
  { iv: 'Levofloxacin IV',                          po: 'Levofloxacin 500–750 mg OD',              ba: '~99%' },
  { iv: 'Metronidazole IV',                         po: 'Metronidazole 400–500 mg TDS',            ba: '~100%' },
  { iv: 'Fluconazole IV',                           po: 'Fluconazole 150–400 mg OD',               ba: '~90%' },
  { iv: 'Clindamycin IV',                           po: 'Clindamycin 300–450 mg QDS',              ba: '~90%' },
  { iv: 'Linezolid IV',                             po: 'Linezolid 600 mg BD',                     ba: '~100%' },
  { iv: 'Trimethoprim-Sulfamethoxazole IV',         po: 'Co-trimoxazole 960 mg BD',                ba: '~100%' },
  { iv: 'Doxycycline IV',                           po: 'Doxycycline 100 mg BD',                   ba: '~93%' },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function AWaReSection() {
  const [openCard, setOpenCard] = useState(null);

  return (
    <section id="aware-section" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
        >
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#60A5FA' }}>
            <ShieldCheck size={12} />
            WHO AWaRe Classification
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Prescribe Smarter,<br />
            <span style={{ color: '#3B82F6' }}>Not Broader</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            The WHO AWaRe framework categorises antibiotics to guide optimal selection,
            preserve last-resort agents, and reduce selection pressure driving resistance.
          </motion.p>
        </motion.div>

        {/* AWaRe Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16"
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
        >
          {AWARE.map(({ label, icon: Icon, color, bg, border, glow, desc, examples, usage, target }) => (
            <motion.div key={label} variants={fadeUp}
              onClick={() => setOpenCard(openCard === label ? null : label)}
              className="rounded-2xl p-6 cursor-pointer transition-all duration-300"
              style={{ background: bg, border: `1px solid ${border}`, backdropFilter: 'blur(20px)' }}
              whileHover={{ y: -4, boxShadow: `0 12px 40px ${glow}` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
                    {label}
                  </span>
                  <p className="text-slate-400 text-xs mt-0.5">{usage}</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-4">{desc}</p>

              <div className="text-xs font-semibold mb-2" style={{ color }}>Key Examples</div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {examples.map(ex => (
                  <span key={ex} className="px-2 py-0.5 rounded-full text-xs"
                    style={{ background: `${color}14`, color, border: `1px solid ${color}30` }}>
                    {ex}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Target: <span style={{ color }}>{target}</span></span>
                <motion.div
                  animate={{ rotate: openCard === label ? 90 : 0 }}
                  transition={{ duration: 0.2 }}>
                  <ArrowRight size={14} style={{ color }} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* IV-to-PO Switch Guide */}
        <motion.div
          className="rounded-2xl p-8"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <Clock size={18} style={{ color: '#10B981' }} />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">IV-to-PO Switch Guide</h3>
              <p className="text-slate-400 text-sm">Reduce IV line complications · Lower costs · Faster discharge</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Criteria */}
            <div>
              <p className="text-slate-300 text-sm font-semibold uppercase tracking-widest mb-4">
                Switch Criteria
              </p>
              <div className="space-y-2.5">
                {IV_PO_CRITERIA.map(({ ok, text }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {ok
                      ? <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: '#10B981' }} />
                      : <XCircle    size={15} className="shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
                    }
                    <span className={`text-sm ${ok ? 'text-slate-300' : 'text-slate-500'}`}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* IV-PO pairs table */}
            <div>
              <p className="text-slate-300 text-sm font-semibold uppercase tracking-widest mb-4">
                Equivalent Pairs
              </p>
              <div className="space-y-2">
                {IV_PO_PAIRS.map(({ iv, po, ba }) => (
                  <div key={iv}
                    className="flex items-center justify-between p-3 rounded-xl gap-2"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs text-slate-400 truncate">{iv}</span>
                      <ArrowRight size={12} className="shrink-0 text-emerald-500" />
                      <span className="text-xs text-white truncate">{po}</span>
                    </div>
                    <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                      {ba} BA
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
