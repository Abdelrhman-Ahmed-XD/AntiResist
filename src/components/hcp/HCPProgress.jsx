import { Zap, Lock, Award, Download, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useHCPScore } from '../../context/HCPScoreContext';
import { useAuth } from '../../context/AuthContext';

const BADGES = [
  {
    id: 'junior',
    label: 'Junior Steward',
    emoji: '🔬',
    required: 20,
    desc: 'Completed the antimicrobial stewardship assessment.',
    color: 'from-blue-800 to-blue-600',
  },
  {
    id: 'senior',
    label: 'Senior Steward',
    emoji: '🩺',
    required: 50,
    desc: 'Demonstrated developing knowledge of stewardship principles.',
    color: 'from-blue-700 to-cyan-600',
  },
  {
    id: 'expert',
    label: 'Expert Steward',
    emoji: '🏆',
    required: 80,
    desc: 'Proficient in antimicrobial stewardship — top-tier prescribing skills.',
    color: 'from-indigo-700 to-blue-500',
  },
  {
    id: 'master',
    label: 'Master Steward',
    emoji: '🎓',
    required: 120,
    desc: 'Excellent mastery of stewardship — perfect score achieved.',
    color: 'from-sky-600 to-indigo-500',
  },
];

async function downloadCertificate(name) {
  const displayName = (name?.trim()) || 'Stewardship Professional';

  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = '/certificate.jpg';
  });

  const canvas = document.createElement('canvas');
  canvas.width  = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const fontSize = Math.round(img.naturalHeight * 0.058);
  ctx.font         = `700 ${fontSize}px 'Times New Roman', Georgia, serif`;
  ctx.fillStyle    = '#1a3a5c';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(displayName, img.naturalWidth / 2, img.naturalHeight * 0.405);

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = 'AntiResist-HCP-Certificate.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

