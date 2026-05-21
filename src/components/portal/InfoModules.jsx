import { Microscope, AlertOctagon, RefreshCw, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MODULES = [
  {
    icon: Microscope,
    title: 'Viral vs Bacterial Infections',
    color: 'text-violet-400',
    glow: 'rgba(139,92,246,0.4)',
    content: [
      { label: 'Viral Infections',   text: 'Caused by viruses — influenza, common cold, COVID-19. Antibiotics have absolutely no effect on viruses. Using them anyway only harms your microbiome and promotes resistance.' },
      { label: 'Bacterial Infections', text: 'Caused by bacteria — Streptococcus (strep throat), E. coli (UTIs), Staphylococcus (skin infections). Antibiotics are specifically designed to target and kill bacteria. This is where they work.' },
    ],
  },
  {
    icon: AlertOctagon,
    title: 'Why Misuse is Dangerous',
    color: 'text-red-400',
    glow: 'rgba(239,68,68,0.35)',
    content: [
      { label: 'Immediate Risks',       text: 'Taking antibiotics unnecessarily can trigger allergic reactions, severe GI upset, and destroy beneficial gut bacteria — weakening your immune defenses.' },
      { label: 'Long-term Consequences', text: 'Every misuse accelerates antimicrobial resistance (AMR). Bacteria evolve and adapt, making future infections — even routine ones — potentially untreatable.' },
    ],
  },
  {
    icon: RefreshCw,
    title: 'How Resistance Develops',
    color: 'text-amber-400',
    glow: 'rgba(251,191,36,0.35)',
    content: [
      { label: 'The Mechanism',   text: 'When bacteria are repeatedly exposed to antibiotics, weaker strains die — but naturally resistant mutants survive. They multiply and become the dominant strain.' },
      { label: 'Resistance Spreads', text: "Resistant bacteria transfer resistance genes to other bacteria (even unrelated species) via plasmids. One person's misuse can seed resistance across a community." },
    ],
  },
  {
    icon: Share2,
    title: "Why Antibiotics Shouldn't Be Shared",
    color: 'text-emerald-400',
    glow: 'rgba(52,211,153,0.35)',
    content: [
      { label: 'Wrong Drug, Wrong Dose', text: 'Every antibiotic targets specific bacteria. Sharing means taking the wrong drug for your infection — guaranteeing treatment failure while wiping out healthy bacteria.' },
      { label: 'Incomplete Treatment',   text: "Shared antibiotics are rarely a full course. Stopping early — or taking only part of someone else's supply — leaves the strongest bacteria alive to rebound and spread." },
    ],
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.14 } },
};

const headerVariant = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function InfoModules() {
  return (
    <section id="info-modules" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          variants={headerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="section-label mb-4 mx-auto">Core Concepts</div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            What You Need to Know
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Understanding these four principles is the foundation of responsible antibiotic use.
          </p>
        </motion.div>

        {/* 2×2 grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {MODULES.map(({ icon: Icon, title, color, glow, content }) => (
            <motion.div
              key={title}
              variants={cardVariant}
              whileHover={{
                y: -5,
                boxShadow: `0 0 28px ${glow}`,
                borderColor: glow.replace('0.4', '0.6').replace('0.35', '0.55'),
              }}
              className="glass-card rounded-2xl p-8 group"
              style={{ cursor: 'default' }}
            >
              {/* Icon header */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.12, rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.35 }}
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                  style={{ boxShadow: `0 0 0 0 ${glow}` }}
                >
                  <Icon size={22} className={color} strokeWidth={1.8} />
                </motion.div>
                <h3 className="text-white font-bold text-xl">{title}</h3>
              </div>

              {/* Content blocks */}
              <div className="space-y-4">
                {content.map(({ label, text }) => (
                  <div key={label} className="flex gap-3">
                    <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <div>
                      <span className={`text-sm font-semibold ${color} block mb-1`}>{label}</span>
                      <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom glow accent */}
              <div className="mt-6 h-px w-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${glow}, transparent)` }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
