import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, AlertTriangle, ShieldAlert, Pill, ListChecks, ChevronDown } from 'lucide-react';

const INFECTIONS = {
  'uncomplicated-uti': {
    label: 'Uncomplicated UTI', severe: false,
    empirical: {
      mild:     ['Nitrofurantoin 100 mg MR BD × 5 days', 'Trimethoprim 200 mg BD × 3 days', 'Fosfomycin 3 g single dose'],
      moderate: ['Same as mild, check local antibiogram for TMP resistance', 'Pivmecillinam 400 mg TDS × 3–5 days (if available)'],
      severe:   ['Consider IV if unable to tolerate oral, escalate to Complicated UTI pathway'],
    },
    stewardship: [
      'Send MSU for culture and sensitivity before starting antibiotics',
      'Avoid fluoroquinolones, reserve for complicated cases only',
      'Short-course therapy preferred (3–5 days),longer courses unnecessary',
      'De-escalate or stop based on culture/sensitivity results',
      'No imaging or further investigation needed for uncomplicated presentations',
    ],
    warnings: ['Avoid nitrofurantoin if CrCl <45 mL/min (ineffective urinary levels)', 'Avoid trimethoprim in first trimester of pregnancy'],
  },
  'pyelonephritis': {
    label: 'Complicated UTI / Pyelonephritis', severe: false,
    empirical: {
      mild:     ['Ciprofloxacin 500 mg BD PO × 7 days (if local sensitivity >80%)', 'Co-amoxiclav 625 mg TDS PO × 7 days'],
      moderate: ['IV Ceftriaxone 1–2 g OD → switch to PO when stable and improving', 'IV Co-amoxiclav 1.2 g TDS'],
      severe:   ['IV Piperacillin-Tazobactam 4.5 g Q6h ± Gentamicin single daily dose', 'Blood cultures + urological review for obstruction'],
    },
    stewardship: [
      'Blood cultures + MSU before antibiotics',
      'Renal ultrasound to exclude obstruction in complicated cases',
      'IV-to-PO switch when haemodynamically stable and tolerating oral intake',
      'Duration: 7 days (mild–moderate), 10–14 days (severe)',
      'Review de-escalation at 48–72 h with culture results',
    ],
    warnings: [
      'Consider ESBL-producing organism if recent hospitalisation, travel to high-prevalence region, or prior ESBL',
      'Empirical carbapenem for confirmed/suspected ESBL if systemically unwell',
      'Dose-adjust aminoglycosides for renal function; single daily dosing preferred',
    ],
  },
  'cap': {
    label: 'Community-Acquired Pneumonia', severe: false,
    empirical: {
      mild:     ['Amoxicillin 1 g TDS PO (5–7 days)', 'Doxycycline 100 mg BD PO (atypical coverage, 5 days)'],
      moderate: ['Amoxicillin-clavulanate PO + Azithromycin 500 mg OD', 'IV Ceftriaxone 1–2 g OD + Azithromycin (if hospitalised)'],
      severe:   ['IV Beta-lactam + IV Macrolide (ICU)', 'OR Respiratory Fluoroquinolone monotherapy (levofloxacin/moxifloxacin) if no ICU'],
    },
    stewardship: [
      'Calculate CURB-65 / PSI score to guide inpatient vs outpatient decision',
      'Sputum + blood cultures (2 sets) before antibiotics in all hospitalised patients',
      'Urine pneumococcal and legionella antigen in moderate-severe disease',
      'Atypical coverage (macrolide/doxycycline) for outpatient treatment',
      'Duration: 5 days for most CAP; review at day 3–5 for de-escalation',
    ],
    warnings: [
      'Add MRSA coverage (vancomycin/linezolid) if: post-influenza, cavitary lesion, known MRSA colonisation',
      'Consider influenza (oseltamivir) in appropriate seasonal context',
      'Avoid dual beta-lactam therapy, no added benefit',
    ],
  },
  'sepsis': {
    label: 'Sepsis / Septic Shock', severe: true,
    empirical: {
      mild:     ['Not applicable, all sepsis is an emergency requiring urgent IV therapy'],
      moderate: ['IV Piperacillin-Tazobactam 4.5 g Q6h + Vancomycin 25–30 mg/kg loading dose (if MRSA risk)'],
      severe:   ['Meropenem 1 g Q8h + Vancomycin (MRSA risk) ± Micafungin/Caspofungin (Candida risk)', 'Consider Anidulafungin if hepatically compromised'],
    },
    stewardship: [
      '🚨 START ANTIBIOTICS WITHIN 1 HOUR of sepsis recognition, do not delay for cultures',
      'Draw 2 sets of blood cultures from separate sites BEFORE first antibiotic dose',
      'Daily clinical reassessment for de-escalation, reassess empirical MRSA/antifungal coverage at 48 h',
      'Use Procalcitonin (PCT) to guide antibiotic duration, target <0.5 µg/L or 80% reduction',
      'Target 7–10 days total; individualise based on clinical response and organism',
    ],
    warnings: [
      '⚠ This is a medical emergency, broad-spectrum empirical antibiotics are appropriate initially',
      'Mandatory de-escalation once culture data available, do not continue carbapenem unnecessarily',
      'Monitor for nephrotoxicity with vancomycin, AUC-guided TDM mandatory',
      'Review antifungal need at 72 h, stop if cultures negative and no clinical indication',
    ],
  },
  'ssti': {
    label: 'Skin & Soft Tissue Infection', severe: false,
    empirical: {
      mild:     ['Flucloxacillin 500 mg QDS PO × 5 days (non-purulent cellulitis)', 'Co-amoxiclav 625 mg TDS × 5 days (if animal bite / polymicrobial)'],
      moderate: ['IV Flucloxacillin 1–2 g QDS OR IV Cefazolin 1 g TDS', 'Doxycycline 100 mg BD + TMP-SMX DS BD (CA-MRSA risk)'],
      severe:   ['IV Vancomycin (MRSA) + IV Piperacillin-Tazobactam (polymicrobial/necrotising fasciitis)', 'Add IV Clindamycin to inhibit toxin production in streptococcal TSS'],
    },
    stewardship: [
      'Mark cellulitis borders with pen and document at presentation to monitor spread',
      'Aspirate or drain purulent collections, culture pus, not surrounding skin',
      'Assess for MRSA risk factors: prior MRSA, nasal carriage, IVDU, close contact with MRSA',
      'Duration: 5 days for mild-moderate, extend only with demonstrated clinical need',
      'Surgical referral if crepitus, rapid progression, systemic sepsis, or bullae present',
    ],
    warnings: [
      '🔴 Necrotising fasciitis requires IMMEDIATE surgical debridement + broad IV antibiotics, do not delay surgery',
      'Group A Strep toxic shock: add IV clindamycin to blunt toxin production even with penicillin',
      'Diabetic foot: cover Gram-negative + anaerobic organisms, consider MRSA if chronic wound',
    ],
  },
  'intra-abdominal': {
    label: 'Intra-abdominal Infection', severe: false,
    empirical: {
      mild:     ['Co-amoxiclav 625 mg TDS PO × 5 days (mild community-acquired, post–source control)'],
      moderate: ['IV Ceftriaxone 2 g OD + IV Metronidazole 500 mg TDS', 'IV Piperacillin-Tazobactam 4.5 g Q8h (monotherapy)'],
      severe:   ['IV Meropenem 1 g Q8h + IV Metronidazole (hospital-acquired / post-operative)', 'Add Fluconazole 400 mg OD if Candida risk (TPN, prior antifungals, perforated peptic ulcer)'],
    },
    stewardship: [
      'Source control is ESSENTIAL and is the primary treatment, antibiotics are adjunctive only',
      'Drain, debride, or operate before or simultaneously with antibiotic initiation',
      'Collect intraoperative samples (peritoneal fluid/tissue) for culture',
      'Duration: 4–7 days after adequate source control, longer courses NOT supported by evidence',
      'Stop antibiotics at 4 days post-source control if clinical improvement confirmed',
    ],
    warnings: [
      'Prolonged antibiotic courses beyond 7 days not recommended unless source control incomplete',
      'If healthcare-associated: cover resistant Gram-negatives (ESBL risk) and Candida',
      'Empirical anti-enterococcal coverage (ampicillin/vancomycin) for immunocompromised or severe disease',
    ],
  },
};

