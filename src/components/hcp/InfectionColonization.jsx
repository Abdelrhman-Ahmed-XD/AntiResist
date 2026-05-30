import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, AlertTriangle, CheckCircle2, XCircle,
  FlaskConical, Thermometer, Heart, Users, ShieldAlert, Info,
} from 'lucide-react';

/* ── Checkbox input data ─────────────────────────────────── */
const SYMPTOM_OPTS = [
  { id: 'fever',         label: 'Fever (≥38°C)',       group: 'significant' },
  { id: 'pain',          label: 'Localized pain / tenderness', group: 'significant' },
  { id: 'cough',         label: 'Productive cough',    group: 'significant' },
  { id: 'dysuria',       label: 'Dysuria / urinary symptoms', group: 'significant' },
  { id: 'no_symptoms',   label: 'No symptoms',          group: 'none' },
  { id: 'mild_symptoms', label: 'Mild / nonspecific symptoms', group: 'mild' },
];

const LAB_OPTS = [
  { id: 'elevated_wbc', label: 'Elevated WBCs (leukocytosis)' },
  { id: 'elevated_crp', label: 'Elevated CRP / Procalcitonin' },
  { id: 'normal_markers', label: 'Normal inflammatory markers' },
];

const CULTURE_OPTS = [
  { id: 'positive', label: 'Positive culture' },
  { id: 'negative', label: 'Negative culture' },
];

const STATUS_OPTS = [
  { id: 'stable',    label: 'Clinically stable' },
  { id: 'unstable',  label: 'Hemodynamically unstable' },
];

/* ── Logic ───────────────────────────────────────────────── */
function evaluate({ symptoms, labs, culture, status }) {
  const significant = symptoms.some(s => ['fever', 'pain', 'cough', 'dysuria'].includes(s));
  const hasInflammation = labs.some(l => ['elevated_wbc', 'elevated_crp'].includes(l));
  const normalMarkers = labs.includes('normal_markers');
  const noSymptoms = symptoms.includes('no_symptoms');
  const mildSymptoms = symptoms.includes('mild_symptoms');
  const positive = culture === 'positive';
  const stable = status === 'stable';

  if (!culture) return null;

  if (positive && significant && hasInflammation) {
    return {
      verdict: 'infection',
      title: 'Findings More Consistent With Infection',
      color: '#EF4444',
      glow: 'rgba(239,68,68,0.25)',
      border: 'rgba(239,68,68,0.4)',
      bg: 'rgba(239,68,68,0.1)',
      Icon: AlertTriangle,
      actions: [
        'Review culture and sensitivities, target therapy accordingly.',
        'Initiate appropriate antibiotic treatment.',
        'Reassess clinical response at 48 to 72 hours.',
        'Deescalate therapy once organism is identified.',
      ],
    };
  }

  if (positive && noSymptoms && normalMarkers && stable) {
    return {
      verdict: 'colonization',
      title: 'Colonization May Be Possible',
      color: '#10B981',
      glow: 'rgba(16,185,129,0.25)',
      border: 'rgba(16,185,129,0.4)',
      bg: 'rgba(16,185,129,0.1)',
      Icon: CheckCircle2,
      actions: [
        'Avoid unnecessary antibiotics, treating colonization drives resistance.',
        'Treat the patient, not the culture alone.',
        'Reassess if clinical status changes.',
        'Maintain infection prevention measures (hand hygiene, contact precautions).',
      ],
      note: 'Remember: a positive culture in an asymptomatic, stable patient often represents colonization, not infection.',
    };
  }

  if (positive && mildSymptoms && !hasInflammation) {
    return {
      verdict: 'correlation',
      title: 'Clinical Correlation Required',
      color: '#F59E0B',
      glow: 'rgba(245,158,11,0.25)',
      border: 'rgba(245,158,11,0.4)',
      bg: 'rgba(245,158,11,0.1)',
      Icon: AlertTriangle,
      actions: [
        'Further clinical assessment is necessary before escalating therapy.',
        'Consider imaging or additional diagnostics.',
        'Repeat labs and re-examine the patient.',
        'Consult Infectious Disease if uncertainty persists.',
      ],
    };
  }

  return {
    verdict: 'insufficient',
    title: 'Insufficient Data for Determination',
    color: '#6B7280',
    glow: 'rgba(107,114,128,0.2)',
    border: 'rgba(107,114,128,0.3)',
    bg: 'rgba(107,114,128,0.08)',
    Icon: Info,
    actions: [
      'Complete all assessment fields to generate a clinical impression.',
    ],
  };
}

