import { useState } from 'react';
import { CheckCircle, XCircle, Trophy, RotateCcw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';

const QUESTIONS = [
  {
    question: 'Can antibiotics treat any type of infection?',
    options: [
      { label: 'Yes — antibiotics can treat both viral and bacterial infections.', correct: false },
      { label: 'No — antibiotics only work against bacterial infections, not viral ones like cold or flu.', correct: true },
    ],
    explanation: 'Antibiotics are designed to target bacteria. They have zero effect on viruses like influenza or COVID-19. Using them for viral infections is ineffective and directly accelerates resistance.',
  },
  {
    question: 'Does taking antibiotics regularly help prevent future infections?',
    options: [
      { label: 'Yes — frequent use builds up immunity against future illness.', correct: false },
      { label: 'No — overuse increases the risk of drug-resistant infections and harms gut health.', correct: true },
    ],
    explanation: 'Antibiotics do not boost immunity. Overusing them wipes out beneficial gut bacteria and creates selective pressure for resistant strains, making future infections far harder to treat.',
  },
  {
    question: 'Will a higher dose of antibiotics make you recover faster?',
    options: [
      { label: 'Yes — a higher dose kills bacteria faster and shortens illness.', correct: false },
      { label: 'No — it raises resistance risk and causes serious harm to your body.', correct: true },
    ],
    explanation: 'Exceeding the prescribed dose does not speed recovery. It damages your gut microbiome, can cause organ toxicity, and breeds resistance by exposing bacteria to sub-lethal stress.',
  },
  {
    question: 'Is it safe to stop antibiotics once your symptoms improve?',
    options: [
      { label: 'Yes — feeling better means the infection is gone and the course is complete.', correct: false },
      { label: 'No — you must complete the full course to prevent relapse and resistance.', correct: true },
    ],
    explanation: 'Symptom relief does not mean the bacteria are eliminated. The toughest survivors remain. Stopping early lets these resistant bacteria multiply, causing a relapse that is much harder to treat.',
  },
  {
    question: 'Are over-the-counter (OTC) antibiotics safe and appropriate to use?',
    options: [
      { label: 'Yes — OTC availability means they are safe and effective for self-treatment.', correct: false },
      { label: 'No — they are likely inappropriate, counterfeit, or mislabeled, and carry serious risks.', correct: true },
    ],
    explanation: 'No antibiotic is safe without a clinical diagnosis and prescription. OTC antibiotics are frequently the wrong class, substandard in quality, or counterfeit — a leading driver of global AMR.',
  },
];

const panelVariants = {
  enter:  { opacity: 0, x: 24, scale: 0.98 },
  center: { opacity: 1, x: 0,  scale: 1,   transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, x: -24, scale: 0.98, transition: { duration: 0.22 } },
};

const feedbackVariant = {
  hidden: { opacity: 0, y: 10, height: 0 },
  show:   { opacity: 1, y: 0,  height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function MythsQuiz() {
  const { addPoints, hasAction } = useGamification();
  const [idx, setIdx]         = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore]     = useState(0);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase]     = useState('idle');

  const current = QUESTIONS[idx];
  const isLast  = idx === QUESTIONS.length - 1;

  const startQuiz = () => { setIdx(0); setSelected(null); setScore(0); setAnswers([]); setPhase('active'); };

  const choose = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    const correct = opt.correct;
    setAnswers(prev => [...prev, { correct, question: current.question }]);
    if (correct) setScore(s => s + 1);
  };

  const next = () => {
    if (isLast) {
      setPhase('result');
      if (!hasAction('quiz-complete')) addPoints('quiz-complete', 20);
    } else {
      setIdx(i => i + 1);
      setSelected(null);
    }
  };

  const reset = () => { setIdx(0); setSelected(null); setScore(0); setAnswers([]); setPhase('idle'); };

  const pct = Math.round((score / QUESTIONS.length) * 100);

  return (
    <section id="myths-quiz" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label mb-4 mx-auto">Interactive</div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Myths vs Facts Quiz</h2>
          <p className="text-slate-400 text-lg">
            5 questions. Test what you know — and earn <span className="text-purple-400 font-semibold">+20 points</span> on completion.
          </p>
        </motion.div>

        <motion.div
          className="glass-card rounded-3xl p-6 sm:p-8 overflow-hidden"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {/* ── IDLE ── */}
            {phase === 'idle' && (
              <motion.div key="idle" variants={panelVariants} initial="enter" animate="center" exit="exit"
                className="text-center py-8">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-2xl bg-purple-900/60 border border-purple-500/30
                    flex items-center justify-center mx-auto mb-6 shadow-neon"
                >
                  <Trophy size={36} className="text-purple-400" />
                </motion.div>
                <h3 className="text-white text-2xl font-bold mb-3">Ready to test your knowledge?</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  Each question has one correct answer. Wrong answers show the real explanation immediately.
                </p>
                <motion.button
                  onClick={startQuiz}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 28px rgba(138,43,226,0.6)' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 rounded-full font-semibold text-white
                    bg-gradient-to-r from-purple-600 to-indigo-600 shadow-neon"
                >
                  Start Quiz
                </motion.button>
              </motion.div>
            )}

            {/* ── ACTIVE ── */}
            {phase === 'active' && (
              <motion.div key={`q-${idx}`} variants={panelVariants} initial="enter" animate="center" exit="exit">
                {/* Progress bar */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-300 text-sm font-medium">Question {idx + 1} of {QUESTIONS.length}</span>
                  <span className="text-slate-500 text-sm">{score} correct so far</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #7C3AED, #4F46E5)' }}
                    initial={{ width: `${(idx / QUESTIONS.length) * 100}%` }}
                    animate={{ width: `${((idx + 1) / QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  />
                </div>

                <h3 className="text-white text-xl font-bold mb-6 leading-snug">{current.question}</h3>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {current.options.map((opt, i) => {
                    const isSelected  = selected === opt;
                    const showResult  = selected !== null;
                    let borderCls = 'border-white/10';
                    let bgCls     = 'bg-white/3';
                    let textCls   = 'text-slate-300';
                    let icon      = null;

                    if (showResult) {
                      if (opt.correct) {
                        borderCls = 'border-emerald-500/70'; bgCls = 'bg-emerald-900/20'; textCls = 'text-emerald-300';
                        icon = <CheckCircle size={18} className="text-emerald-400 shrink-0" />;
                      } else if (isSelected) {
                        borderCls = 'border-red-500/70'; bgCls = 'bg-red-900/20'; textCls = 'text-red-300';
                        icon = <XCircle size={18} className="text-red-400 shrink-0" />;
                      }
                    }

                    return (
                      <motion.button
                        key={i}
                        onClick={() => choose(opt)}
                        disabled={showResult}
                        whileHover={!showResult ? { scale: 1.01, x: 3 } : {}}
                        whileTap={!showResult ? { scale: 0.99 } : {}}
                        className={`w-full text-left px-5 py-4 rounded-xl border transition-colors duration-200
                          flex items-center justify-between gap-3
                          ${borderCls} ${bgCls} ${showResult ? 'cursor-default' : 'cursor-pointer hover:border-purple-500/50 hover:bg-purple-900/20'}`}
                      >
                        <span className={`text-sm font-medium ${textCls}`}>{opt.label}</span>
                        {icon}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {selected !== null && (
                    <motion.div
                      key="feedback"
                      variants={feedbackVariant}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className={`rounded-xl p-4 mb-6 overflow-hidden border
                        ${selected.correct
                          ? 'bg-emerald-900/20 border-emerald-500/30'
                          : 'bg-amber-900/20 border-amber-500/30'}`}
                    >
                      <p className={`text-sm font-semibold mb-1 ${selected.correct ? 'text-emerald-300' : 'text-amber-200'}`}>
                        {selected.correct ? 'Correct!' : 'Explanation'}
                      </p>
                      <p className={`text-sm leading-relaxed ${selected.correct ? 'text-emerald-100/80' : 'text-amber-100/80'}`}>
                        {current.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next button */}
                <AnimatePresence>
                  {selected !== null && (
                    <motion.button
                      key="next"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      onClick={next}
                      whileHover={{ scale: 1.02, boxShadow: '0 0 22px rgba(138,43,226,0.55)' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 rounded-xl font-semibold text-white
                        bg-gradient-to-r from-purple-600 to-indigo-600 shadow-neon"
                    >
                      {isLast ? 'See Results' : 'Next Question →'}
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ── RESULT ── */}
            {phase === 'result' && (
              <motion.div key="result" variants={panelVariants} initial="enter" animate="center" exit="exit"
                className="text-center py-6">
                {/* Score circle */}
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <motion.circle cx="60" cy="60" r="52" fill="none"
                      stroke={pct >= 80 ? '#10B981' : pct >= 60 ? '#F59E0B' : '#EF4444'}
                      strokeWidth="10" strokeLinecap="round"
                      strokeDasharray="327"
                      initial={{ strokeDashoffset: 327 }}
                      animate={{ strokeDashoffset: 327 - (pct / 100) * 327 }}
                      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                      style={{ filter: pct >= 80 ? 'drop-shadow(0 0 8px rgba(16,185,129,0.7))' : pct >= 60 ? 'drop-shadow(0 0 8px rgba(245,158,11,0.7))' : 'drop-shadow(0 0 8px rgba(239,68,68,0.7))' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{score}/{QUESTIONS.length}</span>
                    <span className="text-xs text-slate-400">{pct}%</span>
                  </div>
                </div>

                <h3 className="text-white text-2xl font-bold mb-2">
                  {pct === 100 ? 'Perfect Score!' : pct >= 80 ? 'Great Job!' : pct >= 60 ? 'Good Effort!' : 'Keep Learning!'}
                </h3>
                <p className="text-slate-400 mb-4">
                  You answered <span className="text-white font-semibold">{score}</span> of{' '}
                  <span className="text-white font-semibold">{QUESTIONS.length}</span> questions correctly.
                </p>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 220 }}
                  className="inline-flex items-center gap-2 bg-purple-900/40 border border-purple-500/30
                    rounded-full px-5 py-2 text-purple-300 font-semibold text-sm mb-8"
                >
                  <Zap size={14} className="text-purple-400" />
                  +20 points earned!
                </motion.div>

                {/* Per-question summary */}
                <div className="space-y-2 text-left mb-8 max-h-48 overflow-y-auto portal-scroll">
                  {answers.map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
                        ${a.correct ? 'bg-emerald-900/20 border border-emerald-500/20' : 'bg-red-900/20 border border-red-500/20'}`}
                    >
                      {a.correct
                        ? <CheckCircle size={15} className="text-emerald-400 shrink-0" />
                        : <XCircle    size={15} className="text-red-400 shrink-0" />}
                      <span className={a.correct ? 'text-emerald-300' : 'text-red-300'}>
                        Q{i + 1}: {a.question.slice(0, 55)}…
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={reset}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 mx-auto px-6 py-3 rounded-full
                    border border-purple-500/40 text-purple-300 hover:text-white
                    hover:border-purple-400/70 hover:bg-purple-900/30 transition-all duration-300 text-sm font-medium"
                >
                  <RotateCcw size={14} />
                  Try Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
