import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, AlertTriangle, AlertCircle, Info,
  ChevronDown, FlaskConical, X,
} from 'lucide-react';

/* ── Interaction Data ─────────────────────────────────────── */
const ANTIBIOTICS = [
  'Amoxicillin', 'Azithromycin', 'Bactrim (Co-trimoxazole)', 'Cephalexin',
  'Ciprofloxacin', 'Clarithromycin', 'Doxycycline', 'Erythromycin',
  'Fluconazole', 'Gentamicin', 'Imipenem', 'Levofloxacin',
  'Linezolid', 'Metronidazole', 'Rifampin', 'Vancomycin',
];

const CO_DRUGS = [
  'Alcohol', 'Amiodarone', 'Antacids', 'Citalopram',
  'Combined birth control pills', 'Diclofenac', 'Digoxin', 'Fluoxetine',
  'Furosemide', 'Haloperidol', 'Ibuprofen', 'Lisinopril',
  'Losartan', 'Metformin', 'Milk / Calcium supplements', 'Omeprazole',
  'Paracetamol', 'Pseudoephedrine', 'Sertraline', 'Tramadol',
  'Valproic acid', 'Venlafaxine', 'Vitamin C', 'Warfarin',
  'Yogurt / Dairy',
];

const INTERACTIONS_DATA = [
  // Warfarin group — MAJOR
  { antibiotic: 'Metronidazole',            codrug: 'Warfarin',                    severity: 'MAJOR',    effect: 'Increased bleeding risk (↑ INR)',                             action: 'Frequent INR monitoring required; consider Warfarin dose reduction.' },
  { antibiotic: 'Clarithromycin',           codrug: 'Warfarin',                    severity: 'MAJOR',    effect: 'Increased bleeding risk (↑ INR)',                             action: 'Frequent INR monitoring required; consider Warfarin dose reduction.' },
  { antibiotic: 'Erythromycin',             codrug: 'Warfarin',                    severity: 'MAJOR',    effect: 'Increased bleeding risk (↑ INR)',                             action: 'Frequent INR monitoring required; consider Warfarin dose reduction.' },
  { antibiotic: 'Ciprofloxacin',            codrug: 'Warfarin',                    severity: 'MAJOR',    effect: 'Increased bleeding risk (↑ INR)',                             action: 'Frequent INR monitoring required; consider Warfarin dose reduction.' },
  { antibiotic: 'Bactrim (Co-trimoxazole)', codrug: 'Warfarin',                    severity: 'MAJOR',    effect: 'Increased bleeding risk (↑ INR)',                             action: 'Frequent INR monitoring required; consider Warfarin dose reduction.' },
  // QT prolongation group — MAJOR
  { antibiotic: 'Azithromycin',             codrug: 'Amiodarone',                  severity: 'MAJOR',    effect: 'Dangerous irregular heartbeat (Torsades de Pointes)',         action: 'Avoid this combination. If unavoidable, continuous ECG monitoring required.' },
  { antibiotic: 'Clarithromycin',           codrug: 'Amiodarone',                  severity: 'MAJOR',    effect: 'Dangerous irregular heartbeat (Torsades de Pointes)',         action: 'Avoid this combination. If unavoidable, continuous ECG monitoring required.' },
  { antibiotic: 'Levofloxacin',             codrug: 'Haloperidol',                 severity: 'MAJOR',    effect: 'Dangerous irregular heartbeat (Torsades de Pointes)',         action: 'Avoid this combination. ECG monitoring required if used together.' },
  { antibiotic: 'Ciprofloxacin',            codrug: 'Citalopram',                  severity: 'MAJOR',    effect: 'Dangerous irregular heartbeat (Torsades de Pointes)',         action: 'Avoid this combination. ECG monitoring required if used together.' },
  // Serotonin syndrome — MAJOR
  { antibiotic: 'Linezolid',               codrug: 'Fluoxetine',                  severity: 'MAJOR',    effect: 'Serotonin syndrome: agitation, high fever, rapid heart rate', action: 'Avoid combination. Discontinue antidepressant before starting Linezolid if possible.' },
  { antibiotic: 'Linezolid',               codrug: 'Sertraline',                  severity: 'MAJOR',    effect: 'Serotonin syndrome: agitation, high fever, rapid heart rate', action: 'Avoid combination. Discontinue antidepressant before starting Linezolid if possible.' },
  { antibiotic: 'Linezolid',               codrug: 'Tramadol',                    severity: 'MAJOR',    effect: 'Serotonin syndrome: agitation, high fever, rapid heart rate', action: 'Avoid this combination.' },
  { antibiotic: 'Linezolid',               codrug: 'Venlafaxine',                 severity: 'MAJOR',    effect: 'Serotonin syndrome: agitation, high fever, rapid heart rate', action: 'Avoid combination. Discontinue antidepressant before starting Linezolid.' },
  // Disulfiram reaction — MAJOR
  { antibiotic: 'Metronidazole',            codrug: 'Alcohol',                     severity: 'MAJOR',    effect: 'Severe nausea, vomiting, flushing, rapid heartbeat (disulfiram reaction)', action: 'No alcohol during treatment and for 48–72 hours after completing the course.' },
  // Nephrotoxicity — MAJOR
  { antibiotic: 'Vancomycin',              codrug: 'Ibuprofen',                   severity: 'MAJOR',    effect: 'Kidney damage (nephrotoxicity)',                              action: 'Avoid combination if possible. Monitor serum creatinine closely.' },
  { antibiotic: 'Vancomycin',              codrug: 'Diclofenac',                  severity: 'MAJOR',    effect: 'Kidney damage (nephrotoxicity)',                              action: 'Avoid combination if possible. Monitor serum creatinine closely.' },
  { antibiotic: 'Gentamicin',              codrug: 'Furosemide',                  severity: 'MAJOR',    effect: 'Kidney and hearing damage (nephrotoxicity + ototoxicity)',    action: 'Avoid combination. Monitor renal function and hearing if co-administered.' },
  { antibiotic: 'Gentamicin',              codrug: 'Ibuprofen',                   severity: 'MAJOR',    effect: 'Kidney damage (nephrotoxicity)',                              action: 'Avoid combination if possible. Monitor creatinine.' },
  // Contraceptive failure — MAJOR
  { antibiotic: 'Rifampin',                codrug: 'Combined birth control pills', severity: 'MAJOR',    effect: 'Reduced contraceptive effectiveness — risk of unintended pregnancy', action: 'Use additional backup contraception during and for 1 month after Rifampin course.' },
  // Digoxin toxicity — MAJOR / MODERATE
  { antibiotic: 'Clarithromycin',           codrug: 'Digoxin',                     severity: 'MAJOR',    effect: 'Digoxin toxicity — nausea, visual disturbances, arrhythmias',action: 'Monitor digoxin blood levels. Consider dose reduction.' },
  { antibiotic: 'Erythromycin',             codrug: 'Digoxin',                     severity: 'MAJOR',    effect: 'Digoxin toxicity — nausea, visual disturbances, arrhythmias',action: 'Monitor digoxin blood levels. Consider dose reduction.' },
  { antibiotic: 'Doxycycline',              codrug: 'Digoxin',                     severity: 'MODERATE', effect: 'Potential increase in digoxin levels',                        action: 'Monitor digoxin levels during co-administration.' },
  // Seizure risk — MAJOR
  { antibiotic: 'Imipenem',                codrug: 'Valproic acid',               severity: 'MAJOR',    effect: 'Seizure risk — Imipenem dramatically reduces Valproic acid levels', action: 'Avoid completely. Switch to an alternative antibiotic or anticonvulsant.' },
  // Absorption reduction — MODERATE
  { antibiotic: 'Doxycycline',              codrug: 'Milk / Calcium supplements',  severity: 'MODERATE', effect: 'Reduced antibiotic absorption (chelation with calcium)',       action: 'Take Doxycycline at least 2 hours before or after dairy/calcium.' },
  { antibiotic: 'Doxycycline',              codrug: 'Antacids',                    severity: 'MODERATE', effect: 'Reduced antibiotic absorption',                               action: 'Separate doses by at least 2 hours.' },
  { antibiotic: 'Ciprofloxacin',            codrug: 'Milk / Calcium supplements',  severity: 'MODERATE', effect: 'Reduced antibiotic absorption (chelation)',                   action: 'Separate Ciprofloxacin from dairy/calcium by 2+ hours.' },
  { antibiotic: 'Ciprofloxacin',            codrug: 'Yogurt / Dairy',              severity: 'MODERATE', effect: 'Reduced antibiotic absorption (chelation)',                   action: 'Separate Ciprofloxacin from dairy by 2+ hours.' },
  { antibiotic: 'Azithromycin',             codrug: 'Antacids',                    severity: 'MODERATE', effect: 'Reduced Azithromycin absorption',                             action: 'Separate administration by at least 2 hours.' },
  // Hyperkalemia — MODERATE
  { antibiotic: 'Bactrim (Co-trimoxazole)', codrug: 'Lisinopril',                  severity: 'MODERATE', effect: 'High potassium levels (hyperkalemia) — risk of arrhythmia',  action: 'Monitor serum potassium closely during combination therapy.' },
  { antibiotic: 'Bactrim (Co-trimoxazole)', codrug: 'Losartan',                    severity: 'MODERATE', effect: 'High potassium levels (hyperkalemia)',                        action: 'Monitor serum potassium closely during combination therapy.' },
  // BP elevation — MODERATE
  { antibiotic: 'Linezolid',               codrug: 'Pseudoephedrine',             severity: 'MODERATE', effect: 'Elevated blood pressure — hypertensive crisis risk',          action: 'Avoid OTC cold medicines containing pseudoephedrine or phenylephrine.' },
  // Hypoglycemia — MODERATE
  { antibiotic: 'Fluconazole',             codrug: 'Metformin',                   severity: 'MODERATE', effect: 'Risk of hypoglycemia (low blood sugar)',                      action: 'Monitor blood glucose more frequently during combination treatment.' },
  // Minor / Safe combinations
  { antibiotic: 'Amoxicillin',             codrug: 'Paracetamol',                 severity: 'MINOR',    effect: 'No significant interaction',                                  action: 'Safe to use together at standard doses.' },
  { antibiotic: 'Amoxicillin',             codrug: 'Vitamin C',                   severity: 'MINOR',    effect: 'No significant interaction',                                  action: 'Safe to use together.' },
  { antibiotic: 'Azithromycin',             codrug: 'Ibuprofen',                   severity: 'MINOR',    effect: 'No significant interaction at standard doses',                action: 'Safe to use together at standard doses.' },
  { antibiotic: 'Doxycycline',              codrug: 'Paracetamol',                 severity: 'MINOR',    effect: 'No significant interaction',                                  action: 'Safe to use together.' },
  { antibiotic: 'Cephalexin',              codrug: 'Omeprazole',                  severity: 'MINOR',    effect: 'Mild potential reduction in Cephalexin absorption',            action: 'No dose adjustment needed in most patients.' },
];

