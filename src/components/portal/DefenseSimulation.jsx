import { useEffect, useRef, useState, useCallback } from 'react';
import { Activity, Radio, Scan, Eye, EyeOff } from 'lucide-react';

/* ─── Mesh grid canvas ─────────────────────────────────────────── */
const COLS = 28;
const ROWS = 18;
const SPRING = 0.08;
const DAMPING = 0.72;
const BASE_ALPHA = 0.22;

function initGrid(W, H) {
  const pts = [];
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c <= COLS; c++) {
      pts.push({
        ox: (c / COLS) * W,
        oy: (r / ROWS) * H,
        x:  (c / COLS) * W,
        y:  (r / ROWS) * H,
        vx: 0,
        vy: 0,
      });
    }
  }
  return pts;
}

function useCanvas(sensRef) {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const ptsRef    = useRef([]);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
      ptsRef.current = initGrid(W, H);
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw() {
      rafRef.current = requestAnimationFrame(draw);
      const pts = ptsRef.current;
      const { x: mx, y: my } = mouseRef.current;
      const sens = sensRef.current / 50; // 1-100 → 0.02-2

      // Update spring physics
      for (const p of pts) {
        const dx = mx - p.ox;
        const dy = my - p.oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 120 * sens;
        if (dist < radius) {
          const force = (1 - dist / radius) * sens * 18;
          const tx = p.ox - dx * force * 0.04;
          const ty = p.oy - dy * force * 0.04;
          p.vx = (p.vx + (tx - p.x) * SPRING) * DAMPING;
          p.vy = (p.vy + (ty - p.y) * SPRING) * DAMPING;
        } else {
          p.vx = (p.vx + (p.ox - p.x) * SPRING) * DAMPING;
          p.vy = (p.vy + (p.oy - p.y) * SPRING) * DAMPING;
        }
        p.x += p.vx;
        p.y += p.vy;
      }

      ctx.clearRect(0, 0, W, H);

      // Draw horizontal lines
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        for (let c = 0; c <= COLS; c++) {
          const p = pts[r * (COLS + 1) + c];
          c === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(120,60,220,${BASE_ALPHA})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // Draw vertical lines
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        for (let r = 0; r <= ROWS; r++) {
          const p = pts[r * (COLS + 1) + c];
          r === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(120,60,220,${BASE_ALPHA})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // Glow dots at vertices near mouse
      for (const p of pts) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const a = (1 - dist / 160) * 0.9;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168,85,247,${a})`;
          ctx.fill();
        }
      }
    }

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [sensRef]);

  return { canvasRef, mouseRef };
}

/* ─── Scan overlay components ──────────────────────────────────── */
function RadarSweep() {
  return (
    <g className="ds-radar" style={{ transformOrigin: '260px 230px' }}>
      <defs>
        <radialGradient id="radar-grad" cx="0%" cy="50%" r="100%">
          <stop offset="0%" stopColor="rgba(168,85,247,0)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0.55)" />
        </radialGradient>
      </defs>
      <path
        d="M260,230 L260,90 A140,140 0 0,1 383,172 Z"
        fill="url(#radar-grad)"
      />
      <line x1="260" y1="230" x2="260" y2="90"
        stroke="rgba(168,85,247,0.9)" strokeWidth="1.5" />
    </g>
  );
}

function PulseRings() {
  return (
    <>
      {[0, 0.8, 1.6].map((delay, i) => (
        <circle key={i} cx="260" cy="230" r="70"
          fill="none" stroke="rgba(168,85,247,0.7)" strokeWidth="1.5"
          style={{
            animation: `ds-pulse-ring 2.4s ease-out ${delay}s infinite`,
            transformOrigin: '260px 230px',
            transformBox: 'view-box',
          }}
        />
      ))}
    </>
  );
}

function DiagnosticLine({ shieldClipId }) {
  return (
    <g clipPath={`url(#${shieldClipId})`}>
      <rect
        x="120" y="0" width="280" height="6"
        fill="url(#diag-grad)"
        style={{
          animation: 'ds-diagnostic 2.8s ease-in-out infinite',
          transformOrigin: '260px 0px',
          transformBox: 'view-box',
        }}
      />
      <defs>
        <linearGradient id="diag-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(168,85,247,0)" />
          <stop offset="50%" stopColor="rgba(168,85,247,0.85)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0)" />
        </linearGradient>
      </defs>
    </g>
  );
}

/* ─── Shield SVG ───────────────────────────────────────────────── */
const SHIELD_PATH = 'M260,72 L400,130 L400,242 Q400,355 260,418 Q120,355 120,242 L120,130 Z';

function ShieldSVG({ scanType }) {
  const clipId = 'ds-shield-clip';
  return (
    <svg
      viewBox="0 0 520 460"
      className="w-full h-full"
      overflow="visible"
      aria-hidden="true"
    >
      <defs>
        {/* Shared purple gradient */}
        <linearGradient id="ds-shgrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#6D28D9" />
          <stop offset="50%"  stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>

        {/* Inner highlight */}
        <linearGradient id="ds-hi" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%"   stopColor="rgba(196,181,253,0.25)" />
          <stop offset="100%" stopColor="rgba(109,40,217,0)" />
        </linearGradient>

        {/* Mesh pattern inside shield */}
        <pattern id="ds-mesh" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M18 0 L0 0 0 18" fill="none" stroke="rgba(139,92,246,0.18)" strokeWidth="0.6"/>
        </pattern>

        {/* Clip path for shield shape */}
        <clipPath id={clipId}>
          <path d={SHIELD_PATH} />
        </clipPath>
      </defs>

      {/* ── Ambient glow rings behind shield ── */}
      {[160, 190, 220].map((r, i) => (
        <circle key={i} cx="260" cy="245" r={r}
          fill="none" stroke="rgba(109,40,217,0.08)" strokeWidth="1" />
      ))}

      {/* ── Shield body ── */}
      <g className="ds-shield">
        {/* Base fill */}
        <path d={SHIELD_PATH} fill="url(#ds-shgrad)" />

        {/* Mesh fill */}
        <path d={SHIELD_PATH} fill="url(#ds-mesh)" />

        {/* Highlight overlay */}
        <path d={SHIELD_PATH} fill="url(#ds-hi)" />

        {/* Border */}
        <path d={SHIELD_PATH} fill="none"
          stroke="rgba(167,139,250,0.8)" strokeWidth="2.5" />

        {/* Inner border */}
        <path d={SHIELD_PATH} fill="none"
          stroke="rgba(196,181,253,0.3)" strokeWidth="1"
          transform="translate(5,5) scale(0.96,0.96)" />

        {/* Top ridge highlight */}
        <path d="M260,72 L400,130" stroke="rgba(216,180,254,0.5)" strokeWidth="2" />
        <path d="M260,72 L120,130" stroke="rgba(216,180,254,0.3)" strokeWidth="1.5" />

        {/* Mesh inside */}
        <rect x="120" y="72" width="280" height="346"
          fill="url(#ds-mesh)" clipPath={`url(#${clipId})`} />
      </g>

      {/* ── Scan overlay ── */}
      {scanType === 'radar'      && <RadarSweep />}
      {scanType === 'pulse'      && <PulseRings />}
      {scanType === 'diagnostic' && <DiagnosticLine shieldClipId={clipId} />}

      {/* ── Virus inside shield ── */}
      <g clipPath={`url(#${clipId})`}>
        {/* Virus body */}
        <circle cx="260" cy="230" r="36" fill="rgba(220,38,38,0.15)"
          stroke="rgba(248,113,113,0.5)" strokeWidth="1.5" />

        {/* Spikes */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = 260 + Math.cos(a) * 36;
          const y1 = 230 + Math.sin(a) * 36;
          const x2 = 260 + Math.cos(a) * 52;
          const y2 = 230 + Math.sin(a) * 52;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(248,113,113,0.55)" strokeWidth="1.4" strokeLinecap="round" />;
        })}

        {/* No-entry circle */}
        <circle cx="260" cy="230" r="22" fill="none"
          stroke="rgba(248,113,113,0.8)" strokeWidth="2.5" />
        <line x1="244" y1="214" x2="276" y2="246"
          stroke="rgba(248,113,113,0.8)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ─── Environmental elements (pills + bacteria) ─────────────────── */
function Pill({ x, y, rot, floatClass, color1 = '#7C3AED', color2 = '#A78BFA' }) {
  return (
    <div className={`absolute ${floatClass}`} style={{ left: x, top: y, transform: `rotate(${rot}deg)` }}>
      <svg width="52" height="22" viewBox="0 0 52 22">
        <rect x="0" y="0" width="52" height="22" rx="11"
          fill="none" stroke={color2} strokeWidth="1" />
        <rect x="0" y="0" width="26" height="22" rx="11"
          fill={color1} fillOpacity="0.35" />
        <rect x="26" y="0" width="26" height="22" rx="11"
          fill={color2} fillOpacity="0.25" />
        <line x1="26" y1="2" x2="26" y2="20"
          stroke={color2} strokeWidth="0.8" strokeOpacity="0.5" />
      </svg>
    </div>
  );
}

function Bacterium({ x, y, floatClass, flip = false }) {
  const sx = flip ? -1 : 1;
  return (
    <div className={`absolute ${floatClass}`} style={{ left: x, top: y }}>
      <svg width="70" height="28" viewBox="0 0 70 28" style={{ transform: `scaleX(${sx})` }}>
        {/* Body */}
        <ellipse cx="35" cy="14" rx="32" ry="10"
          fill="rgba(52,211,153,0.15)" stroke="rgba(52,211,153,0.5)" strokeWidth="1" />
        {/* Flagellum */}
        <path d="M67,14 Q75,6 80,14 Q85,22 90,14"
          fill="none" stroke="rgba(52,211,153,0.4)" strokeWidth="1" strokeLinecap="round" />
        {/* Cilia */}
        {[12, 24, 36, 48].map(cx => (
          <g key={cx}>
            <line x1={cx} y1="4"  x2={cx - 3} y2="-2"
              stroke="rgba(52,211,153,0.35)" strokeWidth="0.8" />
            <line x1={cx} y1="24" x2={cx + 3} y2="30"
              stroke="rgba(52,211,153,0.35)" strokeWidth="0.8" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─── Control Panel ─────────────────────────────────────────────── */
const SCAN_OPTIONS = [
  { value: 'radar',      label: 'Constant Scan',       icon: Radio },
  { value: 'pulse',      label: 'Threat Detect Pulse',  icon: Activity },
  { value: 'diagnostic', label: 'Diagnostic',           icon: Scan },
];

function ControlPanel({ scanType, setScanType, sensitivity, setSensitivity, pathogensVisible, setPathogensVisible }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 px-6 py-5
      bg-white/3 border-t border-purple-900/40 backdrop-blur-md">

      {/* Scan type */}
      <div className="flex flex-col gap-1.5 min-w-[200px]">
        <span className="text-xs text-purple-400 uppercase tracking-widest font-semibold">Scan Type</span>
        <select
          value={scanType}
          onChange={e => setScanType(e.target.value)}
          className="bg-black/40 border border-purple-700/40 text-slate-200 text-sm rounded-lg px-3 py-2
            focus:outline-none focus:border-purple-500 cursor-pointer"
        >
          {SCAN_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Sensitivity slider */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
        <span className="text-xs text-purple-400 uppercase tracking-widest font-semibold">
          Grid Ripple Sensitivity — <span className="text-purple-200">{sensitivity}</span>
        </span>
        <input
          type="range" min="1" max="100" value={sensitivity}
          onChange={e => setSensitivity(Number(e.target.value))}
          className="w-full accent-violet-500 cursor-pointer"
        />
      </div>

      {/* Pathogens toggle */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-purple-400 uppercase tracking-widest font-semibold">Pathogens</span>
        <button
          onClick={() => setPathogensVisible(v => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
            ${pathogensVisible
              ? 'bg-violet-600/20 border-violet-500/60 text-violet-300'
              : 'bg-white/4 border-white/10 text-slate-500'}`}
        >
          {pathogensVisible ? <Eye size={14} /> : <EyeOff size={14} />}
          {pathogensVisible ? 'Visible' : 'Hidden'}
        </button>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function DefenseSimulation() {
  const [scanType, setScanType]                   = useState('radar');
  const [sensitivity, setSensitivity]             = useState(40);
  const [pathogensVisible, setPathogensVisible]   = useState(true);

  const sensRef = useRef(sensitivity);
  useEffect(() => { sensRef.current = sensitivity; }, [sensitivity]);

  const { canvasRef, mouseRef } = useCanvas(sensRef);

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, [canvasRef, mouseRef]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, [mouseRef]);

  return (
    <div className="flex flex-col" style={{ background: '#040414', minHeight: '100vh' }}>
      {/* Header label */}
      <div className="px-6 pt-10 pb-4 text-center">
        <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Interactive Defense System
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-white neon-text mb-2">
          Antimicrobial Shield Simulation
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Move your cursor across the grid to interact with the mesh. Adjust scan mode and sensitivity below.
        </p>
      </div>

      {/* ── Scene ── */}
      <div className="relative flex-1 overflow-hidden" style={{ minHeight: 520 }}>
        {/* Canvas mesh background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }} />
        </div>

        {/* Environmental pathogens */}
        {pathogensVisible && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Pills */}
            <Pill x="5%"  y="12%" rot={-35}  floatClass="ds-float-a" />
            <Pill x="82%" y="8%"  rot={20}   floatClass="ds-float-b" color1="#4C1D95" color2="#C4B5FD" />
            <Pill x="88%" y="62%" rot={50}   floatClass="ds-float-c" />
            <Pill x="3%"  y="68%" rot={-15}  floatClass="ds-float-d" color1="#5B21B6" color2="#DDD6FE" />
            <Pill x="42%" y="5%"  rot={70}   floatClass="ds-float-e" color1="#6D28D9" color2="#A78BFA" />

            {/* Bacteria */}
            <Bacterium x="2%"  y="40%" floatClass="ds-float-bact-a" />
            <Bacterium x="74%" y="78%" floatClass="ds-float-bact-b" flip />
          </div>
        )}

        {/* Central shield — sits above canvas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full max-w-sm sm:max-w-md aspect-square">
            <ShieldSVG scanType={scanType} />
          </div>
        </div>

        {/* Scan type badge */}
        <div className="absolute top-4 right-4 pointer-events-none">
          {(() => {
            const opt = SCAN_OPTIONS.find(o => o.value === scanType);
            const Icon = opt?.icon;
            return (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-purple-900/40 border border-purple-700/50 backdrop-blur-md">
                {Icon && <Icon size={12} className="text-purple-300" />}
                <span className="text-purple-200 text-xs font-medium">{opt?.label}</span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Controls ── */}
      <ControlPanel
        scanType={scanType}         setScanType={setScanType}
        sensitivity={sensitivity}   setSensitivity={setSensitivity}
        pathogensVisible={pathogensVisible} setPathogensVisible={setPathogensVisible}
      />
    </div>
  );
}
