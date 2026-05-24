/**
 * HomeParticles — full-page ambient bacteria + pill decorations.
 *
 * Bacteria types (8, based on reference silhouette image):
 *   cocci   — bumpy sphere (streptococcus/staphylococcus)
 *   corona  — spike ball with knob tips (virus morphology)
 *   rod     — oval body with short cilia (bacillus)
 *   vibrio  — crescent/comma curved shape
 *   strep   — chain of small spheres
 *   phage   — round body with stick legs + ball tips (bacteriophage T4)
 *   spiky   — sharp sun/star with pointed spike tips (sea-urchin style)
 *   spore   — simple plain sphere (dormant spore / small dot)
 *
 * Color rule: left <34% = purple, right >66% = blue, center = indigo
 * Hero zone (top 0-20%): opacity 0.50 — many, large, fully visible
 * Rest of page (top 20-100%): opacity 0.16 — sparser, subtle
 * All particles repel the mouse cursor via spring physics.
 */
import { memo, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const REPEL_RADIUS = 145;
const SPRING_CFG   = { stiffness: 160, damping: 22, mass: 1.1 };

/* ── Color resolver ──────────────────────────────────────── */
const PURPLES  = ['#7C3AED','#6D28D9','#8B5CF6','#A78BFA'];
const BLUES    = ['#2563EB','#1D4ED8','#3B82F6','#60A5FA'];
const INDIGOES = ['#6366F1','#4338CA','#818CF8','#4F46E5'];

function colorForLeft(leftStr) {
  const x = parseFloat(leftStr);
  if (x < 34) return PURPLES[Math.floor(x / 8.5) % PURPLES.length];
  if (x > 66) return BLUES[Math.floor((x - 66) / 8.5) % BLUES.length];
  return INDIGOES[Math.floor((x - 34) / 8) % INDIGOES.length];
}

/* ══════════════════════════════════════════════════════════
   PILL SVG
══════════════════════════════════════════════════════════ */
function PillSVG({ id, w = 58, h = 23, color }) {
  const half = w / 2, r = h / 2;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible" aria-hidden="true">
      <defs>
        <filter id={`hp-pf-${id}`} x="-40%" y="-80%" width="180%" height="260%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width={w} height={h} rx={r}
        fill="none" stroke={color} strokeWidth="1" filter={`url(#hp-pf-${id})`} opacity="0.65" />
      <rect x="0" y="0" width={half} height={h} rx={r}
        fill={color} fillOpacity="0.35" />
      <rect x={half} y="0" width={half} height={h} rx={r}
        fill={color} fillOpacity="0.20" />
      <line x1={half} y1="3" x2={half} y2={h - 3}
        stroke={color} strokeWidth="0.8" strokeOpacity="0.45" />
      <rect x="5" y="4" width={half - 10} height="3" rx="1.5"
        fill="rgba(255,255,255,0.22)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   BACTERIA — Type 1: Cocci (bumpy sphere)
══════════════════════════════════════════════════════════ */
function BacteriaCocci({ id, size = 46, color }) {
  const r = size * 0.32, br = size * 0.075, cx = size / 2, cy = size / 2;
  const bumps = 12;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={`hp-cg-${id}`} cx="38%" cy="32%">
          <stop offset="0%"  stopColor={color} stopOpacity="0.48" />
          <stop offset="100%" stopColor={color} stopOpacity="0.16" />
        </radialGradient>
        <filter id={`hp-cf-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r + br + 3} fill={color} fillOpacity="0.06" filter={`url(#hp-cf-${id})`} />
      {Array.from({ length: bumps }, (_, i) => {
        const a = (i / bumps) * Math.PI * 2 - Math.PI / 2;
        return <circle key={i} cx={cx + Math.cos(a) * (r + br * 0.5)} cy={cy + Math.sin(a) * (r + br * 0.5)}
          r={br} fill={color} fillOpacity="0.48" />;
      })}
      <circle cx={cx} cy={cy} r={r} fill={`url(#hp-cg-${id})`}
        stroke={color} strokeWidth="1" strokeOpacity="0.52" filter={`url(#hp-cf-${id})`} />
      <circle cx={cx - r * 0.25} cy={cy - r * 0.28} r={r * 0.26} fill="rgba(255,255,255,0.14)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   BACTERIA — Type 2: Corona (spike ball + knob tips)
══════════════════════════════════════════════════════════ */
function BacteriaCorona({ id, size = 56, color }) {
  const cx = size / 2, cy = size / 2;
  const rBody = size * 0.22, rSpk = size * 0.38, rTip = size * 0.052;
  const spikes = 10;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={`hp-vg-${id}`} cx="35%" cy="30%">
          <stop offset="0%"  stopColor={color} stopOpacity="0.52" />
          <stop offset="100%" stopColor={color} stopOpacity="0.18" />
        </radialGradient>
        <filter id={`hp-vf-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={rSpk + rTip + 2} fill={color} fillOpacity="0.05" filter={`url(#hp-vf-${id})`} />
      {Array.from({ length: spikes }, (_, i) => {
        const a = (i / spikes) * Math.PI * 2;
        return <line key={i}
          x1={cx + Math.cos(a) * rBody} y1={cy + Math.sin(a) * rBody}
          x2={cx + Math.cos(a) * rSpk}  y2={cy + Math.sin(a) * rSpk}
          stroke={color} strokeWidth="1.2" strokeOpacity="0.58" strokeLinecap="round" />;
      })}
      {Array.from({ length: spikes }, (_, i) => {
        const a = (i / spikes) * Math.PI * 2;
        return <circle key={i}
          cx={cx + Math.cos(a) * (rSpk + rTip * 0.8)} cy={cy + Math.sin(a) * (rSpk + rTip * 0.8)}
          r={rTip} fill={color} fillOpacity="0.62" />;
      })}
      <circle cx={cx} cy={cy} r={rBody} fill={`url(#hp-vg-${id})`}
        stroke={color} strokeWidth="1" strokeOpacity="0.58" filter={`url(#hp-vf-${id})`} />
      <circle cx={cx - rBody * 0.22} cy={cy - rBody * 0.25} r={rBody * 0.24} fill="rgba(255,255,255,0.14)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   BACTERIA — Type 3: Rod (oval with cilia)
══════════════════════════════════════════════════════════ */
function BacteriaRod({ id, size = 72, color }) {
  const vw = size, vh = size * 0.40, cx = vw / 2, cy = vh / 2;
  const rx = vw * 0.42, ry = vh * 0.36;
  const pLen = vh * 0.40, piliCount = 8;
  const pili = Array.from({ length: piliCount }, (_, i) => {
    const t = (i + 0.5) / piliCount;
    const bx = cx + (t - 0.5) * 2 * rx * 0.88;
    const arcFrac = Math.sqrt(Math.max(0, 1 - Math.pow((bx - cx) / rx, 2)));
    return { bx, topY: cy - ry * arcFrac, botY: cy + ry * arcFrac };
  });
  return (
    <svg width={vw} height={vh + pLen * 2 + 4} viewBox={`0 ${-pLen - 2} ${vw} ${vh + pLen * 2 + 4}`} overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={`hp-rg-${id}`} cx="35%" cy="30%">
          <stop offset="0%"  stopColor={color} stopOpacity="0.46" />
          <stop offset="100%" stopColor={color} stopOpacity="0.16" />
        </radialGradient>
        <filter id={`hp-rf-${id}`} x="-30%" y="-40%" width="160%" height="180%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx + 3} ry={ry + 3} fill={color} fillOpacity="0.05" filter={`url(#hp-rf-${id})`} />
      {pili.map(({ bx, topY }, i) => (
        <line key={`t${i}`} x1={bx} y1={topY} x2={bx + (i % 3 - 1) * 1.5} y2={topY - pLen}
          stroke={color} strokeWidth="0.9" strokeOpacity="0.42" strokeLinecap="round" />
      ))}
      {pili.map(({ bx, botY }, i) => (
        <line key={`b${i}`} x1={bx} y1={botY} x2={bx + (i % 3 - 1) * 1.5} y2={botY + pLen}
          stroke={color} strokeWidth="0.9" strokeOpacity="0.42" strokeLinecap="round" />
      ))}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#hp-rg-${id})`}
        stroke={color} strokeWidth="1" strokeOpacity="0.52" filter={`url(#hp-rf-${id})`} />
      <ellipse cx={cx - rx * 0.22} cy={cy - ry * 0.26} rx={rx * 0.26} ry={ry * 0.24} fill="rgba(255,255,255,0.12)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   BACTERIA — Type 4: Vibrio (crescent/comma)
══════════════════════════════════════════════════════════ */
function BacteriaVibrio({ id, size = 56, color }) {
  const vw = size, vh = size * 0.65;
  return (
    <svg width={vw} height={vh} viewBox={`0 0 ${vw} ${vh}`} overflow="visible" aria-hidden="true">
      <defs>
        <filter id={`hp-bf-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d={`M ${vw*0.10},${vh*0.50}
          C ${vw*0.10},${vh*0.15} ${vw*0.35},${vh*0.04} ${vw*0.55},${vh*0.08}
          C ${vw*0.78},${vh*0.12} ${vw*0.94},${vh*0.30} ${vw*0.92},${vh*0.50}
          C ${vw*0.90},${vh*0.70} ${vw*0.76},${vh*0.86} ${vw*0.54},${vh*0.86}
          C ${vw*0.32},${vh*0.86} ${vw*0.10},${vh*0.78} ${vw*0.10},${vh*0.50} Z`}
        fill={color} fillOpacity="0.32"
        stroke={color} strokeWidth="1.2" strokeOpacity="0.60"
        filter={`url(#hp-bf-${id})`} />
      <path d={`M ${vw*0.20},${vh*0.34} C ${vw*0.28},${vh*0.14} ${vw*0.52},${vh*0.10} ${vw*0.68},${vh*0.20}`}
        fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M ${vw*0.10},${vh*0.50} Q ${vw*-0.05},${vh*0.38} ${vw*-0.08},${vh*0.20}`}
        fill="none" stroke={color} strokeWidth="1.1" strokeOpacity="0.42" strokeLinecap="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   BACTERIA — Type 5: Strep chain
══════════════════════════════════════════════════════════ */
function BacteriaStrep({ id, size = 70, color, count = 5 }) {
  const vw = size, vh = size * 0.36, r = vh * 0.42;
  const pts = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    return { x: r + t * (vw - 2 * r), y: vh / 2 - Math.sin(t * Math.PI) * (vh * 0.20) };
  });
  return (
    <svg width={vw} height={vh} viewBox={`0 0 ${vw} ${vh}`} overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={`hp-sg-${id}`} cx="35%" cy="30%">
          <stop offset="0%"  stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0.20" />
        </radialGradient>
        <filter id={`hp-sf-${id}`} x="-50%" y="-80%" width="200%" height="260%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {pts.slice(0, -1).map(({ x, y }, i) => (
        <line key={i} x1={x} y1={y} x2={pts[i + 1].x} y2={pts[i + 1].y}
          stroke={color} strokeWidth="1.6" strokeOpacity="0.32" />
      ))}
      {pts.map(({ x, y }, i) => (
        <circle key={`g${i}`} cx={x} cy={y} r={r + 2}
          fill={color} fillOpacity="0.06" filter={`url(#hp-sf-${id})`} />
      ))}
      {pts.map(({ x, y }, i) => (
        <circle key={i} cx={x} cy={y} r={r}
          fill={`url(#hp-sg-${id})`} stroke={color} strokeWidth="0.9" strokeOpacity="0.55"
          filter={`url(#hp-sf-${id})`} />
      ))}
      {pts.map(({ x, y }, i) => (
        <circle key={`h${i}`} cx={x - r * 0.25} cy={y - r * 0.28} r={r * 0.26}
          fill="rgba(255,255,255,0.16)" />
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   BACTERIA — Type 6: Bacteriophage T4
   Round body + radiating stick legs with ball tips
══════════════════════════════════════════════════════════ */
function BacteriaPhage({ id, size = 62, color }) {
  const cx = size * 0.50, cy = size * 0.46;
  const rBody = size * 0.17;
  const legLen = size * 0.27;
  const ballR  = size * 0.067;
  const legs = 7;

  return (
    <svg width={size} height={size * 1.1} viewBox={`0 0 ${size} ${size * 1.1}`} overflow="visible" aria-hidden="true">
      <defs>
        <filter id={`hp-phf-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id={`hp-phg-${id}`} cx="38%" cy="32%">
          <stop offset="0%"  stopColor={color} stopOpacity="0.58" />
          <stop offset="100%" stopColor={color} stopOpacity="0.22" />
        </radialGradient>
      </defs>
      {/* ambient glow */}
      <circle cx={cx} cy={cy} r={rBody + legLen + ballR + 1}
        fill={color} fillOpacity="0.04" filter={`url(#hp-phf-${id})`} />
      {/* stick legs with mid + tip balls */}
      {Array.from({ length: legs }, (_, i) => {
        const a = (i / legs) * Math.PI * 2;
        const x1 = cx + Math.cos(a) * rBody;
        const y1 = cy + Math.sin(a) * rBody;
        const x2 = cx + Math.cos(a) * (rBody + legLen);
        const y2 = cy + Math.sin(a) * (rBody + legLen);
        const mx = cx + Math.cos(a) * (rBody + legLen * 0.52);
        const my = cy + Math.sin(a) * (rBody + legLen * 0.52);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.62" />
            <circle cx={mx} cy={my} r={ballR * 0.70} fill={color} opacity="0.68" />
            <circle cx={x2}  cy={y2}  r={ballR}        fill={color} opacity="0.78" />
          </g>
        );
      })}
      {/* body */}
      <circle cx={cx} cy={cy} r={rBody}
        fill={`url(#hp-phg-${id})`}
        stroke={color} strokeWidth="1" strokeOpacity="0.68"
        filter={`url(#hp-phf-${id})`} />
      {/* inner ring */}
      <circle cx={cx} cy={cy} r={rBody * 0.52} fill={color} fillOpacity="0.28" />
      {/* highlight */}
      <circle cx={cx - rBody * 0.28} cy={cy - rBody * 0.30} r={rBody * 0.26} fill="rgba(255,255,255,0.18)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   BACTERIA — Type 7: Spiky star (sharp sun / sea-urchin)
   No knob tips — pure sharp pointed spikes
══════════════════════════════════════════════════════════ */
function BacteriaSpiky({ id, size = 58, color }) {
  const cx = size / 2, cy = size / 2;
  const rInner = size * 0.22, rOuter = size * 0.45;
  const spikes = 16;
  const pts = Array.from({ length: spikes * 2 }, (_, i) => {
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={`hp-skg-${id}`} cx="35%" cy="30%">
          <stop offset="0%"  stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0.18" />
        </radialGradient>
        <filter id={`hp-skf-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={rOuter + 2} fill={color} fillOpacity="0.05" filter={`url(#hp-skf-${id})`} />
      <polygon points={pts}
        fill={`url(#hp-skg-${id})`} stroke={color} strokeWidth="0.8" strokeOpacity="0.58"
        filter={`url(#hp-skf-${id})`} />
      <circle cx={cx} cy={cy} r={rInner * 0.70} fill={color} fillOpacity="0.42" />
      <circle cx={cx - rInner * 0.22} cy={cy - rInner * 0.24} r={rInner * 0.22} fill="rgba(255,255,255,0.16)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   BACTERIA — Type 8: Spore (simple sphere / dot)
══════════════════════════════════════════════════════════ */
function BacteriaSpore({ id, size = 26, color }) {
  const cx = size / 2, cy = size / 2, r = size * 0.40;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={`hp-spg-${id}`} cx="38%" cy="32%">
          <stop offset="0%"  stopColor={color} stopOpacity="0.56" />
          <stop offset="100%" stopColor={color} stopOpacity="0.18" />
        </radialGradient>
        <filter id={`hp-spf-${id}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r + 2} fill={color} fillOpacity="0.07" filter={`url(#hp-spf-${id})`} />
      <circle cx={cx} cy={cy} r={r}
        fill={`url(#hp-spg-${id})`} stroke={color} strokeWidth="0.8" strokeOpacity="0.55"
        filter={`url(#hp-spf-${id})`} />
      <circle cx={cx - r * 0.28} cy={cy - r * 0.28} r={r * 0.26} fill="rgba(255,255,255,0.16)" />
    </svg>
  );
}

/* ── Bacteria renderer ─────────────────────────────────── */
function renderBacteria(type, id, size, color) {
  switch (type) {
    case 'cocci':  return <BacteriaCocci  id={id} size={size} color={color} />;
    case 'corona': return <BacteriaCorona id={id} size={size} color={color} />;
    case 'rod':    return <BacteriaRod    id={id} size={size} color={color} />;
    case 'vibrio': return <BacteriaVibrio id={id} size={size} color={color} />;
    case 'strep':  return <BacteriaStrep  id={id} size={size} color={color} />;
    case 'phage':  return <BacteriaPhage  id={id} size={size} color={color} />;
    case 'spiky':  return <BacteriaSpiky  id={id} size={size} color={color} />;
    case 'spore':  return <BacteriaSpore  id={id} size={size} color={color} />;
    case 'pill':   return <PillSVG id={id} w={size} h={Math.round(size * 0.40)} color={color} />;
    default: return null;
  }
}

/* ══════════════════════════════════════════════════════════
   Particle — spring-repel wrapper
   repel=false: skips all RAF loops — just floats gently
══════════════════════════════════════════════════════════ */
function Particle({ mouseRef, style, children, animateProps, duration, delay = 0, opacity, repel }) {
  const elRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, SPRING_CFG);
  const sy = useSpring(my, SPRING_CFG);

  useEffect(() => {
    if (!repel) return; // skip RAF — saves ~54 rAF loops on auth pages
    let rafId;
    const tick = () => {
      const el = elRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const pcx = rect.left + rect.width  / 2;
        const pcy = rect.top  + rect.height / 2;
        const { x: mpx, y: mpy } = mouseRef.current;
        const dx = pcx - mpx, dy = pcy - mpy;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = ((1 - dist / REPEL_RADIUS) ** 1.5) * 90;
          mx.set((dx / dist) * force);
          my.set((dy / dist) * force);
        } else {
          mx.set(0); my.set(0);
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [repel, mx, my, mouseRef]);

  return (
    <motion.div ref={elRef} style={{ ...style, x: sx, y: sy, position: 'absolute', opacity }}>
      <motion.div animate={animateProps} transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Item definitions
══════════════════════════════════════════════════════════ */

/* HERO zone — top 0-20%, high opacity (0.55), dense */
const HERO_ITEMS = [
  // Pills
  { id:'hp1',  type:'pill',  left:'5%',  top:'2%',  rot:'-35deg', sz:64 },
  { id:'hp2',  type:'pill',  left:'88%', top:'3%',  rot:'22deg',  sz:56 },
  { id:'hp3',  type:'pill',  left:'52%', top:'1%',  rot:'70deg',  sz:50 },
  { id:'hp4',  type:'pill',  left:'8%',  top:'14%', rot:'-18deg', sz:60 },
  { id:'hp5',  type:'pill',  left:'82%', top:'15%', rot:'40deg',  sz:54 },
  { id:'hp6',  type:'pill',  left:'44%', top:'18%', rot:'-55deg', sz:48 },
  { id:'hp7',  type:'pill',  left:'22%', top:'6%',  rot:'15deg',  sz:62 },
  { id:'hp8',  type:'pill',  left:'70%', top:'8%',  rot:'-28deg', sz:56 },
  { id:'hp9',  type:'pill',  left:'38%', top:'11%', rot:'42deg',  sz:52 },
  { id:'hp10', type:'pill',  left:'96%', top:'17%', rot:'-60deg', sz:46 },
  // Bacteria — all 8 types represented, densely packed
  { id:'hb1',  type:'cocci',  left:'12%', top:'8%',  rot:'0deg',   sz:52 },
  { id:'hb2',  type:'corona', left:'78%', top:'10%', rot:'14deg',  sz:58 },
  { id:'hb3',  type:'spiky',  left:'35%', top:'5%',  rot:'20deg',  sz:54 },
  { id:'hb4',  type:'phage',  left:'62%', top:'4%',  rot:'-10deg', sz:62 },
  { id:'hb5',  type:'rod',    left:'20%', top:'17%', rot:'-24deg', sz:74 },
  { id:'hb6',  type:'rod',    left:'85%', top:'19%', rot:'30deg',  sz:68 },
  { id:'hb7',  type:'vibrio', left:'48%', top:'12%', rot:'35deg',  sz:60 },
  { id:'hb8',  type:'strep',  left:'6%',  top:'19%', rot:'-8deg',  sz:72 },
  { id:'hb9',  type:'cocci',  left:'92%', top:'7%',  rot:'0deg',   sz:46 },
  { id:'hb10', type:'spore',  left:'30%', top:'15%', rot:'0deg',   sz:30 },
  { id:'hb11', type:'spore',  left:'68%', top:'18%', rot:'0deg',   sz:26 },
  { id:'hb12', type:'phage',  left:'55%', top:'20%', rot:'45deg',  sz:58 },
  { id:'hb13', type:'spiky',  left:'3%',  top:'10%', rot:'-15deg', sz:52 },
  { id:'hb14', type:'corona', left:'94%', top:'13%', rot:'30deg',  sz:50 },
  { id:'hb15', type:'vibrio', left:'17%', top:'3%',  rot:'-40deg', sz:56 },
  { id:'hb16', type:'strep',  left:'74%', top:'5%',  rot:'18deg',  sz:66 },
  { id:'hb17', type:'cocci',  left:'43%', top:'19%', rot:'0deg',   sz:44 },
  { id:'hb18', type:'spore',  left:'58%', top:'9%',  rot:'0deg',   sz:28 },
  { id:'hb19', type:'phage',  left:'27%', top:'11%', rot:'-30deg', sz:56 },
  { id:'hb20', type:'spiky',  left:'97%', top:'5%',  rot:'10deg',  sz:50 },
  { id:'hb21', type:'rod',    left:'1%',  top:'5%',  rot:'60deg',  sz:62 },
  { id:'hb22', type:'corona', left:'50%', top:'17%', rot:'-20deg', sz:52 },
];

/* PAGE zone — top 22-100%, moderate opacity (0.30), well spread */
const PAGE_ITEMS = [
  // WhatIsAMR (~22-34%)
  { id:'pw1', type:'pill',   left:'4%',  top:'24%', rot:'-20deg', sz:52 },
  { id:'pw2', type:'cocci',  left:'92%', top:'26%', rot:'10deg',  sz:48 },
  { id:'pw3', type:'rod',    left:'7%',  top:'30%', rot:'25deg',  sz:64 },
  { id:'pw4', type:'spiky',  left:'88%', top:'32%', rot:'-40deg', sz:52 },
  { id:'pw5', type:'corona', left:'50%', top:'22%', rot:'15deg',  sz:50 },
  { id:'pw6', type:'spore',  left:'96%', top:'29%', rot:'0deg',   sz:26 },
  // RationalUse (~34-48%)
  { id:'pr1', type:'phage',  left:'3%',  top:'36%', rot:'8deg',   sz:58 },
  { id:'pr2', type:'corona', left:'93%', top:'38%', rot:'-22deg', sz:52 },
  { id:'pr3', type:'pill',   left:'11%', top:'44%', rot:'-50deg', sz:52 },
  { id:'pr4', type:'vibrio', left:'87%', top:'46%', rot:'30deg',  sz:58 },
  { id:'pr5', type:'strep',  left:'48%', top:'40%', rot:'-12deg', sz:62 },
  { id:'pr6', type:'spore',  left:'2%',  top:'43%', rot:'0deg',   sz:24 },
  // Impact (~48-64%)
  { id:'pi1', type:'pill',   left:'5%',  top:'50%', rot:'18deg',  sz:54 },
  { id:'pi2', type:'rod',    left:'91%', top:'52%', rot:'-35deg', sz:66 },
  { id:'pi3', type:'spore',  left:'10%', top:'58%', rot:'0deg',   sz:28 },
  { id:'pi4', type:'cocci',  left:'88%', top:'62%', rot:'0deg',   sz:46 },
  { id:'pi5', type:'strep',  left:'50%', top:'48%', rot:'-60deg', sz:68 },
  { id:'pi6', type:'phage',  left:'96%', top:'57%', rot:'25deg',  sz:54 },
  { id:'pi7', type:'spiky',  left:'45%', top:'60%', rot:'35deg',  sz:50 },
  // HowToHelp (~64-82%)
  { id:'ph1', type:'phage',  left:'4%',  top:'66%', rot:'-18deg', sz:60 },
  { id:'ph2', type:'pill',   left:'93%', top:'68%', rot:'35deg',  sz:56 },
  { id:'ph3', type:'spiky',  left:'7%',  top:'74%', rot:'12deg',  sz:54 },
  { id:'ph4', type:'vibrio', left:'90%', top:'78%', rot:'-28deg', sz:58 },
  { id:'ph5', type:'spore',  left:'48%', top:'70%', rot:'0deg',   sz:24 },
  { id:'ph6', type:'corona', left:'50%', top:'80%', rot:'-15deg', sz:52 },
  { id:'ph7', type:'rod',    left:'2%',  top:'79%', rot:'40deg',  sz:60 },
  // SDG + VSSplit (~82-100%)
  { id:'ps1', type:'pill',   left:'3%',  top:'84%', rot:'-42deg', sz:52 },
  { id:'ps2', type:'corona', left:'92%', top:'86%', rot:'25deg',  sz:52 },
  { id:'ps3', type:'rod',    left:'14%', top:'91%', rot:'-8deg',  sz:62 },
  { id:'ps4', type:'cocci',  left:'84%', top:'93%', rot:'15deg',  sz:46 },
  { id:'ps5', type:'strep',  left:'50%', top:'88%', rot:'-30deg', sz:66 },
  { id:'ps6', type:'phage',  left:'5%',  top:'96%', rot:'20deg',  sz:56 },
  { id:'ps7', type:'pill',   left:'88%', top:'97%', rot:'-15deg', sz:50 },
  { id:'ps8', type:'spiky',  left:'46%', top:'95%', rot:'8deg',   sz:48 },
  { id:'ps9', type:'spore',  left:'97%', top:'92%', rot:'0deg',   sz:26 },
];

/* Float animation presets */
const FLOATS = [
  { y: [0, -14, 0], dur: 5.2, delay: 0    },
  { y: [0, -18, 0], dur: 6.8, delay: 1.4  },
  { y: [0, -11, 0], dur: 7.4, delay: 0.5  },
  { y: [0, -15, 0], dur: 5.9, delay: 2.0  },
  { y: [0, -19, 0], dur: 4.8, delay: 0.8  },
  { y: [0, -12, 0], dur: 8.2, delay: 1.8  },
  { y: [0, -16, 0], dur: 7.0, delay: 3.0  },
  { y: [0, -10, 0], dur: 9.1, delay: 0.3  },
  { y: [0, -13, 0], dur: 6.4, delay: 2.5  },
  { y: [0, -17, 0], dur: 5.5, delay: 1.0  },
  { y: [0, -14, 0], dur: 8.8, delay: 3.5  },
  { y: [0, -20, 0], dur: 4.5, delay: 0.6  },
];

/* ══════════════════════════════════════════════════════════
   Main export
   repel (default true) — enables mouse-repel RAF loops.
   Pass repel={false} on non-home pages for much lower CPU.
══════════════════════════════════════════════════════════ */
export default memo(function HomeParticles({ repel = true }) {
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    if (!repel) return; // no mouse tracking needed without repel
    const onMove  = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = ()  => { mouseRef.current = { x: -9999,    y: -9999    }; };
    document.addEventListener('mousemove',  onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [repel]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 0 }}>

      {/* Hero zone — fully visible */}
      {HERO_ITEMS.map(({ id, type, left, top, rot, sz }, idx) => {
        const color = colorForLeft(left);
        const { y, dur, delay } = FLOATS[idx % FLOATS.length];
        return (
          <Particle key={id} mouseRef={mouseRef} style={{ left, top }} opacity={0.56}
            animateProps={{ y }} duration={dur} delay={delay} repel={repel}>
            <div style={{ rotate: rot, display: 'inline-block' }}>
              {renderBacteria(type, id, sz, color)}
            </div>
          </Particle>
        );
      })}

      {/* Rest of page — subtle */}
      {PAGE_ITEMS.map(({ id, type, left, top, rot, sz }, idx) => {
        const color = colorForLeft(left);
        const { y, dur, delay } = FLOATS[(idx + 5) % FLOATS.length];
        return (
          <Particle key={id} mouseRef={mouseRef} style={{ left, top }} opacity={0.30}
            animateProps={{ y }} duration={dur} delay={delay} repel={repel}>
            <div style={{ rotate: rot, display: 'inline-block' }}>
              {renderBacteria(type, id, sz, color)}
            </div>
          </Particle>
        );
      })}

    </div>
  );
});