/* ── Severity Config ─────────────────────────────────────── */
const SEV = {
  MAJOR:    { dot: '🔴', label: 'MAJOR',    Icon: AlertTriangle, bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.4)',   color: '#EF4444', text: '#FCA5A5', shadow: '0 0 24px rgba(239,68,68,0.3)'    },
  MODERATE: { dot: '🟠', label: 'MODERATE', Icon: AlertCircle,   bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.4)', color: '#F59E0B', text: '#FCD34D', shadow: '0 0 24px rgba(245,158,11,0.3)'   },
  MINOR:    { dot: '🟢', label: 'MINOR',    Icon: Info,          bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.4)', color: '#10B981', text: '#34D399', shadow: '0 0 24px rgba(16,185,129,0.3)'   },
};

/* ── Searchable Select ───────────────────────────────────── */
function SearchableSelect({ options, value, onChange, placeholder }) {
  const [search, setSearch] = useState('');
  const [open, setOpen]     = useState(false);
  const ref                  = useRef(null);

  const filtered = options.filter(o =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = opt => { onChange(opt); setSearch(''); setOpen(false); };
  const handleFocus  = () => setOpen(true);
  const handleChange = e => { setSearch(e.target.value); setOpen(true); };

  return (
    <div ref={ref} className="relative">
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-xl cursor-text"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: `1px solid ${open ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.12)'}`,
          transition: 'border-color 0.2s',
        }}
        onClick={handleFocus}
      >
        <Search size={14} className="text-slate-500 shrink-0" />
        <input
          value={open ? search : ''}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={value || placeholder}
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-400"
        />
        {value && !open && (
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={e => { e.stopPropagation(); onChange(''); setSearch(''); }}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X size={13} />
          </button>
        )}
        <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ transformOrigin: 'top', background: '#0d0d28', border: '1px solid rgba(139,92,246,0.25)', maxHeight: 220, overflowY: 'auto', zIndex: 30 }}
            className="absolute top-full left-0 right-0 mt-1 rounded-xl portal-scroll"
          >
            {filtered.length === 0 ? (
              <p className="text-slate-500 text-xs px-4 py-3">No matches found</p>
            ) : filtered.map(opt => (
              <button
                key={opt}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors duration-150"
                style={{ background: opt === value ? 'rgba(139,92,246,0.12)' : '' }}
                onMouseDown={e => e.preventDefault()}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function InteractionsChecker() {
  const [antibiotic, setAntibiotic] = useState('');
  const [codrug, setCodrug]         = useState('');

  const result = antibiotic && codrug
    ? INTERACTIONS_DATA.find(i => i.antibiotic === antibiotic && i.codrug === codrug)
    : null;

  const noResult = antibiotic && codrug && !result;
  const sev = result ? SEV[result.severity] : null;

  const reset = () => { setAntibiotic(''); setCodrug(''); };

  return (
    <section id="interactions-checker" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label mb-4 mx-auto">Drug Safety</div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Antibiotic Interactions Checker
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Select an antibiotic and a co-administered drug or substance to instantly check for clinically significant interactions.
          </p>
        </motion.div>

        {/* Tool */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-2xl p-6 sm:p-8"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
        >
          {/* Dropdowns row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-slate-300 text-sm font-semibold mb-2 block flex items-center gap-1.5">
                <FlaskConical size={14} style={{ color: '#A78BFA' }} />
                Antibiotic
              </label>
              <SearchableSelect
                options={ANTIBIOTICS}
                value={antibiotic}
                onChange={v => { setAntibiotic(v); }}
                placeholder="Search antibiotic…"
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-semibold mb-2 block flex items-center gap-1.5">
                <FlaskConical size={14} style={{ color: '#60A5FA' }} />
                Co-administered Drug / Substance
              </label>
              <SearchableSelect
                options={CO_DRUGS}
                value={codrug}
                onChange={v => { setCodrug(v); }}
                placeholder="Search co-drug or substance…"
              />
            </div>
          </div>

          {/* Result panel */}
          <AnimatePresence mode="wait">
            {!antibiotic && !codrug && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-12 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
              >
                <FlaskConical size={36} className="text-slate-600 mb-3" />
                <p className="text-slate-500 text-sm">Select both fields above to check an interaction</p>
              </motion.div>
            )}

            {(antibiotic && !codrug) && (
              <motion.div
                key="partial"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-10 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
              >
                <p className="text-slate-500 text-sm">Now select a co-administered drug or substance</p>
              </motion.div>
            )}

            {noResult && (
              <motion.div
                key="none"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-5 rounded-xl"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}
              >
                <Info size={18} style={{ color: '#10B981' }} className="shrink-0" />
                <div>
                  <p className="text-emerald-300 font-semibold text-sm">No known significant interaction found</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    This combination is not flagged in our database. Always verify with a pharmacist or current drug references.
                  </p>
                </div>
              </motion.div>
            )}

            {result && sev && (
              <motion.div
                key={`${antibiotic}-${codrug}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl p-6"
                style={{ background: sev.bg, border: `1px solid ${sev.border}`, boxShadow: sev.shadow }}
              >
                {/* Severity badge */}
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <sev.Icon size={22} style={{ color: sev.color }} strokeWidth={2} />
                    <div>
                      <span
                        className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                        style={{ background: sev.bg, border: `1px solid ${sev.border}`, color: sev.color }}
                      >
                        {sev.dot} {sev.label}
                      </span>
                      <p className="text-slate-300 text-sm font-medium mt-1.5">
                        {antibiotic} + {codrug}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={reset}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <X size={12} /> Reset
                  </button>
                </div>

                {/* Divider */}
                <div className="h-px mb-5" style={{ background: `${sev.border}` }} />

                {/* Effect */}
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: sev.color }}>Clinical Effect</p>
                  <p style={{ color: sev.text }} className="text-base font-semibold">{result.effect}</p>
                </div>

                {/* Action */}
                <div className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid rgba(255,255,255,0.06)` }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Recommended Action</p>
                  <p className="text-slate-200 text-sm leading-relaxed">{result.action}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-slate-600 text-xs text-center mt-6">
          For educational purposes only. Always consult a licensed pharmacist or healthcare professional before making any clinical decision.
        </p>
      </div>
    </section>
  );
}
