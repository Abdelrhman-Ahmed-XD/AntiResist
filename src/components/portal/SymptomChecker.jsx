import { useState } from 'react';
import { AlertTriangle, Activity, Info, Zap, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';

const CATEGORIES = [
  { label: 'General',            color: 'text-purple-400', symptoms: ['Fever', 'High Fever (>39°C)', 'Fatigue', 'Body aches', 'Chills'] },
  { label: 'Respiratory',        color: 'text-blue-400',   symptoms: ['Cough', 'Dry cough', 'Productive cough', 'Sore throat', 'Runny nose', 'Nasal congestion', 'Sneezing', 'Shortness of breath'] },
  { label: 'Gastrointestinal',   color: 'text-amber-400',  symptoms: ['Diarrhea', 'Vomiting', 'Abdominal pain'] },
  { label: 'Urinary',            color: 'text-cyan-400',   symptoms: ['Burning urination', 'Frequent urination', 'Lower abdominal pain (urinary)'] },
  { label: 'Severe Red Flags', color: 'text-red-400', urgent: true,
    symptoms: ['Difficulty breathing', 'Chest pain', 'Persistent high fever', 'Symptoms lasting >7 days', 'Confusion', 'Severe dehydration'] },
];

function evaluate(selected) {
  const s = new Set(selected.map(x => x.toLowerCase()));
  const redFlags = ['difficulty breathing', 'chest pain', 'persistent high fever', 'symptoms lasting >7 days', 'confusion', 'severe dehydration'];
  if (redFlags.some(f => s.has(f))) return {
    level: 'emergency', icon: AlertTriangle,
    title: 'Seek Urgent Medical Attention Immediately',
    message: 'You have selected one or more red-flag symptoms that may indicate a serious or life-threatening condition.',
    advice: ['Call emergency services or go to the nearest A&E immediately.', 'Do not attempt to self-medicate.', 'These symptoms require professional clinical assessment urgently.'],
    borderColor: 'border-red-500/60', bgColor: 'bg-red-950/40', titleColor: 'text-red-400',
    badgeColor: 'bg-red-900/60 text-red-300', glowColor: 'rgba(239,68,68,0.3)',
  };
  const bacterialIndicators = ['productive cough', 'burning urination', 'frequent urination', 'high fever (>39°c)', 'lower abdominal pain (urinary)'];
  if (bacterialIndicators.some(f => s.has(f))) return {
    level: 'warning', icon: Activity,
    title: 'Medical Evaluation Recommended',
    message: 'Some of your symptoms may suggest a bacterial infection requiring diagnosis and possibly antibiotics, but only a healthcare professional can determine that.',
    advice: ['Consult a doctor or pharmacist as soon as possible.', 'Do not self-medicate with antibiotics.', 'Bring a list of your symptoms and their duration to the appointment.'],
    borderColor: 'border-yellow-500/60', bgColor: 'bg-yellow-950/40', titleColor: 'text-yellow-400',
    badgeColor: 'bg-yellow-900/60 text-yellow-300', glowColor: 'rgba(234,179,8,0.3)',
  };
  const viralIndicators = ['runny nose', 'sneezing', 'dry cough', 'sore throat', 'fever', 'nasal congestion', 'fatigue', 'body aches', 'chills'];
  if (viralIndicators.some(f => s.has(f))) return {
    level: 'viral', icon: Info,
    title: 'Likely Viral Infection: Antibiotics Not Indicated',
    message: 'Your selected symptoms are consistent with a viral illness. Antibiotics are ineffective against viruses and will not help you recover faster.',
    advice: ['Rest and stay well-hydrated.', 'Use over-the-counter symptom relief as appropriate.', 'Monitor your condition and consult a doctor if symptoms worsen or persist beyond 7 days.'],
    borderColor: 'border-emerald-500/60', bgColor: 'bg-emerald-950/40', titleColor: 'text-emerald-400',
    badgeColor: 'bg-emerald-900/60 text-emerald-300', glowColor: 'rgba(52,211,153,0.3)',
  };
  return null;
}

const panelVariant = {
  enter: { opacity: 0, y: 18, scale: 0.98 },
  show:  { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit:  { opacity: 0, y: -12, scale: 0.98, transition: { duration: 0.22 } },
};

export default function SymptomChecker() {
  const { addPoints, hasAction } = useGamification();
  const [checked, setChecked] = useState(new Set());
  const [result, setResult]   = useState(null);

  const toggle = (sym) => setChecked(prev => {
    const n = new Set(prev);
    n.has(sym) ? n.delete(sym) : n.add(sym);
    return n;
  });

  const check = () => {
    if (checked.size === 0) return;
    const r = evaluate([...checked]);
    setResult(r);
    if (!hasAction('symptom-check')) addPoints('symptom-check', 15);
  };

  const reset = () => { setChecked(new Set()); setResult(null); };

  return (
    <section id="symptom-checker" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label mb-4 mx-auto">Interactive Tool</div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Symptom Checker</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Select your current symptoms to receive guidance. Earn{' '}
            <span className="text-purple-400 font-semibold">+15 points</span> on first use.
          </p>
          <p className="text-slate-600 text-sm mt-2">
            ⚠ This tool is for educational purposes only and does not replace professional medical advice.
          </p>
        </motion.div>

        <motion.div
          className="glass-card rounded-3xl p-6 sm:p-8 overflow-hidden"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="input" variants={panelVariant} initial="enter" animate="show" exit="exit">
                {/* Symptom categories */}
                <div className="space-y-7 mb-8">
                  {CATEGORIES.map(({ label, color, symptoms, urgent }) => (
                    <div key={label}>
                      <p className={`text-sm font-bold uppercase tracking-wider mb-3 ${color}`}>
                        {urgent && '⚠ '}{label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {symptoms.map((sym) => {
                          const isChecked = checked.has(sym);
                          return (
                            <motion.button
                              key={sym}
                              onClick={() => toggle(sym)}
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                                ${isChecked
                                  ? urgent
                                    ? 'bg-red-900/50 border-red-500/70 text-red-300 shadow-neon-red'
                                    : 'bg-purple-900/60 border-purple-500/70 text-purple-300 shadow-neon-sm'
                                  : 'bg-white/3 border-white/10 text-slate-400 hover:border-purple-500/40 hover:text-slate-300'}`}
                            >
                              {sym}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <AnimatePresence>
                  {checked.size > 0 && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-slate-500 text-sm mb-4"
                    >
                      {checked.size} symptom{checked.size > 1 ? 's' : ''} selected
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex gap-3">
                  <motion.button
                    onClick={check}
                    disabled={checked.size === 0}
                    whileHover={checked.size > 0 ? { scale: 1.02, boxShadow: '0 0 26px rgba(138,43,226,0.55)' } : {}}
                    whileTap={checked.size > 0 ? { scale: 0.98 } : {}}
                    className={`flex-1 py-3.5 rounded-xl font-semibold text-white transition-all duration-300
                      ${checked.size > 0
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-neon'
                        : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'}`}
                  >
                    Check My Symptoms
                  </motion.button>
                  <AnimatePresence>
                    {checked.size > 0 && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        onClick={() => setChecked(new Set())}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        className="px-5 py-3.5 rounded-xl border border-white/10 text-slate-500
                          hover:border-purple-500/30 hover:text-slate-300 transition-all duration-200"
                      >
                        <RotateCcw size={16} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div key="result" variants={panelVariant} initial="enter" animate="show" exit="exit">
                <motion.div
                  className={`rounded-2xl border p-6 mb-6 ${result.bgColor} ${result.borderColor}`}
                  style={{ boxShadow: `0 0 30px ${result.glowColor}` }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 220 }}
                      className={`w-12 h-12 rounded-xl border ${result.borderColor} bg-white/5
                        flex items-center justify-center shrink-0`}
                    >
                      <result.icon size={22} className={result.titleColor} />
                    </motion.div>
                    <div>
                      <h3 className={`font-bold text-lg mb-2 ${result.titleColor}`}>{result.title}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-4">{result.message}</p>
                      <div className="space-y-2">
                        {result.advice.map((a, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 + i * 0.08 }}
                            className="flex items-start gap-2.5"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 shrink-0 opacity-60" />
                            <p className="text-slate-300 text-sm">{a}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="mb-6">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Your selected symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {[...checked].map((s, i) => (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${result.badgeColor}`}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-purple-300 text-sm font-semibold mb-6">
                  <Zap size={14} className="text-purple-400" />
                  +15 points earned!
                </div>

                <motion.button
                  onClick={reset}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-full
                    border border-purple-500/40 text-purple-300 hover:text-white
                    hover:border-purple-400/70 hover:bg-purple-900/30 transition-all duration-300 text-sm font-medium"
                >
                  <RotateCcw size={14} />
                  Check different symptoms
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
