/**
 * BackgroundGrid — perspective dot-grid canvas matching the reference image.
 * Mouse moves across the section → dots near the cursor pulse and glow.
 * Listens to mouse events on containerRef (parent section), not the canvas itself.
 */
import { useEffect, useRef } from 'react';

const ROWS = 22;
const COLS = 30;

function buildGrid(W, H) {
  const pts = [];
  const HORIZON_Y = H * 0.46;   // where the vanishing point sits
  const BOTTOM_Y  = H * 1.06;   // slightly past the bottom edge

  for (let r = 0; r < ROWS; r++) {
    const t    = r / (ROWS - 1);               // 0 = horizon, 1 = near bottom
    const ease = Math.pow(t, 0.60);            // nonlinear depth compression

    const y = HORIZON_Y + (BOTTOM_Y - HORIZON_Y) * t;

    for (let c = 0; c < COLS; c++) {
      const cFrac  = c / (COLS - 1);           // 0 → 1 across the row
      const spread = W * (0.06 + 0.88 * ease); // widens toward viewer
      const x      = W / 2 + (cFrac - 0.5) * spread;

      pts.push({
        x,
        y,
        baseAlpha: 0.09 + 0.52 * ease,
        baseR:     0.5  + 1.9 * ease,
      });
    }
  }
  return pts;
}

export default function BackgroundGrid({ containerRef }) {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [containerRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0, pts = [];
    let rafId;

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
      pts = buildGrid(W, H);
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw() {
      rafId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      const { x: mx, y: my } = mouseRef.current;
      const RIPPLE = 210;

      /* ── Dots ── */
      for (const p of pts) {
        const dx   = p.x - mx;
        const dy   = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const prox = Math.max(0, 1 - dist / RIPPLE);
        const boost = Math.pow(prox, 1.7);

        const alpha  = Math.min(p.baseAlpha + boost * 0.88, 1);
        const radius = p.baseR + boost * 5;

        /* Glow halo around close dots */
        if (boost > 0.04) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 6);
          g.addColorStop(0, `rgba(139,92,246,${boost * 0.42})`);
          g.addColorStop(1, 'rgba(139,92,246,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 6, 0, Math.PI * 2);
          ctx.fill();
        }

        /* Dot itself */
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${alpha})`;
        ctx.fill();
      }

      /* ── Ambient centre glow (static, from image reference) ── */
      const cg = ctx.createRadialGradient(W * 0.5, H * 0.44, 0, W * 0.5, H * 0.44, W * 0.55);
      cg.addColorStop(0, 'rgba(88,40,200,0.18)');
      cg.addColorStop(0.5, 'rgba(60,20,150,0.08)');
      cg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, W, H);
    }

    draw();
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