const badgeVariant = {
  hidden: { opacity: 0, x: -18, scale: 0.94 },
  show:   { opacity: 1, x: 0,   scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function HCPProgress() {
  const { score = 0, completed = false } = useHCPScore() ?? {};
  const { user } = useAuth();
  const { pathname } = useLocation();

  const maxPoints  = 120;
  const pct        = Math.min((score / maxPoints) * 100, 100);
  const hasExpert  = score >= 80;
  const nextBadge  = BADGES.find(b => b.required > score) ?? null;
  const userName   = user?.displayName || user?.email?.split('@')[0] || null;

  return (
    <section id="hcp-progress" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA' }}
          >
            <Award size={13} /> Stewardship Progress
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Your Stewardship Journey</h2>
          <p className="text-slate-400 text-lg">
            Complete the stewardship quiz to earn badges and unlock your certificate.
          </p>
        </motion.div>

        {/* Sign-in nudge */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex items-center gap-3 px-5 py-4 rounded-2xl border border-dashed border-slate-600/50"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <Lock size={16} className="text-slate-500 shrink-0" />
            <p className="text-slate-500 text-sm flex-1">
              Your score is not saved.{' '}
              <Link to="/sign-in" state={{ from: pathname }} className="text-slate-400 underline underline-offset-2 hover:text-blue-400 transition-colors duration-150">Sign in</Link>
              {' '}or{' '}
              <Link to="/join" state={{ from: pathname }} className="text-slate-400 underline underline-offset-2 hover:text-blue-400 transition-colors duration-150">create an account</Link>
              {' '}to save your progress.
            </p>
            <Link
              to="/sign-in"
              state={{ from: pathname }}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 border border-slate-600/50 hover:border-blue-500/60 hover:text-blue-300 transition-all duration-200"
            >
              <LogIn size={12} />
              Sign in
            </Link>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: Score + progress ── */}
          <motion.div
            className="lg:col-span-2 rounded-3xl p-8 flex flex-col items-center text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.18)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            {/* Score orb */}
            <div className="relative mb-6">
              <motion.div
                className="w-32 h-32 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(30,58,138,0.4)', border: '1px solid rgba(59,130,246,0.3)' }}
                whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(59,130,246,0.7)' }}
                animate={{ boxShadow: completed
                  ? ['0 0 15px rgba(59,130,246,0.4)', '0 0 30px rgba(59,130,246,0.7)', '0 0 15px rgba(59,130,246,0.4)']
                  : ['0 0 10px rgba(59,130,246,0.2)', '0 0 20px rgba(59,130,246,0.4)', '0 0 10px rgba(59,130,246,0.2)'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="text-center">
                  <motion.div
                    key={score}
                    initial={{ scale: 1.5, color: '#BFDBFE' }}
                    animate={{ scale: 1,   color: '#FFFFFF' }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 250 }}
                    className="text-4xl font-black leading-none"
                  >
                    {score}
                  </motion.div>
                  <div className="text-blue-400 text-xs font-semibold mt-1">POINTS</div>
                </div>
              </motion.div>
              <div className="absolute inset-0 rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)', animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite' }}
              />
            </div>

            {/* Progress bar */}
            <div className="w-full mb-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Score</span>
                <span>{Math.round(pct)}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #1D4ED8, #3B82F6)', boxShadow: '0 0 10px rgba(59,130,246,0.6)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!completed ? (
                <motion.p key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-slate-500 text-xs">
                  Complete the quiz to earn points
                </motion.p>
              ) : nextBadge ? (
                <motion.p key="next" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-slate-500 text-xs">
                  {nextBadge.required - score} pts until{' '}
                  <span className="text-blue-400">{nextBadge.emoji} {nextBadge.label}</span>
                </motion.p>
              ) : (
                <motion.p key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-emerald-400 text-xs font-semibold">
                  All badges unlocked! 🎉
                </motion.p>
              )}
            </AnimatePresence>

            {/* How to earn */}
            <div className="mt-6 w-full space-y-2 text-left">
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-3">Score breakdown</p>
              {[
                { label: 'Needs Work  (<10 correct)',    pts: '20 pts'  },
                { label: 'Developing  (≥10 correct)',    pts: '50 pts'  },
                { label: 'Proficient  (≥14 correct)',    pts: '80 pts'  },
                { label: 'Excellent   (≥18 correct)',    pts: '120 pts' },
              ].map(({ label, pts }) => (
                <div key={label} className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-blue-400 font-bold">{pts}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Badges ── */}
          <motion.div
            className="lg:col-span-3 rounded-3xl p-8"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.18)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <p className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Award size={20} className="text-blue-400" />
              Your Badges
            </p>

            <motion.div
              className="space-y-4 mb-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.12 }}
            >
              {BADGES.map((badge) => {
                const unlocked = score >= badge.required;
                return (
                  <motion.div
                    key={badge.id}
                    variants={badgeVariant}
                    whileHover={unlocked ? { scale: 1.02, x: 4 } : {}}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300
                      ${unlocked
                        ? 'border-blue-500/50'
                        : 'border-white/8 opacity-50'}`}
                    style={unlocked ? { background: 'rgba(30,58,138,0.3)', boxShadow: '0 0 12px rgba(59,130,246,0.15)' } : { background: 'rgba(255,255,255,0.03)' }}
                  >
                    <motion.div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 border transition-all duration-300
                        ${unlocked ? `bg-gradient-to-br ${badge.color} border-white/20` : 'border-white/10'}`}
                      style={unlocked ? { background: undefined } : { background: 'rgba(255,255,255,0.05)' }}
                      animate={unlocked ? { boxShadow: ['0 0 8px rgba(59,130,246,0.4)', '0 0 18px rgba(59,130,246,0.7)', '0 0 8px rgba(59,130,246,0.4)'] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {unlocked ? badge.emoji : <Lock size={18} className="text-slate-600" />}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-slate-600'}`}>
                          {badge.label}
                        </p>
                        <AnimatePresence>
                          {unlocked && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-xs rounded-full px-2 py-0.5 font-medium"
                              style={{ background: 'rgba(30,58,138,0.6)', color: '#93C5FD', border: '1px solid rgba(59,130,246,0.3)' }}
                            >
                              Unlocked
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <p className={`text-xs leading-snug ${unlocked ? 'text-slate-400' : 'text-slate-700'}`}>
                        {badge.desc}
                      </p>
                      {!unlocked && (
                        <p className="text-xs text-slate-700 mt-1">Requires {badge.required} pts</p>
                      )}
                    </div>
                    {unlocked && <Zap size={14} className="text-blue-400 shrink-0" />}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Certificate section */}
            <AnimatePresence>
              {hasExpert && !user ? (
                <motion.div
                  key="cert-login"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden"
                  style={{ borderTop: '1px solid rgba(59,130,246,0.2)', paddingTop: '1.5rem' }}
                >
                  <div className="flex items-center gap-3 p-4 rounded-xl"
                    style={{ background: 'rgba(120,53,15,0.1)', border: '1px solid rgba(234,179,8,0.3)' }}>
                    <LogIn size={16} className="text-yellow-400 shrink-0" />
                    <p className="text-yellow-300/80 text-xs flex-1">
                      You earned the certificate!{' '}
                      <Link to="/sign-in" state={{ from: pathname }} className="underline underline-offset-2 text-yellow-300 hover:text-white">Sign in</Link>
                      {' '}to download it with your name.
                    </p>
                  </div>
                </motion.div>
              ) : hasExpert ? (
                <motion.div
                  key="cert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden"
                  style={{ borderTop: '1px solid rgba(59,130,246,0.2)', paddingTop: '1.5rem' }}
                >
                  <p className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                    <Download size={16} className="text-yellow-400" />
                    Download Your Certificate
                  </p>
                  <p className="text-slate-500 text-xs mb-4">
                    Your personalised Antimicrobial Stewardship certificate is ready.
                  </p>
                  {userName && (
                    <p className="text-slate-400 text-xs mb-4">
                      Issued to:{' '}
                      <span className="text-white font-semibold">{userName}</span>
                    </p>
                  )}
                  <motion.button
                    onClick={() => downloadCertificate(userName || user?.displayName)}
                    whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(234,179,8,0.5)' }}
                    whileTap={{ scale: 0.96 }}
                    className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(90deg, #CA8A04, #D97706)', boxShadow: '0 0 16px rgba(234,179,8,0.35)' }}
                  >
                    <Download size={14} />
                    Download Certificate
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="locked"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}
                >
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-white/10"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <Lock size={16} className="text-slate-600 shrink-0" />
                    <p className="text-slate-600 text-xs">
                      Certificate unlocks when you earn{' '}
                      <span className="text-slate-500 font-semibold">🏆 Expert Steward</span>
                      {' '}({Math.max(80 - score, 0)} pts remaining).
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
