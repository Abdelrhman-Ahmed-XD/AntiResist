import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Stethoscope, ShieldCheck, Brain, Activity,
  Heart, BookOpen, ChevronRight, Microscope,
} from 'lucide-react';

const VP   = { once: true, amount: 0.08 };
const ease = [0.22, 1, 0.36, 1];

const PATIENT_LINKS = [
  { icon: Heart,     label: 'What is AMR?',      href: '/portal#amr-info' },
  { icon: Brain,     label: 'Patient Quiz',       href: '/portal#quiz' },
  { icon: BookOpen,  label: 'Myth Busters',       href: '/portal#myths' },
  { icon: Activity,  label: 'Symptom Checker',    href: '/portal#checker' },
];

const HCP_LINKS = [
  { icon: ShieldCheck, label: 'AWaRe Framework',       href: '/hcp#aware-section' },
  { icon: Brain,       label: 'Stewardship Challenge', href: '/hcp#stewardship-quiz' },
  { icon: Stethoscope, label: 'Clinical Support Tool', href: '/hcp#support-tool' },
  { icon: Microscope,  label: 'Resistance Trends',     href: '/hcp#resistance-trends' },
];

const PATIENT = {
  accentColor:  '#7C3AED',
  hoverAccent:  '#6D28D9',
  bgGradient:   'rgba(255,255,255,0.85)',
  hoverBg:      'rgba(255,255,255,1)',
  borderColor:  '1px solid rgba(124,58,237,0.18)',
  hoverBorder:  '1px solid rgba(124,58,237,0.42)',
  shadow:       '0 4px 24px rgba(124,58,237,0.08)',
  hoverShadow:  '0 20px 64px rgba(124,58,237,0.22)',
  badgeBg:      'rgba(124,58,237,0.1)',
  badgeBorder:  '1px solid rgba(124,58,237,0.28)',
  ctaBg:        'linear-gradient(135deg, #7C3AED, #2563EB)',
  ctaShadow:    '0 4px 20px rgba(124,58,237,0.36)',
};

const HCP = {
  accentColor:  '#2563EB',
  hoverAccent:  '#1D4ED8',
  bgGradient:   'rgba(255,255,255,0.85)',
  hoverBg:      'rgba(255,255,255,1)',
  borderColor:  '1px solid rgba(37,99,235,0.18)',
  hoverBorder:  '1px solid rgba(37,99,235,0.42)',
  shadow:       '0 4px 24px rgba(37,99,235,0.08)',
  hoverShadow:  '0 20px 64px rgba(37,99,235,0.22)',
  badgeBg:      'rgba(37,99,235,0.1)',
  badgeBorder:  '1px solid rgba(37,99,235,0.28)',
  ctaBg:        'linear-gradient(135deg, #2563EB, #1D4ED8)',
  ctaShadow:    '0 4px 20px rgba(37,99,235,0.36)',
};

