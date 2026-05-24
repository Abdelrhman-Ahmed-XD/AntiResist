import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Pill, Globe, ShieldCheck } from 'lucide-react';
import ShieldScene from './ShieldScene';
import FloatingParticles from './FloatingParticles';

const FEATURE_CARDS = [
  { icon: AlertTriangle, title: 'The Threat is Real',  desc: 'AMR causes over 1 million deaths globally each year.',      color: 'text-rose-400',    bg: 'bg-rose-500/8'   },
  { icon: Pill,          title: 'Harder to Treat',     desc: 'Common infections are becoming harder to cure.',             color: 'text-violet-400',  bg: 'bg-violet-500/8' },
  { icon: Globe,         title: 'A Global Crisis',     desc: 'It affects everyone, everywhere.',                          color: 'text-sky-400',     bg: 'bg-sky-500/8'    },
  { icon: ShieldCheck,   title: 'Together We Can',     desc: 'Responsible use of antibiotics can save lives.',            color: 'text-emerald-400', bg: 'bg-emerald-500/8'},
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.11 } },
};
const cardIn = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const shieldIn = {
  hidden: { opacity: 0, scale: 0.9, x: 24 },
  show:   { opacity: 1, scale: 1,   x: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.12 } },
};

export default function HeroPortal() {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section ref={sectionRef} id="portal-hero"
      className="relative min-h-screen flex flex-col overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: "url('/portal-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }} />
        <div className="absolute inset-0" style={{ background: 'rgba(7,7,26,0.56)' }} />
        <div className="absolute inset-0" style={{
          background:
            'radial-gradient(ellipse 70% 50% at 60% 35%, rgba(79,46,180,0.20) 0%, transparent 60%),' +
            'radial-gradient(ellipse 50% 65% at 18% 60%, rgba(55,32,160,0.12) 0%, transparent 55%)',
        }} />
      </div>

      {/* Mouse-reactive floating pills + bacteria */}
      <FloatingParticles containerRef={sectionRef} />

      {/* 2-column hero */}
      <div className="relative flex-1 flex items-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center w-full">

          {/* Left — staggered text */}
          <motion.div className="flex flex-col items-start" variants={stagger} initial="hidden" animate="show">

            {/* Badge pill */}
            <motion.div variants={fadeUp} className="section-label mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Patient Education Portal
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-[4.2rem] font-extrabold leading-[1.08] tracking-tight text-white mb-5">
              Antibiotic
              <br />
              <motion.span
                className="neon-text"
                style={{ color: '#A78BFA' }}
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                Resistance
              </motion.span>
              <br />
              <span className="text-slate-300 font-semibold text-4xl sm:text-5xl lg:text-[3.2rem]">
                is Rising.
              </span>
            </motion.h1>

            {/* Sub-text */}
            <motion.p variants={fadeUp}
              className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-md mb-9 font-normal">
              Antibiotic resistance occurs when bacteria change in response to the use
              of these medicines, making infections harder to treat and easier to spread.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <motion.button
                onClick={() => scrollTo('info-modules')}
                whileHover={{ scale: 1.04, boxShadow: '0 6px 28px rgba(109,40,217,0.38)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-white text-sm
                  bg-gradient-to-r from-violet-600 to-indigo-600
                  shadow-[0_2px_16px_rgba(109,40,217,0.28)] transition-shadow duration-300"
              >
                Learn More
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >→</motion.span>
              </motion.button>

              <motion.button
                onClick={() => navigate('/portal/quiz')}
                whileHover={{ scale: 1.04, backgroundColor: 'rgba(109,40,217,0.18)', borderColor: 'rgba(167,139,250,0.55)' }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3 rounded-full font-semibold text-violet-300 text-sm
                  border border-violet-500/30 transition-all duration-250"
              >
                Take the Quiz
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right — shield */}
          <motion.div
            className="relative flex items-center justify-center lg:justify-end"
            variants={shieldIn} initial="hidden" animate="show"
          >
            <ShieldScene />
          </motion.div>
        </div>
      </div>

      {/* Bottom feature cards */}
      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          variants={stagger} initial="hidden" animate="show"
        >
          {FEATURE_CARDS.map(({ icon: Icon, title, desc, color, bg }) => (
            <motion.div
              key={title}
              variants={cardIn}
              whileHover={{ y: -4, boxShadow: '0 8px 28px rgba(0,0,0,0.22), 0 0 0 1px rgba(139,92,246,0.16)' }}
              className="glass-card rounded-2xl p-5 flex items-start gap-3.5 cursor-default"
            >
              <div className={`shrink-0 w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={17} className={color} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-0.5">{title}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
