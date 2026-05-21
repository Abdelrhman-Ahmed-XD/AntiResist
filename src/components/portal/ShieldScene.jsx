import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const SHIELD = 'M260,18 L415,85 L415,210 Q415,335 260,408 Q105,335 105,210 L105,85 Z';
const SHIELD_INNER = 'M260,42 L390,104 L390,210 Q390,316 260,384 Q130,316 130,210 L130,104 Z';

const CX = 260, CY = 210;
const R_BODY = 44, R_SPK = 78, R_TIP = 7.5;
const NUM_SPIKES = 12;

const coronaSpikes = Array.from({ length: NUM_SPIKES }, (_, i) => {
  const a = (i / NUM_SPIKES) * Math.PI * 2;
  return {
    x1: CX + Math.cos(a) * R_BODY,
    y1: CY + Math.sin(a) * R_BODY,
    x2: CX + Math.cos(a) * R_SPK,
    y2: CY + Math.sin(a) * R_SPK,
    tx: CX + Math.cos(a) * (R_SPK + R_TIP + 2),
    ty: CY + Math.sin(a) * (R_SPK + R_TIP + 2),
  };
});

const APPROACH = [
  { id: 'ab1', cx: 172, startY: -45, travelY: 82,  r: 12, n: 7, color: '#F87171', dur: 3.8, delay: 0    },
  { id: 'ab2', cx: 265, startY: -55, travelY: 60,  r: 10, n: 6, color: '#FB923C', dur: 4.6, delay: 1.4  },
  { id: 'ab3', cx: 355, startY: -40, travelY: 80,  r: 11, n: 7, color: '#FBBF24', dur: 4.1, delay: 0.85 },
];

function miniSpikes(cx, cy, r, n, len = 6, tipR = 3) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return {
      x1: cx + Math.cos(a) * r,       y1: cy + Math.sin(a) * r,
      x2: cx + Math.cos(a) * (r+len), y2: cy + Math.sin(a) * (r+len),
      tx: cx + Math.cos(a) * (r+len+tipR+1),
      ty: cy + Math.sin(a) * (r+len+tipR+1),
    };
  });
}

const PALETTES = {
  purple: {
    blobA:      'rgba(109,40,217,0.16)',
    blobB:      'rgba(79,46,180,0.12)',
    glowFrom:   'rgba(139,92,246,0.45)',
    glowTo:     'rgba(167,139,250,0.90)',
    ambient:    '#4C1D95',
    fillStop0:  '#6D28D9',
    fillStop1:  '#3B0764',
    fillStop2:  '#1E0B4E',
    borderStop0:'#DDD6FE',
    borderStop1:'#8B5CF6',
    borderStop2:'#6D28D9',
    coronaStop0:'#A78BFA',
    coronaStop1:'#7C3AED',
    coronaStop2:'#3B0764',
    bevelStop:  'rgba(221,214,254,0.18)',
    innerRing:  'rgba(167,139,250,0.10)',
    spikeStroke:'#C4B5FD',
    spikeTip:   '#DDD6FE',
    coronaStroke:'#A78BFA',
    coronaInner:'rgba(109,40,217,0.55)',
    coronaCore: 'rgba(196,181,253,0.75)',
    coronaSheen:'rgba(255,255,255,0.09)',
    fieldWide:  'rgba(109,40,217,0.28)',
    fieldSharp: 'rgba(167,139,250,0.65)',
    apexDot:    '#DDD6FE',
    hintColor:  'rgb(167 139 250 / 0.4)',
    bacteria:   ['#F87171','#FB923C','#FBBF24'],
  },
  blue: {
    blobA:      'rgba(37,99,235,0.16)',
    blobB:      'rgba(29,78,216,0.12)',
    glowFrom:   'rgba(59,130,246,0.45)',
    glowTo:     'rgba(147,197,253,0.90)',
    ambient:    '#1E3A8A',
    fillStop0:  '#1D4ED8',
    fillStop1:  '#1E3A8A',
    fillStop2:  '#0F172A',
    borderStop0:'#DBEAFE',
    borderStop1:'#3B82F6',
    borderStop2:'#1D4ED8',
    coronaStop0:'#93C5FD',
    coronaStop1:'#3B82F6',
    coronaStop2:'#1E3A8A',
    bevelStop:  'rgba(219,234,254,0.18)',
    innerRing:  'rgba(147,197,253,0.10)',
    spikeStroke:'#93C5FD',
    spikeTip:   '#DBEAFE',
    coronaStroke:'#60A5FA',
    coronaInner:'rgba(37,99,235,0.55)',
    coronaCore: 'rgba(147,197,253,0.75)',
    coronaSheen:'rgba(255,255,255,0.09)',
    fieldWide:  'rgba(37,99,235,0.28)',
    fieldSharp: 'rgba(96,165,250,0.65)',
    apexDot:    '#DBEAFE',
    hintColor:  'rgb(96 165 250 / 0.4)',
    bacteria:   ['#F87171','#FB923C','#FBBF24'],
  },
  split: {
    blobA:      'rgba(109,40,217,0.22)',
    blobB:      'rgba(37,99,235,0.20)',
    glowFrom:   'rgba(124,58,237,0.48)',
    glowTo:     'rgba(96,165,250,0.92)',
    ambient:    '#3730A3',
    fillStop0:  '#7C3AED',
    fillStop1:  '#4338CA',
    fillStop2:  '#1D4ED8',
    borderStop0:'#A78BFA',
    borderStop1:'#818CF8',
    borderStop2:'#60A5FA',
    coronaStop0:'#C4B5FD',
    coronaStop1:'#818CF8',
    coronaStop2:'#93C5FD',
    bevelStop:  'rgba(221,214,254,0.22)',
    innerRing:  'rgba(167,139,250,0.12)',
    spikeStroke:'#A5B4FC',
    spikeTip:   '#E0E7FF',
    coronaStroke:'#A78BFA',
    coronaInner:'rgba(67,56,202,0.55)',
    coronaCore: 'rgba(196,181,253,0.80)',
    coronaSheen:'rgba(255,255,255,0.12)',
    fieldWide:  'rgba(124,58,237,0.32)',
    fieldSharp: 'rgba(129,140,248,0.72)',
    apexDot:    '#E0E7FF',
    hintColor:  'rgb(129 140 248 / 0.4)',
    bacteria:   ['#A78BFA','#818CF8','#60A5FA'],
  },
};

