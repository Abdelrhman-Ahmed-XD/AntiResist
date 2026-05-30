import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Activity, Pill, Star, ChevronRight, FlaskConical } from 'lucide-react';

const CARDS = [
  {
    icon: BookOpen,
    title: 'What is AMR?',
    desc: 'Understand how antibiotic resistance develops and why it matters for everyone.',
    href: '/portal/learn',
    accent: '#00C2A8',
    glow: 'rgba(0,194,168,0.18)',
    badge: 'Learn',
  },
  {
    icon: Sparkles,
    title: 'Myth Busters',
    desc: 'Separate antibiotic facts from fiction with evidence-based myth debunking.',
    href: '/portal/quiz',
    accent: '#F59E0B',
    glow: 'rgba(245,158,11,0.18)',
    badge: 'Myths',
  },
  {
    icon: Activity,
    title: 'Symptom Checker',
    desc: 'Find out if your symptoms suggest a viral or bacterial infection before visiting a doctor.',
    href: '/portal/symptoms',
    accent: '#F87171',
    glow: 'rgba(248,113,113,0.18)',
    badge: 'Tool',
  },
  {
    icon: Pill,
    title: 'Drug Library',
    desc: 'Explore common antibiotics, their uses, side effects, and stewardship guidance.',
    href: '/portal/drugs',
    accent: '#22D3EE',
    glow: 'rgba(34,211,238,0.18)',
    badge: 'Reference',
  },
  {
    icon: FlaskConical,
    title: 'Drug Interactions',
    desc: 'Instantly check clinically significant interactions between antibiotics and other medications.',
    href: '/portal/interactions',
    accent: '#8B5CF6',
    glow: 'rgba(139,92,246,0.18)',
    badge: 'Safety',
  },
  {
    icon: Star,
    title: 'Your Progress',
    desc: 'Track your learning journey, earned badges, and stewardship certificate.',
    href: '/portal/progress',
    accent: '#FBBF24',
    glow: 'rgba(251,191,36,0.18)',
    badge: 'Rewards',
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function PortalDashboard() {
  const navigate = useNavigate();
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(167,139,250,0.7)' }}>
            Your Learning Hub
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore All Tools
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          {CARDS.map(({ icon: Icon, title, desc, href, accent, glow, badge }) => (
            <motion.div
              key={title}
              variants={cardAnim}
              onClick={() => navigate(href)}
              className="group cursor-pointer rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              whileHover={{
                y: -6,
                background: `rgba(255,255,255,0.065)`,
                border: `1px solid ${accent}40`,
                boxShadow: `0 12px 40px ${glow}, 0 0 0 1px ${accent}20`,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            >
              {/* Icon + badge row */}
              <div className="flex items-start justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${accent}14`, border: `1px solid ${accent}28` }}
                >
                  <Icon size={20} style={{ color: accent }} />
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: `${accent}14`, color: accent, border: `1px solid ${accent}22` }}
                >
                  {badge}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-white font-bold text-base mb-1.5">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>

              {/* CTA */}
              <div
                className="flex items-center gap-1 text-xs font-semibold transition-all duration-200"
                style={{ color: accent }}
              >
                Explore
                <ChevronRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