/* ── Checkbox Button ─────────────────────────────────────── */
function CheckBtn({ checked, onChange, label, accent = '#8B5CF6' }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group select-none" onClick={onChange}>
      <div
        className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all duration-200"
        style={{
          background: checked ? `${accent}30` : 'rgba(255,255,255,0.06)',
          border: `1px solid ${checked ? accent + '70' : 'rgba(255,255,255,0.12)'}`,
        }}
      >
        {checked && <div className="w-2 h-2 rounded-sm" style={{ background: accent }} />}
      </div>
      <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">{label}</span>
    </label>
  );
}

/* ── Radio Button ────────────────────────────────────────── */
function RadioBtn({ selected, value, onChange, label, accent = '#3B82F6' }) {
  const active = selected === value;
  return (
    <label className="flex items-center gap-3 cursor-pointer group select-none" onClick={() => onChange(active ? '' : value)}>
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-200"
        style={{
          background: active ? `${accent}30` : 'rgba(255,255,255,0.06)',
          border: `1px solid ${active ? accent + '70' : 'rgba(255,255,255,0.12)'}`,
        }}
      >
        {active && <div className="w-2 h-2 rounded-full" style={{ background: accent }} />}
      </div>
      <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">{label}</span>
    </label>
  );
}

/* ── Panel Box ───────────────────────────────────────────── */
function PanelBox({ title, children, accent = 'rgba(255,255,255,0.08)' }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
      <p className="text-slate-300 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: accent }}>{title}</p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function InfectionColonization() {
  const [symptoms, setSymptoms] = useState([]);
  const [labs, setLabs]         = useState([]);
  const [culture, setCulture]   = useState('');
  const [status, setStatus]     = useState('');

  const toggleSymptom = id => {
    if (id === 'no_symptoms') {
      setSymptoms(prev => prev.includes('no_symptoms') ? [] : ['no_symptoms']);
      return;
    }
    if (id === 'mild_symptoms') {
      setSymptoms(prev => prev.includes('mild_symptoms') ? [] : ['mild_symptoms']);
      return;
    }
    setSymptoms(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : prev.filter(s => s !== 'no_symptoms' && s !== 'mild_symptoms').concat(id)
    );
  };

  const toggleLab = id => {
    if (id === 'normal_markers') {
      setLabs(prev => prev.includes('normal_markers') ? [] : ['normal_markers']);
      return;
    }
    setLabs(prev =>
      prev.includes(id)
        ? prev.filter(l => l !== id)
        : prev.filter(l => l !== 'normal_markers').concat(id)
    );
  };

  const resetAll = () => { setSymptoms([]); setLabs([]); setCulture(''); setStatus(''); };

  const result = evaluate({ symptoms, labs, culture, status });

  return (
    <section id="infection-colonization" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#60A5FA' }}
          >
            <Activity size={12} />
            Clinical Decision Support
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
            Infection vs <span style={{ color: '#3B82F6' }}>Colonization</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Evaluate culture results in clinical context. Treating colonization drives resistance, C. diff, and side effects.
          </p>
        </motion.div>

        {/* Why it matters + Prevention banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <div className="rounded-xl p-5" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert size={16} style={{ color: '#EF4444' }} />
              <span className="text-red-300 font-semibold text-sm">Why It Matters</span>
            </div>
            <ul className="space-y-1.5">
              {['Unnecessary antibiotics accelerate resistance.', 'Treating colonization risks C. difficile infection.', 'Antibiotic side effects harm patients without benefit.'].map(t => (
                <li key={t} className="flex items-start gap-2">
                  <XCircle size={13} style={{ color: '#EF4444' }} className="shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-xs">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl p-5" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} style={{ color: '#10B981' }} />
              <span className="text-emerald-300 font-semibold text-sm">Infection Prevention</span>
            </div>
            <ul className="space-y-1.5">
              {['Strict hand hygiene before and after patient contact.', 'Apply contact precautions for resistant organisms.', 'Isolate patients with confirmed or suspected MDR pathogens.'].map(t => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 size={13} style={{ color: '#10B981' }} className="shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-xs">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Input panel */}
          <motion.div
            className="lg:col-span-2 rounded-2xl p-6 flex flex-col gap-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <PanelBox title="Symptoms" accent="#A78BFA">
              {SYMPTOM_OPTS.map(({ id, label }) => (
                <CheckBtn
                  key={id}
                  checked={symptoms.includes(id)}
                  onChange={() => toggleSymptom(id)}
                  label={label}
                  accent="#8B5CF6"
                />
              ))}
            </PanelBox>

            <PanelBox title="Lab Results" accent="#60A5FA">
              {LAB_OPTS.map(({ id, label }) => (
                <CheckBtn
                  key={id}
                  checked={labs.includes(id)}
                  onChange={() => toggleLab(id)}
                  label={label}
                  accent="#3B82F6"
                />
              ))}
            </PanelBox>

            <PanelBox title="Culture Result" accent="#34D399">
              {CULTURE_OPTS.map(({ id, label }) => (
                <RadioBtn key={id} selected={culture} value={id} onChange={setCulture} label={label} accent="#10B981" />
              ))}
            </PanelBox>

            <PanelBox title="Patient Status" accent="#FCD34D">
              {STATUS_OPTS.map(({ id, label }) => (
                <RadioBtn key={id} selected={status} value={id} onChange={setStatus} label={label} accent="#F59E0B" />
              ))}
            </PanelBox>

            <button
              onClick={resetAll}
              className="mt-auto w-full py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-300 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
            >
              Reset All Fields
            </button>
          </motion.div>

          {/* Output panel */}
          <div className="lg:col-span-3 flex flex-col">
            <AnimatePresence mode="wait">
              {!result || result.verdict === 'insufficient' ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 rounded-2xl flex flex-col items-center justify-center text-center p-12"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', minHeight: 400 }}
                >
                  <FlaskConical size={40} className="text-slate-600 mb-4" />
                  <p className="text-slate-500 text-base">
                    Complete the assessment fields<br />
                    <strong className="text-slate-400">to generate a clinical impression</strong>
                  </p>
                  <p className="text-slate-600 text-xs mt-3 max-w-xs">
                    At minimum, select a culture result to begin. Add symptoms and labs for a more detailed assessment.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={result.verdict}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-4"
                >
                  {/* Verdict card */}
                  <div className="rounded-2xl p-6" style={{ background: result.bg, border: `1px solid ${result.border}`, boxShadow: `0 0 24px ${result.glow}` }}>
                    <div className="flex items-center gap-3 mb-4">
                      <result.Icon size={24} style={{ color: result.color }} strokeWidth={2} />
                      <h3 className="text-white font-bold text-lg">{result.title}</h3>
                    </div>
                    {result.note && (
                      <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${result.border}` }}>
                        <p className="text-sm" style={{ color: result.color }}>{result.note}</p>
                      </div>
                    )}
                  </div>

                  {/* Recommended actions */}
                  <div
                    className="rounded-2xl p-6"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', backdropFilter: 'blur(20px)' }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 size={16} style={{ color: '#3B82F6' }} />
                      <span className="text-blue-300 font-semibold text-sm">Recommended Actions</span>
                    </div>
                    <ul className="space-y-2.5">
                      {result.actions.map((a, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-blue-500 mt-0.5 shrink-0">›</span>
                          <span className="text-slate-200 text-sm leading-relaxed">{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stewardship reminder */}
                  <div
                    className="rounded-xl p-4 flex items-start gap-3"
                    style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)' }}
                  >
                    <AlertTriangle size={16} style={{ color: '#F59E0B' }} className="shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-xs leading-relaxed">
                      <span className="text-amber-300 font-semibold">Stewardship Reminder: </span>
                      Always correlate culture results with the full clinical picture. A positive culture alone is never sufficient justification for antibiotic therapy.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-slate-600 text-xs text-center mt-8">
          Clinical decision support tool only. Apply local antibiogram data, institutional protocols, and specialist guidance for complex cases.
        </p>
      </div>
    </section>
  );
}
