import { useState, useCallback } from 'react';
import { useHCPScore } from '../../context/HCPScoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, XCircle, ChevronRight, RotateCcw, Award, Trophy } from 'lucide-react';

const SECTIONS = [
  { id: 'icu',      label: 'ICU Management',         color: '#EF4444', desc: 'Sepsis, empirical therapy, PK/PD targets' },
  { id: 'pharmacy', label: 'Pharmacy & PK/PD',        color: '#F59E0B', desc: 'TDM, dose optimisation, bioavailability' },
  { id: 'outpt',    label: 'Outpatient & Community',  color: '#10B981', desc: 'Community infections, antibiotic duration' },
  { id: 'ward',     label: 'Ward Stewardship',        color: '#3B82F6', desc: 'IV-PO switch, de-escalation, blood cultures' },
];

const QUESTIONS = [
  /* ── ICU Management (Q 0–4) ── */
  {
    section: 0,
    q: 'A patient in septic shock has no identified source. Which empirical antibiotic strategy is most appropriate?',
    options: [
      'Narrow-spectrum beta-lactam only',
      'Broad-spectrum coverage including anti-MRSA + anti-Pseudomonal agents',
      'Antifungal therapy alone pending cultures',
      'Withhold antibiotics until blood culture results are available',
    ],
    answer: 1,
    explain: 'Septic shock requires urgent broad-spectrum empirical coverage (within 1 hour). De-escalate once cultures return (48–72 h).',
  },
  {
    section: 0,
    q: 'De-escalation in antimicrobial stewardship means:',
    options: [
      'Increasing the antibiotic dose after 48 h if no improvement',
      'Stopping all antibiotics once fever resolves',
      'Narrowing therapy to the most targeted agent once culture data is available',
      'Switching from IV to oral antibiotics',
    ],
    answer: 2,
    explain: 'De-escalation = narrowing the spectrum (or stopping unnecessary agents) guided by culture/sensitivity, while maintaining clinical efficacy.',
  },
  {
    section: 0,
    q: 'According to ASHP/IDSA 2020 guidelines, the target AUC₂₄/MIC for vancomycin in serious MRSA infections is:',
    options: ['<200', '400–600', '800–1000', '>1200'],
    answer: 1,
    explain: 'The 2020 guidelines recommend AUC-guided monitoring (target 400–600 mg·h/L) over trough-only monitoring to optimise efficacy and minimise nephrotoxicity.',
  },
  {
    section: 0,
    q: 'Blood cultures at 72 h grow E. coli susceptible to ceftriaxone. Patient is on meropenem and clinically improving. The best stewardship action is:',
    options: [
      'Continue meropenem, it is working',
      'Add vancomycin to broaden coverage',
      'De-escalate to IV/PO ceftriaxone',
      'Switch to colistin for coverage certainty',
    ],
    answer: 2,
    explain: 'De-escalation to a narrower effective agent (ceftriaxone) preserves carbapenems for truly resistant organisms, a core stewardship principle.',
  },
  {
    section: 0,
    q: 'Which biomarker is most validated for guiding antibiotic duration and early discontinuation in ICU patients?',
    options: ['C-reactive protein alone', 'Procalcitonin (PCT)', 'White blood cell count only', 'Ferritin level'],
    answer: 1,
    explain: 'PCT-guided protocols have consistently shown safe reduction of antibiotic duration in ICU patients without worsening outcomes.',
  },

  /* ── Pharmacy & PK/PD (Q 5–9) ── */
  {
    section: 1,
    q: 'Extended-infusion of meropenem (e.g., 3-hour infusion) is designed to optimise which PK/PD parameter?',
    options: ['Cmax/MIC', 'AUC/MIC', 'Time above MIC (T>MIC)', 'Post-antibiotic effect (PAE)'],
    answer: 2,
    explain: 'Beta-lactams exhibit time-dependent killing. Extending the infusion time increases the percentage of the dosing interval where free drug concentration exceeds the MIC.',
  },
  {
    section: 1,
    q: 'Which antibiotic class mandates therapeutic drug monitoring (TDM) for safety and efficacy?',
    options: ['Beta-lactams (e.g., amoxicillin)', 'Macrolides (e.g., azithromycin)', 'Aminoglycosides (e.g., gentamicin)', 'Tetracyclines (e.g., doxycycline)'],
    answer: 2,
    explain: 'Aminoglycosides have a narrow therapeutic index. TDM (peak and trough) is essential to maximise efficacy (Cmax/MIC ≥8–10) and prevent nephrotoxicity and ototoxicity.',
  },
  {
    section: 1,
    q: 'Which antibiotic achieves ~100% oral bioavailability, making IV-to-PO switch almost always appropriate?',
    options: ['Vancomycin (oral not systemically absorbed)', 'Linezolid', 'Ceftriaxone (IV/IM only)', 'Gentamicin (IV/IM only)'],
    answer: 1,
    explain: 'Linezolid has ~100% oral bioavailability. Oral and IV doses are bioequivalent, making early switch strongly recommended to reduce line complications and costs.',
  },
  {
    section: 1,
    q: 'A patient with CrCl 20 mL/min requires vancomycin therapy. The most appropriate action is:',
    options: [
      'Use standard doses unchanged',
      'Extend dosing interval with AUC-guided TDM',
      'Double the dose to achieve target concentrations',
      'Switch to oral vancomycin for systemic infection',
    ],
    answer: 1,
    explain: 'Vancomycin is renally eliminated. In severe renal impairment, doses must be extended and AUC monitored via TDM to avoid accumulation and nephrotoxicity.',
  },
  {
    section: 1,
    q: 'Which patient factor most significantly alters the volume of distribution of aminoglycosides?',
    options: ['Hepatic cirrhosis', 'Hyperthyroidism', 'Obesity and third-space fluid (critical illness)', 'Hypercholesterolaemia'],
    answer: 2,
    explain: 'Obesity and third-space fluid expansion in critically ill patients dramatically increase Vd of aminoglycosides, requiring larger loading doses to achieve therapeutic peaks.',
  },

  /* ── Outpatient & Community (Q 10–14) ── */
  {
    section: 2,
    q: 'First-line treatment for community-acquired pneumonia (outpatient, no comorbidities) is:',
    options: ['Meropenem IV', 'Amoxicillin 1 g TDS or Doxycycline 100 mg BD', 'Piperacillin-tazobactam IV', 'Vancomycin IV'],
    answer: 1,
    explain: 'IDSA/ATS guidelines recommend amoxicillin or doxycycline for outpatient CAP without comorbidities. Reserve broad-spectrum agents for higher severity or risk factors.',
  },
  {
    section: 2,
    q: 'A patient presents with 3-day sore throat and cough. Rapid Strep test is negative. Best management:',
    options: [
      'Amoxicillin 500 mg TDS × 7 days',
      'Azithromycin 500 mg × 5 days',
      'Symptomatic treatment only, no antibiotics',
      'Ciprofloxacin 500 mg BD',
    ],
    answer: 2,
    explain: 'A negative Strep test indicates likely viral aetiology. Antibiotics are not indicated. This is a major driver of inappropriate prescribing.',
  },
  {
    section: 2,
    q: 'Recommended antibiotic duration for uncomplicated UTI in a non-pregnant adult woman:',
    options: ['1 day single dose', '3–5 days', '14 days', '28 days'],
    answer: 1,
    explain: 'Short-course therapy (3–5 days nitrofurantoin; 3-day trimethoprim; single-dose fosfomycin) is as effective as longer courses with fewer side effects and less resistance pressure.',
  },
  {
    section: 2,
    q: 'Which antibiotic should be AVOIDED for uncomplicated UTI per fluoroquinolone-sparing principles?',
    options: ['Nitrofurantoin', 'Trimethoprim', 'Ciprofloxacin', 'Fosfomycin'],
    answer: 2,
    explain: 'Fluoroquinolones (ciprofloxacin, levofloxacin) should be reserved for complicated infections or organisms resistant to first-line agents. Their use for uncomplicated UTI drives resistance.',
  },
  {
    section: 2,
    q: 'Antibiotic prophylaxis is appropriate in which clinical scenario?',
    options: [
      'Asymptomatic bacteriuria in a healthy young woman',
      'All pre-operative surgical procedures',
      'Recurrent UTIs (≥2 episodes/6 months or ≥3/year)',
      'Viral upper respiratory tract infection',
    ],
    answer: 2,
    explain: 'Prophylaxis for recurrent UTIs is evidence-based. Treating asymptomatic bacteriuria (except in pregnancy/pre-urological procedures) and viral infections is inappropriate.',
  },

  /* ── Ward Stewardship (Q 15–19) ── */
  {
    section: 3,
    q: 'Which of the following is NOT a criterion for IV-to-PO antibiotic switch?',
    options: [
      'Haemodynamically stable',
      'GI tract functioning and tolerating oral intake',
      'Oral antibiotic equivalent available',
      'Patient still spiking fever >38.5 °C',
    ],
    answer: 3,
    explain: 'Ongoing high fever suggests incomplete source control or inadequate therapy, a contraindication to switching. Patients should be afebrile or have a clearly improving temperature trend.',
  },
  {
    section: 3,
    q: 'Blood cultures to guide antibiotic therapy should ideally be collected:',
    options: [
      'After the first dose of empirical antibiotics',
      'Only from central venous catheters',
      'Before antibiotic initiation, at least 2 sets from separate peripheral sites',
      'After 24–48 h of fever',
    ],
    answer: 2,
    explain: 'Pre-treatment cultures are essential for de-escalation. Even a short antibiotic course before cultures significantly reduces diagnostic yield.',
  },
  {
    section: 3,
    q: 'According to WHO AWaRe, meropenem (carbapenem) belongs to which category?',
    options: ['Access', 'Watch', 'Reserve', 'Essential Only'],
    answer: 2,
    explain: 'Carbapenems are in the Reserve group, they must be protected as last-resort agents for carbapenem-resistant organisms (CRE, MDR Pseudomonas, Acinetobacter).',
  },
  {
    section: 3,
    q: 'Which represents the most inappropriate antibiotic prescribing scenario?',
    options: [
      'Amoxicillin for confirmed Group A streptococcal pharyngitis',
      'Prescribing antibiotics for a viral common cold',
      'Treating CAP with amoxicillin per guidelines',
      'Using metronidazole for anaerobic infections',
    ],
    answer: 1,
    explain: 'Prescribing antibiotics for viral infections is one of the most common and harmful examples of inappropriate use, directly contributing to antimicrobial resistance.',
  },
  {
    section: 3,
    q: 'The primary goal of antimicrobial stewardship programmes (ASPs) is:',
    options: [
      'Reduce hospital drug costs regardless of patient outcomes',
      'Promote broad-spectrum antibiotic use for all hospital infections',
      'Optimise antibiotic therapy to improve patient outcomes while minimising resistance and adverse effects',
      'Eliminate all antibiotic prescribing in outpatient settings',
    ],
    answer: 2,
    explain: 'ASPs aim for the "right drug, right dose, right duration, right patient",optimising outcomes while reducing collateral damage from antibiotics.',
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleOptions(q) {
  const order = q.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    ...q,
    options: order.map(i => q.options[i]),
    answer:  order.indexOf(q.answer),
  };
}

function buildQuiz() {
  return shuffle(QUESTIONS).map(shuffleOptions);
}

function getResult(score) {
  if (score >= 18) return { tier: 'Excellent', label: 'Expert Stewardship Practitioner', color: '#10B981', pts: 120 };
  if (score >= 14) return { tier: 'Proficient', label: 'Competent Stewardship Advocate', color: '#3B82F6', pts: 80 };
  if (score >= 10) return { tier: 'Developing', label: 'Awareness Builder', color: '#F59E0B', pts: 50 };
  return { tier: 'Needs Work', label: 'Further Study Recommended', color: '#EF4444', pts: 20 };
}

const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function StewardshipQuiz({ onPoints }) {
  const { setScore: setHCPScore } = useHCPScore();
  const [phase, setPhase]       = useState('intro');
  const [questions, setQuestions] = useState(QUESTIONS);
  const [qGlobal, setQGlobal]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExp, setShowExp]   = useState(false);
  const [score, setScore]       = useState(0);

  const current = questions[qGlobal];
  const sectionIdx = current?.section ?? 0;
  const sec = SECTIONS[sectionIdx];
  const isLast = qGlobal === QUESTIONS.length - 1;

  const handleSelect = useCallback((idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExp(true);
    if (idx === current.answer) setScore(s => s + 1);
  }, [selected, current]);

  const handleNext = useCallback(() => {
    if (isLast) {
      setPhase('result');
      const r = getResult(score);
      setHCPScore(r.pts);
    } else {
      setQGlobal(q => q + 1);
      setSelected(null);
      setShowExp(false);
    }
  }, [isLast, score, selected, current]);

  const handleRestart = () => {
    setPhase('intro');
    setQGlobal(0);
    setSelected(null);
    setShowExp(false);
    setScore(0);
    setQuestions(buildQuiz());
  };

  const result = getResult(score);

  return (
    <section id="stewardship-quiz" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div className="text-center mb-12"
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#60A5FA' }}>
            <Brain size={12} />
            Stewardship Guidelines Challenge
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-white mb-3 tracking-tight">
            Clinical Decision <span style={{ color: '#3B82F6' }}>Assessment</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 text-base max-w-xl mx-auto">
            20 clinical questions across 4 stewardship domains. Test your knowledge and earn HCP recognition points.
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* INTRO */}
          {phase === 'intro' && (
            <motion.div key="intro"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl p-8"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {SECTIONS.map(({ label, color, desc }, i) => (
                  <div key={i} className="rounded-xl p-4 text-center"
                    style={{ background: `${color}10`, border: `1px solid ${color}28` }}>
                    <div className="text-2xl font-bold mb-1" style={{ color }}>S{i + 1}</div>
                    <div className="text-white text-xs font-semibold mb-1">{label}</div>
                    <div className="text-slate-500 text-xs">{desc}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-6 p-4 rounded-xl"
                style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <div className="text-slate-300 text-sm">20 questions · 4 sections · Clinical-level difficulty</div>
                <div className="text-blue-400 font-bold text-sm">Up to 120 pts</div>
              </div>

              <motion.button
                onClick={() => { setQuestions(buildQuiz()); setPhase('quiz'); }}
                whileHover={{ scale: 1.03, boxShadow: '0 6px 28px rgba(59,130,246,0.35)' }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-full font-bold text-white text-base flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
                Start Assessment
                <ChevronRight size={18} />
              </motion.button>
            </motion.div>
          )}

          {/* QUIZ */}
          {phase === 'quiz' && (
            <motion.div key={`q-${qGlobal}`}
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35 }}>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span style={{ color: sec.color }} className="font-semibold">{sec.label}</span>
                  <span>{qGlobal + 1} / {QUESTIONS.length}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: sec.color }}
                    animate={{ width: `${((qGlobal + 1) / QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.4 }} />
                </div>
              </div>

              {/* Question card */}
              <div className="rounded-2xl p-8 mb-4"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>

                <p className="text-white text-lg font-medium leading-relaxed mb-6">{current.q}</p>

                <div className="space-y-3">
                  {current.options.map((opt, i) => {
                    const isCorrect = i === current.answer;
                    const isChosen  = i === selected;
                    let bg = 'rgba(255,255,255,0.04)';
                    let border = 'rgba(255,255,255,0.08)';
                    let textColor = 'text-slate-300';

                    if (selected !== null) {
                      if (isCorrect) { bg = 'rgba(16,185,129,0.12)'; border = 'rgba(16,185,129,0.4)'; textColor = 'text-emerald-300'; }
                      else if (isChosen) { bg = 'rgba(239,68,68,0.10)'; border = 'rgba(239,68,68,0.35)'; textColor = 'text-red-300'; }
                    }

                    return (
                      <motion.button key={i}
                        onClick={() => handleSelect(i)}
                        disabled={selected !== null}
                        whileHover={selected === null ? { x: 4 } : {}}
                        className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all duration-200 ${textColor}`}
                        style={{ background: bg, border: `1px solid ${border}` }}>
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: 'rgba(255,255,255,0.08)' }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm">{opt}</span>
                        {selected !== null && isCorrect && <CheckCircle2 size={16} className="ml-auto shrink-0 text-emerald-400" />}
                        {selected !== null && isChosen && !isCorrect && <XCircle size={16} className="ml-auto shrink-0 text-red-400" />}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="mt-5 p-4 rounded-xl"
                      style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        <span className="text-blue-400 font-semibold">Explanation: </span>
                        {current.explain}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {selected !== null && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-full font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
                  {isLast ? 'View Results' : 'Next Question'}
                  <ChevronRight size={16} />
                </motion.button>
              )}
            </motion.div>
          )}

          {/* RESULT */}
          {phase === 'result' && (
            <motion.div key="result"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.45 }}
              className="rounded-2xl p-10 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${result.color}30`, backdropFilter: 'blur(20px)' }}>

              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-6xl mb-5">
                {score >= 18 ? '🏆' : score >= 14 ? '🥈' : score >= 10 ? '🥉' : '📖'}
              </motion.div>

              <h3 className="text-3xl font-extrabold text-white mb-2">{result.tier}</h3>
              <p className="mb-6" style={{ color: result.color }}>{result.label}</p>

              {/* Score circle */}
              <div className="inline-flex flex-col items-center justify-center w-32 h-32 rounded-full mb-8"
                style={{ background: `${result.color}15`, border: `3px solid ${result.color}60`, boxShadow: `0 0 32px ${result.color}30` }}>
                <span className="text-4xl font-extrabold text-white">{score}</span>
                <span className="text-slate-400 text-xs">/ 20</span>
              </div>

              {/* Section breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {SECTIONS.map(({ label, color }, si) => {
                  const sectionQs = QUESTIONS.filter(q => q.section === si);
                  const sectionScore = sectionQs.filter((q, qi) => {
                    const globalIdx = QUESTIONS.indexOf(q);
                    return selected; // approximation, show all
                  }).length;
                  return (
                    <div key={si} className="p-3 rounded-xl"
                      style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
                      <div className="text-xs text-slate-400 mb-1">{label}</div>
                      <div className="text-lg font-bold" style={{ color }}>5 Qs</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-3 mb-8 p-4 rounded-xl"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <Award size={18} style={{ color: '#60A5FA' }} />
                <span className="text-blue-300 font-semibold">+{result.pts} stewardship points earned</span>
              </div>

              <motion.button
                onClick={handleRestart}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-full font-semibold text-white flex items-center gap-2 mx-auto"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <RotateCcw size={15} />
                Retake Assessment
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}
