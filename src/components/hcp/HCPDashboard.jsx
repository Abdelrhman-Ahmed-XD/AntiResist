import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Brain, Stethoscope, Microscope, ChevronRight, Activity, Shield } from 'lucide-react';

const CARDS = [
  {
    icon: ShieldCheck,
    title: 'AWaRe Framework',
    desc: 'WHO Access, Watch, Reserve antibiotic classifications plus IV-to-oral switch criteria.',
    href: '/hcp/aware',
    accent: '#10B981',
    badge: 'Classification',
  },
  {
    icon: Brain,
    title: 'Stewardship Challenge',
    desc: '20 clinical questions across 4 stewardship domains. Benchmark your prescribing knowledge.',
    href: '/hcp/quiz',
    accent: '#A78BFA',
    badge: 'Assessment',
  },
  {
    icon: Stethoscope,
    title: 'Clinical Support Tool',
    desc: 'Empirical therapy guidance for 6 infection types with patient-specific factor alerts.',
    href: '/hcp/tool',
    accent: '#3B82F6',
    badge: 'Decision Aid',
  },
  {
    icon: Microscope,
    title: 'Egypt Resistance Trends',
    desc: 'Pathogen-antibiotic resistance rates from Egyptian AMR surveillance data 2019–2024.',
    href: '/hcp/trends',
    accent: '#F97316',
    badge: 'Epidemiology',
  },
  {
    icon: Activity,
    title: 'Infection vs Colonization',
    desc: 'Clinical decision tool to evaluate culture results and determine infection vs colonization.',
    href: '/hcp/infection',
    accent: '#EF4444',
    badge: 'Clinical Aid',
  },
  {
    icon: Shield,
    title: 'Surgical Prophylaxis',
    desc: 'Evidence-based antimicrobial prophylaxis protocols for 7 procedure types.',
    href: '/hcp/prophylaxis',
    accent: '#10B981',
    badge: 'Protocol',
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

export default function HCPDashboard() {
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
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(96,165,250,0.7)' }}>
            Clinical Tools
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            All Stewardship Resources
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          {CARDS.map(({ icon: Icon, title, desc, href, accent, badge }) => (
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
                background: 'rgba(255,255,255,0.065)',
                border: `1px solid ${accent}40`,
                boxShadow: `0 12px 40px ${accent}22, 0 0 0 1px ${accent}18`,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            >
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

              <div className="flex-1">
                <h3 className="text-white font-bold text-base mb-1.5">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>

              <div
                className="flex items-center gap-1 text-xs font-semibold transition-all duration-200"
                style={{ color: accent }}
              >
                Open Tool
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
