/**
 * FloatingParticles — mouse-reactive pills + diverse bacteria
 *
 * Bacteria types (based on reference silhouette image):
 *  • BacteriaCocci      — round sphere with bumpy perimeter (streptococcus / staphylococcus)
 *  • BacteriaCorona     — spiked ball with knobbed tips (coronavirus-style)
 *  • BacteriaRod        — oval body with short cilia/pili all around (bacillus)
 *  • BacteriaVibrio     — crescent / comma curved shape
 *  • BacteriaStrep      — chain of small spheres (streptococcus chain)
 *
 * Each element flees the mouse cursor smoothly via spring physics.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/* ── Spring config ── */
const REPEL_RADIUS = 145;
const SPRING_CFG   = { stiffness: 175, damping: 22, mass: 1.1 };

/* ══════════════════════════════════════════════════════════
   PILL SVG
══════════════════════════════════════════════════════════ */
function PillSVG({ w = 60, h = 24, c1 = '#7C3AED', c2 = '#A78BFA', id }) {
  const half = w / 2;
  const r    = h / 2;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
      <defs>
        <filter id={`pf-${id}`} x="-40%" y="-80%" width="180%" height="260%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* shadow */}
      <rect x="2" y="5" width={w} height={h} rx={r} fill="rgba(0,0,0,0.22)" />
      {/* border glow */}
      <rect x="0" y="0" width={w} height={h} rx={r}
        fill="none" stroke={c2} strokeWidth="1.2" filter={`url(#pf-${id})`} />
      {/* left cap */}
      <rect x="0" y="0" width={half} height={h} rx={r}
        fill={c1} fillOpacity="0.45" />
      {/* right cap */}
      <rect x={half} y="0" width={half} height={h} rx={r}
        fill={c2} fillOpacity="0.28" />
      {/* divider */}
      <line x1={half} y1="3" x2={half} y2={h - 3}
        stroke={c2} strokeWidth="1" strokeOpacity="0.55" />
      {/* shine */}
      <rect x="6" y="4" width={half - 10} height="4" rx="2"
        fill="rgba(255,255,255,0.16)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   BACTERIA SVG — Type 1: Cocci (bumpy round sphere)
   Like the large textured circle in the reference image
══════════════════════════════════════════════════════════ */
function BacteriaCocci({ id, size = 52, color = '#10B981' }) {
  const r  = size * 0.34;   // inner circle radius
  const br = size * 0.08;   // bump radius
  const cx = size / 2;
  const cy = size / 2;
  const bumps = 14;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} overflow="visible">
      <defs>
        <radialGradient id={`cg-${id}`} cx="38%" cy="32%">
          <stop offset="0%"  stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0.20" />
        </radialGradient>
        <filter id={`cf-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* glow backing */}
      <circle cx={cx} cy={cy} r={r + br + 4}
        fill={color} fillOpacity="0.08" filter={`url(#cf-${id})`} />

      {/* bumpy perimeter — small circles around edge */}
      {Array.from({ length: bumps }, (_, i) => {
        const a  = (i / bumps) * Math.PI * 2 - Math.PI / 2;
        const bx = cx + Math.cos(a) * (r + br * 0.55);
        const by = cy + Math.sin(a) * (r + br * 0.55);
        return <circle key={i} cx={bx} cy={by} r={br}
          fill={color} fillOpacity="0.55" stroke={color} strokeWidth="0.5" strokeOpacity="0.4" />;
      })}

      {/* main body */}
      <circle cx={cx} cy={cy} r={r}
        fill={`url(#cg-${id})`} stroke={color} strokeWidth="1.2" strokeOpacity="0.6"
        filter={`url(#cf-${id})`} />

      {/* highlight */}
      <circle cx={cx - r * 0.25} cy={cy - r * 0.28} r={r * 0.28}
        fill="rgba(255,255,255,0.14)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   BACTERIA SVG — Type 2: Corona / Spike-ball
   Round body + radiating spikes with ball tips (virus morphology)
══════════════════════════════════════════════════════════ */
function BacteriaCorona({ id, size = 62, color = '#F87171' }) {
  const cx    = size / 2;
  const cy    = size / 2;
  const rBody = size * 0.22;
  const rSpk  = size * 0.38;
  const rTip  = size * 0.055;
  const spikes = 11;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} overflow="visible">
      <defs>
        <radialGradient id={`vg-${id}`} cx="35%" cy="30%">
          <stop offset="0%"  stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0.22" />
        </radialGradient>
        <filter id={`vf-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* glow */}
      <circle cx={cx} cy={cy} r={rSpk + rTip + 3}
        fill={color} fillOpacity="0.07" filter={`url(#vf-${id})`} />

      {/* spike lines */}
      {Array.from({ length: spikes }, (_, i) => {
        const a  = (i / spikes) * Math.PI * 2;
        const x1 = cx + Math.cos(a) * rBody;
        const y1 = cy + Math.sin(a) * rBody;
        const x2 = cx + Math.cos(a) * rSpk;
        const y2 = cy + Math.sin(a) * rSpk;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color} strokeWidth="1.4" strokeOpacity="0.65" strokeLinecap="round" />;
      })}

      {/* knob tips on spikes */}
      {Array.from({ length: spikes }, (_, i) => {
        const a  = (i / spikes) * Math.PI * 2;
        const tx = cx + Math.cos(a) * (rSpk + rTip * 0.8);
        const ty = cy + Math.sin(a) * (rSpk + rTip * 0.8);
        return <circle key={i} cx={tx} cy={ty} r={rTip}
          fill={color} fillOpacity="0.7" />;
      })}

      {/* body */}
      <circle cx={cx} cy={cy} r={rBody}
        fill={`url(#vg-${id})`} stroke={color} strokeWidth="1.2" strokeOpacity="0.65"
        filter={`url(#vf-${id})`} />

      {/* inner ring */}
      <circle cx={cx} cy={cy} r={rBody * 0.55}
        fill={color} fillOpacity="0.22" />

      {/* highlight */}
      <circle cx={cx - rBody * 0.22} cy={cy - rBody * 0.25} r={rBody * 0.24}
        fill="rgba(255,255,255,0.18)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   BACTERIA SVG — Type 3: Rod Bacillus with pili
   Oval / stadium body with short bristles all around (bacillus)
══════════════════════════════════════════════════════════ */
function BacteriaRod({ id, size = 80, color = '#8B5CF6', piliCount = 9 }) {
  const vw  = size;
  const vh  = size * 0.42;
  const cx  = vw / 2;
  const cy  = vh / 2;
  const rx  = vw * 0.42;
  const ry  = vh * 0.36;
  const pLen = vh * 0.42;  // pili length

  const pili = Array.from({ length: piliCount }, (_, i) => {
    const t  = (i + 0.5) / piliCount;     // 0..1 along top edge
    const bx = cx + (t - 0.5) * 2 * rx * 0.9;
    const arcFrac = Math.sqrt(1 - Math.pow((bx - cx) / rx, 2));
    return { bx, topY: cy - ry * arcFrac, botY: cy + ry * arcFrac };
  });

  return (
    <svg width={vw} height={vh + pLen * 2 + 4} viewBox={`0 ${-pLen - 2} ${vw} ${vh + pLen * 2 + 4}`} overflow="visible">
      <defs>
        <radialGradient id={`rg-${id}`} cx="35%" cy="30%">
          <stop offset="0%"  stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0.20" />
        </radialGradient>
        <filter id={`rf-${id}`} x="-30%" y="-40%" width="160%" height="180%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* glow */}
      <ellipse cx={cx} cy={cy} rx={rx + 4} ry={ry + 4}
        fill={color} fillOpacity="0.07" filter={`url(#rf-${id})`} />

      {/* pili top */}
      {pili.map(({ bx, topY }, i) => (
        <line key={`t${i}`} x1={bx} y1={topY} x2={bx + (i % 3 - 1) * 2} y2={topY - pLen}
          stroke={color} strokeWidth="1.1" strokeOpacity="0.5" strokeLinecap="round" />
      ))}

      {/* pili bottom */}
      {pili.map(({ bx, botY }, i) => (
        <line key={`b${i}`} x1={bx} y1={botY} x2={bx + (i % 3 - 1) * 2} y2={botY + pLen}
          stroke={color} strokeWidth="1.1" strokeOpacity="0.5" strokeLinecap="round" />
      ))}

      {/* body */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
        fill={`url(#rg-${id})`} stroke={color} strokeWidth="1.2" strokeOpacity="0.6"
        filter={`url(#rf-${id})`} />

      {/* inner dots (ribosomes) */}
      {[-rx * 0.5, -rx * 0.18, rx * 0.18, rx * 0.5].map((dx, i) => (
        <circle key={i} cx={cx + dx} cy={cy + (i % 2 === 0 ? -ry * 0.18 : ry * 0.18)} r={ry * 0.14}
          fill={color} fillOpacity="0.5" />
      ))}

      {/* highlight */}
      <ellipse cx={cx - rx * 0.22} cy={cy - ry * 0.26} rx={rx * 0.28} ry={ry * 0.26}
        fill="rgba(255,255,255,0.14)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   BACTERIA SVG — Type 4: Vibrio (curved comma shape)
   Crescent / arc-shaped rod
══════════════════════════════════════════════════════════ */
function BacteriaVibrio({ id, size = 58, color = '#FBBF24' }) {
  const vw = size;
  const vh = size * 0.65;

  return (
    <svg width={vw} height={vh} viewBox={`0 0 ${vw} ${vh}`} overflow="visible">
      <defs>
        <filter id={`bf-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* glow */}
      <path
        d={`M ${vw*0.08},${vh*0.5} Q ${vw*0.25},${vh*0.04} ${vw*0.55},${vh*0.1} Q ${vw*0.88},${vh*0.16} ${vw*0.92},${vh*0.44} Q ${vw*0.88},${vh*0.82} ${vw*0.55},${vh*0.82} Q ${vw*0.25},${vh*0.82} ${vw*0.12},${vh*0.62} Z`}
        fill={color} fillOpacity="0.08" filter={`url(#bf-${id})`}
      />

      {/* body — arc path approximating curved bacillus */}
      <path
        d={`M ${vw*0.10},${vh*0.50}
            C ${vw*0.10},${vh*0.15} ${vw*0.35},${vh*0.04} ${vw*0.55},${vh*0.08}
            C ${vw*0.78},${vh*0.12} ${vw*0.94},${vh*0.30} ${vw*0.92},${vh*0.50}
            C ${vw*0.90},${vh*0.70} ${vw*0.76},${vh*0.86} ${vw*0.54},${vh*0.86}
            C ${vw*0.32},${vh*0.86} ${vw*0.10},${vh*0.78} ${vw*0.10},${vh*0.50} Z`}
        fill={color} fillOpacity="0.32"
        stroke={color} strokeWidth="1.3" strokeOpacity="0.65"
        filter={`url(#bf-${id})`}
      />

      {/* highlight */}
      <path
        d={`M ${vw*0.20},${vh*0.34} C ${vw*0.28},${vh*0.14} ${vw*0.52},${vh*0.10} ${vw*0.68},${vh*0.20}`}
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeLinecap="round"
      />

      {/* small flagellum tail */}
      <path
        d={`M ${vw*0.10},${vh*0.50} Q ${vw*-0.05},${vh*0.38} ${vw*-0.08},${vh*0.20}`}
        fill="none" stroke={color} strokeWidth="1.2" strokeOpacity="0.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   BACTERIA SVG — Type 5: Streptococcus chain
   4–5 spheres in a curved arc
══════════════════════════════════════════════════════════ */
function BacteriaStrep({ id, size = 72, color = '#38BDF8', count = 5 }) {
  const vw = size;
  const vh = size * 0.38;
  const r  = vh * 0.42;

  // Spread spheres in a gentle arc
  const pts = Array.from({ length: count }, (_, i) => {
    const t  = i / (count - 1);
    const x  = r + t * (vw - 2 * r);
    const dy = Math.sin(t * Math.PI) * (vh * 0.22);   // arc upward
    return { x, y: vh / 2 - dy };
  });

  return (
    <svg width={vw} height={vh} viewBox={`0 0 ${vw} ${vh}`} overflow="visible">
      <defs>
        <radialGradient id={`sg-${id}`} cx="35%" cy="30%">
          <stop offset="0%"  stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0.22" />
        </radialGradient>
        <filter id={`sf-${id}`} x="-50%" y="-80%" width="200%" height="260%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* connection lines */}
      {pts.slice(0, -1).map(({ x, y }, i) => (
        <line key={i} x1={x} y1={y} x2={pts[i + 1].x} y2={pts[i + 1].y}
          stroke={color} strokeWidth="1.8" strokeOpacity="0.35" />
      ))}

      {/* glow spheres */}
      {pts.map(({ x, y }, i) => (
        <circle key={`g${i}`} cx={x} cy={y} r={r + 3}
          fill={color} fillOpacity="0.07" filter={`url(#sf-${id})`} />
      ))}

      {/* spheres */}
      {pts.map(({ x, y }, i) => (
        <circle key={i} cx={x} cy={y} r={r}
          fill={`url(#sg-${id})`} stroke={color} strokeWidth="1" strokeOpacity="0.6"
          filter={`url(#sf-${id})`}
        />
      ))}

      {/* highlights */}
      {pts.map(({ x, y }, i) => (
        <circle key={`h${i}`} cx={x - r * 0.25} cy={y - r * 0.28} r={r * 0.26}
          fill="rgba(255,255,255,0.18)" />
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   Per-particle spring repulsion wrapper
══════════════════════════════════════════════════════════ */
function Particle({ mouseRef, style, children, animateProps, duration, delay = 0, repel = true }) {
  const elRef = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, SPRING_CFG);
  const sy = useSpring(my, SPRING_CFG);

  useEffect(() => {
    if (!repel) return;
    let rafId;
    const tick = () => {
      const el = elRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const { x: mpx, y: mpy } = mouseRef.current;
        const dx   = cx - mpx;
        const dy   = cy - mpy;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = ((1 - dist / REPEL_RADIUS) ** 1.5) * 88;
          mx.set((dx / dist) * force);
          my.set((dy / dist) * force);
        } else {
          mx.set(0);
          my.set(0);
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [mx, my, mouseRef, repel]);

  return (
    <motion.div
      ref={elRef}
      style={{ ...style, x: sx, y: sy, position: 'absolute' }}
    >
      <motion.div
        animate={animateProps}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Particle layout — pills + 5 bacteria types
══════════════════════════════════════════════════════════ */
const PILLS = [
  { id: 'p1', left:'7%',  top:'12%', rotate:'-36deg', w:62, h:26, c1:'#7C3AED', c2:'#A78BFA', anim:{ y:[0,-14,0], rotate:['-36deg','-31deg','-36deg'] }, dur:5.2 },
  { id: 'p2', left:'83%', top:'6%',  rotate:'22deg',  w:54, h:22, c1:'#4C1D95', c2:'#C4B5FD', anim:{ y:[0,-18,0], rotate:['22deg','27deg','22deg']  }, dur:6.8 },
  { id: 'p3', left:'88%', top:'57%', rotate:'52deg',  w:58, h:24, c1:'#6D28D9', c2:'#8B5CF6', anim:{ y:[0,-11,0], rotate:['52deg','47deg','52deg']  }, dur:7.4 },
  { id: 'p4', left:'3%',  top:'67%', rotate:'-16deg', w:50, h:20, c1:'#5B21B6', c2:'#DDD6FE', anim:{ y:[0,-15,0], rotate:['-16deg','-11deg','-16deg'] }, dur:5.9 },
  { id: 'p5', left:'43%', top:'2%',  rotate:'74deg',  w:56, h:22, c1:'#7C3AED', c2:'#A78BFA', anim:{ y:[0,-19,0], rotate:['74deg','69deg','74deg']  }, dur:4.8 },
];

const BACTERIA = [
  /* Cocci — left side */
  { id:'b1', type:'cocci',  left:'2%',  top:'28%', rotate:'-8deg',  color:'#10B981', size:50, anim:{ y:[0,-12,0], rotate:['-8deg','-4deg','-8deg'] },   dur:8.2,  delay:0   },
  /* Corona spike-ball — top-right area */
  { id:'b2', type:'corona', left:'76%', top:'17%', rotate:'14deg',  color:'#F87171', size:58, anim:{ y:[0,-16,0], rotate:['14deg','19deg','14deg'] },    dur:7.0,  delay:1.2 },
  /* Rod bacillus — bottom-center-left */
  { id:'b3', type:'rod',    left:'18%', top:'74%', rotate:'-24deg', color:'#8B5CF6', size:76, anim:{ y:[0,-10,0], rotate:['-24deg','-19deg','-24deg'] }, dur:9.1,  delay:0.5 },
  /* Vibrio curved — top-left-center */
  { id:'b4', type:'vibrio', left:'26%', top:'4%',  rotate:'30deg',  color:'#FBBF24', size:56, anim:{ y:[0,-14,0], rotate:['30deg','36deg','30deg'] },    dur:6.4,  delay:2.0 },
  /* Strep chain — right-center */
  { id:'b5', type:'strep',  left:'88%', top:'38%', rotate:'-18deg', color:'#38BDF8', size:68, anim:{ y:[0,-13,0], rotate:['-18deg','-12deg','-18deg'] }, dur:7.8,  delay:0.8 },
  /* Small corona — bottom-right */
  { id:'b6', type:'corona', left:'68%', top:'72%', rotate:'40deg',  color:'#FB923C', size:44, anim:{ y:[0,-17,0], rotate:['40deg','46deg','40deg'] },    dur:5.5,  delay:3.0 },
  /* Small cocci — center-top */
  { id:'b7', type:'cocci',  left:'58%', top:'8%',  rotate:'0deg',   color:'#34D399', size:38, anim:{ y:[0,-11,0], rotate:['0deg','6deg','0deg'] },       dur:9.8,  delay:1.8 },
  /* Center cluster — middle of hero */
  { id:'b8', type:'rod',    left:'44%', top:'42%', rotate:'12deg',  color:'#A78BFA', size:52, anim:{ y:[0,-13,0], rotate:['12deg','17deg','12deg'] },    dur:7.5,  delay:2.2 },
  { id:'b9', type:'cocci',  left:'50%', top:'57%', rotate:'-5deg',  color:'#F472B6', size:42, anim:{ y:[0,-10,0], rotate:['-5deg','0deg','-5deg'] },     dur:8.8,  delay:0.6 },
  { id:'b10',type:'corona', left:'37%', top:'36%', rotate:'25deg',  color:'#C084FC', size:48, anim:{ y:[0,-15,0], rotate:['25deg','31deg','25deg'] },    dur:6.2,  delay:3.1 },
  { id:'b11',type:'vibrio', left:'54%', top:'30%', rotate:'-40deg', color:'#22D3EE', size:44, anim:{ y:[0,-12,0], rotate:['-40deg','-34deg','-40deg'] }, dur:9.2,  delay:1.0 },
];

const PURPLE_PALETTE = [
  '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9',
  '#DDD6FE', '#C084FC', '#A855F7', '#9333EA', '#E9D5FF', '#818CF8',
];

const BLUE_PALETTE = [
  '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8',
  '#BFDBFE', '#7DD3FC', '#38BDF8', '#0EA5E9', '#BAE6FD', '#818CF8',
];

const BLUE_PILLS = [
  { id: 'p1', left:'7%',  top:'12%', rotate:'-36deg', w:62, h:26, c1:'#1D4ED8', c2:'#60A5FA', anim:{ y:[0,-14,0], rotate:['-36deg','-31deg','-36deg'] }, dur:5.2 },
  { id: 'p2', left:'83%', top:'6%',  rotate:'22deg',  w:54, h:22, c1:'#1E3A8A', c2:'#93C5FD', anim:{ y:[0,-18,0], rotate:['22deg','27deg','22deg']  }, dur:6.8 },
  { id: 'p3', left:'88%', top:'57%', rotate:'52deg',  w:58, h:24, c1:'#1D4ED8', c2:'#3B82F6', anim:{ y:[0,-11,0], rotate:['52deg','47deg','52deg']  }, dur:7.4 },
  { id: 'p4', left:'3%',  top:'67%', rotate:'-16deg', w:50, h:20, c1:'#1E40AF', c2:'#BFDBFE', anim:{ y:[0,-15,0], rotate:['-16deg','-11deg','-16deg'] }, dur:5.9 },
  { id: 'p5', left:'43%', top:'2%',  rotate:'74deg',  w:56, h:22, c1:'#2563EB', c2:'#60A5FA', anim:{ y:[0,-19,0], rotate:['74deg','69deg','74deg']  }, dur:4.8 },
];

/* Minimal sets — 2 pills + 3 bacteria for mobile */
const MINIMAL_PILLS = [
  { id: 'mp1', left:'5%',  top:'8%',  rotate:'-36deg', w:56, h:22, c1:'#7C3AED', c2:'#A78BFA', anim:{ y:[0,-14,0] }, dur:5.2 },
  { id: 'mp2', left:'86%', top:'58%', rotate:'52deg',  w:50, h:20, c1:'#6D28D9', c2:'#8B5CF6', anim:{ y:[0,-11,0] }, dur:7.4 },
];
const MINIMAL_PILLS_BLUE = [
  { id: 'mp1', left:'5%',  top:'8%',  rotate:'-36deg', w:56, h:22, c1:'#1D4ED8', c2:'#60A5FA', anim:{ y:[0,-14,0] }, dur:5.2 },
  { id: 'mp2', left:'86%', top:'58%', rotate:'52deg',  w:50, h:20, c1:'#1D4ED8', c2:'#3B82F6', anim:{ y:[0,-11,0] }, dur:7.4 },
];
const MINIMAL_BACTERIA = [
  { id:'mb1', type:'cocci',  left:'3%',  top:'32%', rotate:'-8deg', size:44, anim:{ y:[0,-12,0] }, dur:8.2,  delay:0   },
  { id:'mb2', type:'rod',    left:'87%', top:'18%', rotate:'14deg', size:66, anim:{ y:[0,-10,0] }, dur:9.1,  delay:0.5 },
  { id:'mb3', type:'vibrio', left:'50%', top:'72%', rotate:'30deg', size:50, anim:{ y:[0,-14,0] }, dur:6.4,  delay:2.0 },
];

/* ══════════════════════════════════════════════════════════
   Main export
══════════════════════════════════════════════════════════ */
export default function FloatingParticles({ containerRef, purple = false, blue = false }) {
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const el = containerRef?.current ?? document;
    const onMove  = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () =>  { mouseRef.current = { x: -9999, y: -9999 }; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [containerRef, isMobile]);

  if (isMobile) {
    const mobilePills = blue ? MINIMAL_PILLS_BLUE : MINIMAL_PILLS;
    const mobileBacteriaColors = blue ? BLUE_PALETTE : PURPLE_PALETTE;
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {mobilePills.map(({ id, left, top, rotate, w, h, c1, c2, anim, dur }) => (
          <Particle key={id} mouseRef={mouseRef} style={{ left, top }}
            animateProps={{ ...anim }} duration={dur} repel={false}>
            <div style={{ rotate, display:'inline-block', opacity: 0.55 }}>
              <PillSVG w={w} h={h} c1={c1} c2={c2} id={id} />
            </div>
          </Particle>
        ))}
        {MINIMAL_BACTERIA.map(({ id, type, left, top, rotate, size, anim, dur, delay }, i) => {
          const c = mobileBacteriaColors[i % mobileBacteriaColors.length];
          return (
            <Particle key={id} mouseRef={mouseRef} style={{ left, top }}
              animateProps={anim} duration={dur} delay={delay} repel={false}>
              <div style={{ rotate, display:'inline-block', opacity: 0.45 }}>
                {type === 'cocci'  && <BacteriaCocci  id={id} size={size} color={c} />}
                {type === 'rod'    && <BacteriaRod     id={id} size={size} color={c} />}
                {type === 'vibrio' && <BacteriaVibrio  id={id} size={size} color={c} />}
              </div>
            </Particle>
          );
        })}
      </div>
    );
  }

  const activePills = blue ? BLUE_PILLS : PILLS;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">

      {/* Pills */}
      {activePills.map(({ id, left, top, rotate, w, h, c1, c2, anim, dur }) => (
        <Particle key={id} mouseRef={mouseRef} style={{ left, top }}
          animateProps={{ ...anim }} duration={dur}>
          <div style={{ rotate, display:'inline-block' }}>
            <PillSVG w={w} h={h} c1={c1} c2={c2} id={id} />
          </div>
        </Particle>
      ))}

      {/* Bacteria */}
      {BACTERIA.map(({ id, type, left, top, rotate, color, size, anim, dur, delay }, i) => {
        const c = purple ? PURPLE_PALETTE[i % PURPLE_PALETTE.length]
                : blue   ? BLUE_PALETTE[i % BLUE_PALETTE.length]
                : color;
        return (
          <Particle key={id} mouseRef={mouseRef} style={{ left, top }}
            animateProps={anim} duration={dur} delay={delay}>
            <div style={{ rotate, display:'inline-block' }}>
              {type === 'cocci'  && <BacteriaCocci  id={id} size={size} color={c} />}
              {type === 'corona' && <BacteriaCorona  id={id} size={size} color={c} />}
              {type === 'rod'    && <BacteriaRod     id={id} size={size} color={c} />}
              {type === 'vibrio' && <BacteriaVibrio  id={id} size={size} color={c} />}
              {type === 'strep'  && <BacteriaStrep   id={id} size={size} color={c} />}
            </div>
          </Particle>
        );
      })}
    </div>
  );
}