export default function ShieldScene({ colorScheme = 'purple' }) {
  const p = PALETTES[colorScheme] ?? PALETTES.purple;
  const bacteriaColors = p.bacteria ?? ['#F87171','#FB923C','#FBBF24'];
  const containerRef = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 110, damping: 22, mass: 1 });
  const smoothY = useSpring(rawY, { stiffness: 110, damping: 22, mass: 1 });
  const rotateY = useTransform(smoothX, [-1, 1], [-11, 11]);
  const rotateX = useTransform(smoothY, [-1, 1], [7, -7]);

  const hoverGlow = useMotionValue(0);
  const smoothGlow = useSpring(hoverGlow, { stiffness: 80, damping: 18 });
  const shieldFilter = useTransform(smoothGlow, [0, 1], [
    `drop-shadow(0 0 14px ${p.glowFrom})`,
    `drop-shadow(0 0 40px ${p.glowTo})`,
  ]);

  const handleMouseMove = useCallback((e) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    rawX.set(((e.clientX - left) / width  - 0.5) * 2);
    rawY.set(((e.clientY - top)  / height - 0.5) * 2);
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0); rawY.set(0); hoverGlow.set(0);
  }, [rawX, rawY, hoverGlow]);

  const handleMouseEnter = useCallback(() => { hoverGlow.set(1); }, [hoverGlow]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center select-none"
      style={{ minHeight: 360, maxHeight: 580, aspectRatio: '1 / 1.05' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Ambient blobs */}
      <div className="absolute rounded-full pointer-events-none animate-blob"
        style={{ width: 260, height: 260, top: '10%', left: '10%',
          background: `radial-gradient(circle, ${p.blobA} 0%, transparent 70%)`,
          filter: 'blur(40px)' }} />
      <div className="absolute rounded-full pointer-events-none animate-blob-delayed"
        style={{ width: 180, height: 180, bottom: '14%', right: '8%',
          background: `radial-gradient(circle, ${p.blobB} 0%, transparent 70%)`,
          filter: 'blur(32px)' }} />

      {/* 3-D tilt wrapper */}
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 900, filter: shieldFilter, width: '100%', maxWidth: 520 }}
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="cursor-pointer"
      >
        <svg viewBox="0 0 520 520" className="w-full h-auto" style={{ overflow: 'visible' }} aria-hidden="true">
          <defs>
            <filter id={`sc-neon-${colorScheme}`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id={`sc-strong-${colorScheme}`} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id={`sc-super-${colorScheme}`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="12" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            {colorScheme === 'split' ? (
              <linearGradient id={`sc-shieldFill-${colorScheme}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.72" />
                <stop offset="42%"  stopColor="#6366F1" stopOpacity="0.52" />
                <stop offset="58%"  stopColor="#3B82F6" stopOpacity="0.52" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.72" />
              </linearGradient>
            ) : (
              <radialGradient id={`sc-shieldFill-${colorScheme}`} cx="38%" cy="28%">
                <stop offset="0%"   stopColor={p.fillStop0} stopOpacity="0.52" />
                <stop offset="55%"  stopColor={p.fillStop1} stopOpacity="0.28" />
                <stop offset="100%" stopColor={p.fillStop2} stopOpacity="0.14" />
              </radialGradient>
            )}
            <linearGradient id={`sc-border-${colorScheme}`} x1="0%" y1="0%" x2={colorScheme === 'split' ? "100%" : "100%"} y2={colorScheme === 'split' ? "0%" : "100%"}>
              <stop offset="0%"   stopColor={p.borderStop0} />
              <stop offset="50%"  stopColor={p.borderStop1} />
              <stop offset="100%" stopColor={p.borderStop2} />
            </linearGradient>
            <radialGradient id={`sc-corona-${colorScheme}`} cx="35%" cy="30%">
              <stop offset="0%"   stopColor={p.coronaStop0} />
              <stop offset="55%"  stopColor={p.coronaStop1} />
              <stop offset="100%" stopColor={p.coronaStop2} />
            </radialGradient>
            <linearGradient id={`sc-bevel-${colorScheme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor={p.bevelStop} />
              <stop offset="100%" stopColor="rgba(221,214,254,0)" />
            </linearGradient>
          </defs>

          {/* approach bacteria removed — floating particles on home page cover this role */}

          {/* ── Shield deep ambient glow ── */}
          <path d={SHIELD} fill={p.ambient} opacity="0.32" filter={`url(#sc-super-${colorScheme})`} />

          {/* Shield fill */}
          <path d={SHIELD} fill={`url(#sc-shieldFill-${colorScheme})`} />

          {/* Top-left bevel highlight */}
          <path d="M260,28 L400,92 L400,218"
            fill="none" stroke={`url(#sc-bevel-${colorScheme})`} strokeWidth="16" strokeLinecap="round" />

          {/* Inner ring */}
          <path d={SHIELD_INNER} fill="none" stroke={p.innerRing} strokeWidth="1.2" />

          {/* Glowing border */}
          <path d={SHIELD} fill="none" stroke={`url(#sc-border-${colorScheme})`} strokeWidth="2.5" filter={`url(#sc-strong-${colorScheme})`} />
          <path d={SHIELD} fill="none" stroke="rgba(221,214,254,0.68)" strokeWidth="1" />

          {/* ── Corona inside shield ── */}
          <circle cx={CX} cy={CY} r="90" fill={p.fillStop1} fillOpacity="0.13" filter={`url(#sc-super-${colorScheme})`} />
          {coronaSpikes.map((s, i) => (
            <line key={`sl-${i}`}
              x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              stroke={p.spikeStroke} strokeWidth="2.8" strokeLinecap="round" filter={`url(#sc-neon-${colorScheme})`} />
          ))}
          {coronaSpikes.map((s, i) => (
            <circle key={`st-${i}`} cx={s.tx} cy={s.ty} r={R_TIP}
              fill={p.spikeTip} filter={`url(#sc-neon-${colorScheme})`} opacity="0.88" />
          ))}
          <circle cx={CX} cy={CY} r={R_BODY}
            fill={`url(#sc-corona-${colorScheme})`} stroke={p.coronaStroke} strokeWidth="1.8" filter={`url(#sc-neon-${colorScheme})`} />
          <circle cx={CX} cy={CY} r="19"
            fill={p.coronaInner} stroke={p.coronaCore} strokeOpacity="0.28" strokeWidth="1" />
          <circle cx={CX} cy={CY} r="7.5" fill={p.coronaCore} />
          <circle cx={CX - 12} cy={CY - 13} r="9" fill={p.coronaSheen} />

          {/* ── No-bacteria prohibition slash (no circle — just the line) ── */}
          <motion.line
            x1={CX - (R_SPK + R_TIP + 4) * 0.707}
            y1={CY - (R_SPK + R_TIP + 4) * 0.707}
            x2={CX + (R_SPK + R_TIP + 4) * 0.707}
            y2={CY + (R_SPK + R_TIP + 4) * 0.707}
            stroke="rgba(239,68,68,0.90)"
            strokeWidth="4"
            strokeLinecap="round"
            filter={`url(#sc-neon-${colorScheme})`}
            animate={{ opacity: [0.70, 1, 0.70] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* ── Shield active force-field glow at top border ── */}
          <motion.path
            d="M100,88 L260,14 L420,88"
            fill="none" stroke={p.fieldWide} strokeWidth="12"
            strokeLinecap="round" filter={`url(#sc-strong-${colorScheme})`}
            animate={{ opacity: [0.2, 0.75, 0.2] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
          />
          <motion.path
            d="M112,83 L260,20 L408,83"
            fill="none" stroke={p.fieldSharp} strokeWidth="2.2"
            strokeLinecap="round" filter={`url(#sc-neon-${colorScheme})`}
            animate={{
              strokeOpacity: [0.35, 1, 0.45, 1, 0.35],
              strokeWidth:   [1.4, 3.2, 1.4, 3.2, 1.4],
            }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Bright apex dot */}
          <motion.g
            animate={{ scale: [1, 1.7, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '260px 18px', transformBox: 'fill-box' }}
          >
            <circle cx="260" cy="18" r="4" fill={p.apexDot} filter={`url(#sc-neon-${colorScheme})`} />
          </motion.g>
        </svg>
      </motion.div>

      {/* Hover hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
      >
        <span className="text-xs font-medium tracking-wide" style={{ color: p.hintColor }}>hover to interact</span>
      </motion.div>
    </div>
  );
}