const PATIENT_FACTORS = [
  { id: 'renal',   label: 'Renal Impairment (CrCl <50 mL/min)' },
  { id: 'mrsa',    label: 'MRSA Risk (prior MRSA, colonisation, healthcare-associated)' },
  { id: 'immuno',  label: 'Immunocompromised (transplant, steroids, haematological malignancy)' },
  { id: 'pregnant',label: 'Pregnant or Breastfeeding' },
  { id: 'pen',     label: 'Penicillin Allergy (specify severity)' },
  { id: 'esbl',    label: 'Prior ESBL / MDR organism' },
];

const FACTOR_WARNINGS = {
  renal:    'Dose adjustment required for most antibiotics. Avoid nephrotoxic combinations (vancomycin + aminoglycosides). Avoid nitrofurantoin.',
  mrsa:     'Consider empirical anti-MRSA coverage (vancomycin, daptomycin, linezolid) until cultures available.',
  immuno:   'Broader empirical coverage required. Lower threshold for antifungal coverage. Avoid live vaccines.',
  pregnant: 'Avoid fluoroquinolones, aminoglycosides, tetracyclines, trimethoprim (1st trimester). Nitrofurantoin risk in 3rd trimester.',
  pen:      'For mild allergy (rash only): cephalosporins generally safe (cross-reactivity <2%). For severe (anaphylaxis): use non-beta-lactam alternatives.',
  esbl:     'Prior ESBL: Avoid cephalosporins and fluoroquinolones empirically. Consider meropenem + ID consultation. Send cultures for resistance profiling.',
};