function PortalCard({ theme, badgeText, title, subtitle, desc, links, ctaLabel, ctaTo, ghostLabel, ghostTo, scale, isHovered, onHoverStart, onHoverEnd, animStyle }) {
  const t = theme;

  return (
    <motion.div
      className="flex-1 rounded-3xl p-8 flex flex-col gap-6 min-h-[480px] cursor-default bg-white"
      style={{
        border:      isHovered ? t.hoverBorder : t.borderColor,
        boxShadow:   isHovered ? t.hoverShadow : t.shadow,
        transition: 'border 0.35s ease, box-shadow 0.35s ease',
        ...animStyle,
      }}
      animate={{ scale }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
        style={{ background: t.badgeBg, border: t.badgeBorder, color: t.accentColor }}
      >
        {badgeText}
      </div>

      {/* Headline */}
      <div>
        <h3
          className="text-3xl font-extrabold tracking-tight mb-2"
          style={{
            background: `linear-gradient(135deg, ${t.accentColor}, ${t.hoverAccent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </h3>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">{subtitle}</p>
        <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
      </div>

      {/* Quick links */}
      <ul className="space-y-2.5 flex-1">
        {links.map(({ icon: Icon, label, href }) => (
          <li key={label}>
            <Link
              to={href}
              className="flex items-center gap-3 text-sm text-gray-500 hover:text-gray-900 group transition-colors duration-200"
            >
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
                style={{ background: `${t.accentColor}14`, border: `1px solid ${t.accentColor}30` }}
              >
                <Icon size={15} style={{ color: t.accentColor }} />
              </span>
              {label}
              <ChevronRight size={13} className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: t.accentColor }} />
            </Link>
          </li>
        ))}
      </ul>

      {/* CTAs */}
      <div className="flex flex-col gap-3 mt-2">
        <Link
          to={ctaTo}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: t.ctaBg, boxShadow: t.ctaShadow }}
        >
          {ctaLabel}
          <ChevronRight size={16} />
        </Link>
        <Link
          to={ghostTo}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{ border: `1px solid ${t.accentColor}35`, color: t.accentColor }}
        >
          {ghostLabel}
          <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function VSSplitSection() {
  const [hovered, setHovered] = useState(null);

  const headerRef = useRef(null);
  const cardsRef  = useRef(null);
  const headerInView = useInView(headerRef, VP);
  const cardsInView  = useInView(cardsRef,  VP);

  const vsBg = hovered === 'patient'
    ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
    : hovered === 'hcp'
    ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
    : 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)';

  const vsScale = hovered ? 1.28 : 1;
  const vsGlow = hovered === 'patient'
    ? '0 0 0 8px rgba(124,58,237,0.18), 0 0 40px rgba(124,58,237,0.36)'
    : hovered === 'hcp'
    ? '0 0 0 8px rgba(37,99,235,0.18), 0 0 40px rgba(37,99,235,0.36)'
    : '0 0 0 6px rgba(124,58,237,0.12), 0 0 32px rgba(124,58,237,0.28)';

  const patientScale = hovered === 'hcp' ? 0.96 : 1;
  const hcpScale     = hovered === 'patient' ? 0.96 : 1;

  return (
    <section id="portals" className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <div ref={headerRef} className="flex flex-col items-center text-center mb-14">
          <motion.p
            className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease }}
          >
            Choose Your Path
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease, delay: headerInView ? 0.08 : 0 }}
          >
            One Platform,{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)' }}
            >
              Two Portals
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-500 text-sm mt-3 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease, delay: headerInView ? 0.16 : 0 }}
          >
            Whether you're a patient seeking guidance or a clinician optimising therapy, AntiResist has a dedicated experience for you.
          </motion.p>
        </div>

        {/* Split layout */}
        <div ref={cardsRef} className="flex flex-col lg:flex-row items-stretch gap-0 lg:gap-0">
          {/* Patient card */}
          <PortalCard
            theme={PATIENT}
            badgeText="For Patients & Public"
            title="Patient Portal"
            subtitle="Education · Awareness · Self Care"
            desc="Learn about antibiotics and AMR, test your knowledge with interactive quizzes, debunk myths, and get personalized guidance in plain language."
            links={PATIENT_LINKS}
            ctaLabel="Enter Patient Portal"
            ctaTo="/portal"
            ghostLabel="For Healthcare Professionals →"
            ghostTo="/hcp"
            scale={patientScale}
            isHovered={hovered === 'patient'}
            onHoverStart={() => setHovered('patient')}
            onHoverEnd={() => setHovered(null)}
            animStyle={{
              opacity: cardsInView ? 1 : 0,
              transform: cardsInView ? 'translateX(0)' : 'translateX(-48px)',
              transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)',
            }}
          />

          {/* VS divider */}
          <div className="flex lg:flex-col items-center justify-center py-8 lg:py-0 lg:px-6 gap-4 lg:gap-0">
            <div className="h-px lg:h-24 lg:w-px w-24 flex-shrink-0"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.25), transparent)' }} />
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.88, 1, 0.88],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: vsBg,
                boxShadow: vsGlow,
                scale: vsScale,
                transition: 'background 0.35s ease, box-shadow 0.35s ease, scale 0.35s ease',
              }}
              className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl tracking-tight select-none text-white"
            >
              VS
            </motion.div>
            <div className="h-px lg:h-24 lg:w-px w-24 flex-shrink-0"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.25), transparent)' }} />
          </div>

          {/* HCP card */}
          <PortalCard
            theme={HCP}
            badgeText="For Healthcare Professionals"
            title="Healthcare Professional"
            subtitle="Stewardship · Evidence · Clinical Tools"
            desc="Access WHO AWaRe antibiotic classifications, Egyptian resistance surveillance data, empirical therapy guidance, and a 20-question stewardship assessment."
            links={HCP_LINKS}
            ctaLabel="Enter Healthcare Professional Portal"
            ctaTo="/hcp"
            ghostLabel="For Patients & Public →"
            ghostTo="/portal"
            scale={hcpScale}
            isHovered={hovered === 'hcp'}
            onHoverStart={() => setHovered('hcp')}
            onHoverEnd={() => setHovered(null)}
            animStyle={{
              opacity: cardsInView ? 1 : 0,
              transform: cardsInView ? 'translateX(0)' : 'translateX(48px)',
              transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s, transform 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s',
            }}
          />
        </div>
      </div>
    </section>
  );
}
