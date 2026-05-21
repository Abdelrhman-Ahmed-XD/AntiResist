import { useState } from 'react';
import { Zap, Lock, Award, Download, User, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGamification } from '../../context/GamificationContext';
import { useAuth } from '../../hooks/useAuth';

function openCertificate(name, date) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>AMR Stewardship Certificate</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .cert { width: 800px; padding: 60px; border: 3px solid #7C3AED; border-radius: 24px; text-align: center; position: relative; background: #fff; }
  .cert::before { content: ''; position: absolute; inset: 10px; border: 1px solid #E9D5FF; border-radius: 16px; pointer-events: none; }
  .logo { font-size: 13px; font-weight: 700; color: #7C3AED; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 36px; }
  .badge { font-size: 52px; margin-bottom: 12px; }
  .this-certifies { font-size: 13px; color: #9CA3AF; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; }
  .name { font-size: 44px; font-weight: 900; color: #1F2937; margin-bottom: 16px; border-bottom: 2px solid #E9D5FF; padding-bottom: 16px; }
  .title { font-size: 22px; font-weight: 700; color: #7C3AED; margin-bottom: 16px; }
  .desc { font-size: 14px; color: #6B7280; line-height: 1.8; max-width: 520px; margin: 0 auto 36px; }
  .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 36px; padding-top: 24px; border-top: 1px solid #F3F4F6; }
  .sig-line { width: 160px; height: 1px; background: #D1D5DB; margin-bottom: 4px; }
  .sig-name { font-size: 12px; color: #9CA3AF; }
  .date { font-size: 12px; color: #9CA3AF; text-align: right; }
  @media print { body { background: #fff; } }
</style>
</head>
<body>
<div class="cert">
  <div class="logo">AntiResist · Patient Education Portal</div>
  <div class="badge">🏆</div>
  <div class="this-certifies">This certifies that</div>
  <div class="name">${name || 'AMR Advocate'}</div>
  <div class="title">Antibiotic Stewardship Supporter</div>
  <div class="desc">Has successfully completed the AntiResist Patient Education Portal, demonstrating comprehensive understanding of antimicrobial resistance, responsible antibiotic use, and the principles of antibiotic stewardship.</div>
  <div class="footer">
    <div class="sig"><div class="sig-line"></div><div class="sig-name">AntiResist Team</div></div>
    <div class="date">Issued: ${date}</div>
  </div>
</div>
<script>window.onload = () => window.print();<\/script>
</body>
</html>`;
  const win = window.open('', '_blank', 'width=900,height=700');
  if (win) { win.document.write(html); win.document.close(); }
}

const badgeVariant = {
  hidden:   { opacity: 0, x: -18, scale: 0.94 },
  show:     { opacity: 1, x: 0,   scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function GamificationPanel() {
  const { points, badges, unlockedBadges, hasGoldBadge, nextBadge, userName, setUserName } = useGamification();
  const { user } = useAuth();
  const [nameInput, setNameInput] = useState(userName);
  const maxPoints = 75;
  const pct = Math.min((points / maxPoints) * 100, 100);
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section id="gamification" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label mb-4 mx-auto">Your Progress</div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Stewardship Journey</h2>
          <p className="text-slate-400 text-lg">
            Complete the quiz, symptom checker, and drug cards to unlock all badges.
          </p>
        </motion.div>

        {/* Sign-in nudge for guests */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex items-center gap-3 px-5 py-4 rounded-2xl border border-dashed border-slate-600/50 bg-white/3"
          >
            <Lock size={16} className="text-slate-500 shrink-0" />
            <p className="text-slate-500 text-sm flex-1">
              Your points are not saved.{' '}
              <Link to="/sign-in" className="text-slate-400 underline underline-offset-2 hover:text-purple-400 transition-colors duration-150">Sign in</Link>
              {' '}or{' '}
              <Link to="/join" className="text-slate-400 underline underline-offset-2 hover:text-purple-400 transition-colors duration-150">create an account</Link>
              {' '}to save your progress and earn badges.
            </p>
            <Link
              to="/sign-in"
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 border border-slate-600/50 hover:border-purple-500/60 hover:text-purple-300 transition-all duration-200"
            >
              <LogIn size={12} />
              Sign in
            </Link>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: Points + progress ── */}
          <motion.div
            className="lg:col-span-2 glass-card rounded-3xl p-8 flex flex-col items-center text-center"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            {/* Points orb */}
            <div className="relative mb-6">
              <motion.div
                className="w-32 h-32 rounded-full bg-purple-900/40 border border-purple-500/30
                  flex items-center justify-center"
                whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(138,43,226,0.7)' }}
                animate={{ boxShadow: ['0 0 15px rgba(138,43,226,0.4)', '0 0 30px rgba(138,43,226,0.7)', '0 0 15px rgba(138,43,226,0.4)'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="text-center">
                  <motion.div
                    key={points}
                    initial={{ scale: 1.5, color: '#E9D5FF' }}
                    animate={{ scale: 1,   color: '#FFFFFF' }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 250 }}
                    className="text-4xl font-black leading-none"
                  >
                    {points}
                  </motion.div>
                  <div className="text-purple-400 text-xs font-semibold mt-1">POINTS</div>
                </div>
              </motion.div>
              <div className="absolute inset-0 rounded-full animate-ping-slow opacity-20"
                style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)' }}
              />
            </div>

            {/* Progress bar */}
            <div className="w-full mb-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Progress</span>
                <span>{Math.round(pct)}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #7C3AED, #4F46E5)', boxShadow: '0 0 10px rgba(138,43,226,0.6)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {nextBadge ? (
                <motion.p
                  key="next"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-slate-500 text-xs"
                >
                  {nextBadge.required - points} pts until{' '}
                  <span className="text-purple-400">{nextBadge.emoji} {nextBadge.label}</span>
                </motion.p>
              ) : (
                <motion.p
                  key="done"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-emerald-400 text-xs font-semibold"
                >
                  All badges unlocked! 🎉
                </motion.p>
              )}
            </AnimatePresence>

            {/* How-to-earn list */}
            <div className="mt-6 w-full space-y-2 text-left">
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-3">How to earn</p>
              {[
                { label: 'Complete Quiz',       pts: '+20'  },
                { label: 'Use Symptom Checker', pts: '+15'  },
                { label: 'Open each drug card', pts: '+5 ea' },
              ].map(({ label, pts }) => (
                <div key={label} className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-purple-400 font-bold">{pts}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Badges ── */}
          <motion.div
            className="lg:col-span-3 glass-card rounded-3xl p-8"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <p className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Award size={20} className="text-purple-400" />
              Your Badges
            </p>

            <motion.div
              className="space-y-4 mb-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.12 }}
            >
              {badges.map((badge) => {
                const unlocked = points >= badge.required;
                return (
                  <motion.div
                    key={badge.id}
                    variants={badgeVariant}
                    whileHover={unlocked ? { scale: 1.02, x: 4 } : {}}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300
                      ${unlocked
                        ? 'bg-purple-900/30 border-purple-500/50 shadow-neon-sm'
                        : 'bg-white/3 border-white/8 opacity-50'}`}
                  >
                    <motion.div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl
                        shrink-0 border transition-all duration-300
                        ${unlocked
                          ? `bg-gradient-to-br ${badge.color} border-white/20 shadow-neon`
                          : 'bg-white/5 border-white/10'}`}
                      animate={unlocked ? { boxShadow: ['0 0 8px rgba(138,43,226,0.4)', '0 0 18px rgba(138,43,226,0.7)', '0 0 8px rgba(138,43,226,0.4)'] } : {}}
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
                              className="text-xs bg-purple-900/60 text-purple-300 border border-purple-500/30
                                rounded-full px-2 py-0.5 font-medium"
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
                    {unlocked && <Zap size={14} className="text-purple-400 shrink-0" />}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Certificate section */}
            <AnimatePresence>
              {hasGoldBadge ? (
                <motion.div
                  key="cert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t border-purple-500/20 pt-6 overflow-hidden"
                >
                  <p className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                    <Download size={16} className="text-yellow-400" />
                    Download Your Certificate
                  </p>
                  <p className="text-slate-500 text-xs mb-4">
                    Enter your name to generate a personalised Antibiotic Stewardship Supporter certificate.
                  </p>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={nameInput}
                        onChange={e => { setNameInput(e.target.value); setUserName(e.target.value); }}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10
                          text-white text-sm placeholder-slate-600
                          focus:outline-none focus:border-purple-500/60 transition-all duration-200"
                      />
                    </div>
                    <motion.button
                      onClick={() => openCertificate(nameInput, today)}
                      whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(234,179,8,0.5)' }}
                      whileTap={{ scale: 0.96 }}
                      className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white
                        bg-gradient-to-r from-yellow-600 to-amber-500
                        whitespace-nowrap flex items-center gap-2"
                      style={{ boxShadow: '0 0 16px rgba(234,179,8,0.35)' }}
                    >
                      <Download size={14} />
                      Download
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="locked"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-white/8 pt-6"
                >
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/3 border border-dashed border-white/10">
                    <Lock size={16} className="text-slate-600 shrink-0" />
                    <p className="text-slate-600 text-xs">
                      Certificate unlocks when you earn the{' '}
                      <span className="text-slate-500 font-semibold">🥇 Stewardship Supporter</span> badge ({Math.max(60 - points, 0)} pts remaining).
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