export default function StewardshipTool() {
  const [infection, setInfection] = useState('');
  const [severity, setSeverity]   = useState('moderate');
  const [factors, setFactors]     = useState([]);
  const [showOutput, setShowOutput] = useState(false);

  const data = INFECTIONS[infection];

  const toggleFactor = (id) =>
    setFactors(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  const handleGenerate = () => {
    if (!infection) return;
    setShowOutput(true);
  };

  return (
    <section id="support-tool" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34D399' }}>
            <Stethoscope size={12} />
            Stewardship Support Tool
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
            Empirical Therapy <span style={{ color: '#10B981' }}>Guidance</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Select infection type, severity, and patient factors to generate stewardship-aligned empirical recommendations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Input panel ── */}
          <motion.div className="lg:col-span-2 rounded-2xl p-6 flex flex-col gap-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5 }}>

            {/* Infection Type */}
            <div>
              <label className="text-slate-300 text-sm font-semibold mb-2 block">Infection Type</label>
              <div className="relative">
                <select
                  value={infection}
                  onChange={e => { setInfection(e.target.value); setShowOutput(false); }}
                  className="w-full appearance-none px-4 py-3 pr-10 rounded-xl text-sm text-white cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', outline: 'none' }}>
                  <option value="" disabled style={{ background: '#0d0d1f' }}>Select infection type…</option>
                  {Object.entries(INFECTIONS).map(([k, v]) => (
                    <option key={k} value={k} style={{ background: '#0d0d1f' }}>{v.label}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="text-slate-300 text-sm font-semibold mb-3 block">Clinical Severity</label>
              <div className="grid grid-cols-3 gap-2">
                {['mild', 'moderate', 'severe'].map(s => (
                  <button key={s} onClick={() => setSeverity(s)}
                    className="py-2.5 rounded-xl text-xs font-semibold capitalize transition-all duration-200"
                    style={{
                      background: severity === s
                        ? (s === 'mild' ? 'rgba(16,185,129,0.2)' : s === 'moderate' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)')
                        : 'rgba(255,255,255,0.05)',
                      border: severity === s
                        ? `1px solid ${s === 'mild' ? '#10B981' : s === 'moderate' ? '#F59E0B' : '#EF4444'}60`
                        : '1px solid rgba(255,255,255,0.08)',
                      color: severity === s
                        ? (s === 'mild' ? '#10B981' : s === 'moderate' ? '#F59E0B' : '#EF4444')
                        : '#94A3B8',
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Factors */}
            <div>
              <label className="text-slate-300 text-sm font-semibold mb-3 block">Patient Factors</label>
              <div className="space-y-2">
                {PATIENT_FACTORS.map(({ id, label }) => (
                  <label key={id} className="flex items-center gap-3 cursor-pointer group">
                    <div onClick={() => toggleFactor(id)}
                      className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all duration-200"
                      style={{
                        background: factors.includes(id) ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${factors.includes(id) ? 'rgba(59,130,246,0.6)' : 'rgba(255,255,255,0.12)'}`,
                      }}>
                      {factors.includes(id) && <div className="w-2 h-2 rounded-sm" style={{ background: '#3B82F6' }} />}
                    </div>
                    <span className="text-slate-400 text-xs group-hover:text-slate-300 transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <motion.button
              onClick={handleGenerate}
              disabled={!infection}
              whileHover={infection ? { scale: 1.02, boxShadow: '0 6px 24px rgba(16,185,129,0.3)' } : {}}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-full font-bold text-white flex items-center justify-center gap-2 mt-auto transition-all duration-200"
              style={{
                background: infection ? 'linear-gradient(135deg, #059669, #047857)' : 'rgba(255,255,255,0.06)',
                border: infection ? 'none' : '1px solid rgba(255,255,255,0.1)',
                opacity: infection ? 1 : 0.5,
                cursor: infection ? 'pointer' : 'not-allowed',
              }}>
              <ListChecks size={16} />
              Generate Guidance
            </motion.button>
          </motion.div>

          {/* ── Output panel ── */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {!showOutput ? (
                <motion.div key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 rounded-2xl flex flex-col items-center justify-center text-center p-12"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', minHeight: 420 }}>
                  <Stethoscope size={40} className="text-slate-600 mb-4" />
                  <p className="text-slate-500 text-base">Select an infection type and click<br /><strong className="text-slate-400">Generate Guidance</strong></p>
                </motion.div>
              ) : (
                <motion.div key={`out-${infection}-${severity}`}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-4">

                  {/* Red flag banner */}
                  {data.severe && (
                    <div className="flex items-center gap-3 p-4 rounded-xl"
                      style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)' }}>
                      <ShieldAlert size={18} style={{ color: '#EF4444' }} />
                      <span className="text-red-300 text-sm font-semibold">Medical Emergency, Initiate antibiotics within 1 hour</span>
                    </div>
                  )}

                  {/* Empirical options */}
                  <div className="rounded-2xl p-6"
                    style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', backdropFilter: 'blur(20px)' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Pill size={16} style={{ color: '#10B981' }} />
                      <span className="text-emerald-300 font-semibold text-sm">Empirical Options,{severity.charAt(0).toUpperCase() + severity.slice(1)}</span>
                    </div>
                    <ul className="space-y-2">
                      {data.empirical[severity].map((opt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          <span className="text-slate-200 text-sm">{opt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stewardship actions */}
                  <div className="rounded-2xl p-6"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', backdropFilter: 'blur(20px)' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <ListChecks size={16} style={{ color: '#3B82F6' }} />
                      <span className="text-blue-300 font-semibold text-sm">Stewardship Actions</span>
                    </div>
                    <ul className="space-y-2">
                      {data.stewardship.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5 shrink-0">›</span>
                          <span className="text-slate-200 text-sm">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Warnings */}
                  <div className="rounded-2xl p-6"
                    style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.22)', backdropFilter: 'blur(20px)' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
                      <span className="text-amber-300 font-semibold text-sm">Warnings & Considerations</span>
                    </div>
                    <ul className="space-y-2">
                      {data.warnings.map((w, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                          <span className="text-slate-200 text-sm">{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Patient factor alerts */}
                  {factors.length > 0 && (
                    <div className="rounded-2xl p-6"
                      style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.22)', backdropFilter: 'blur(20px)' }}>
                      <p className="text-purple-300 font-semibold text-sm mb-4">Patient Factor Alerts</p>
                      <div className="space-y-3">
                        {factors.map(f => (
                          <div key={f} className="p-3 rounded-xl"
                            style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
                            <p className="text-slate-300 text-sm">{FACTOR_WARNINGS[f]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-slate-600 text-xs text-center mt-8">
          For educational and stewardship decision-support purposes only. Always apply local antibiogram data and clinical judgement. Consult Infectious Disease for complex cases.
        </p>
      </div>
    </section>
  );
}
