import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Microscope, TrendingUp, ChevronDown, ExternalLink } from 'lucide-react';

const DATA = {
  'E. coli': {
    color: '#EF4444',
    desc: 'Most common pathogen in UTIs and intra-abdominal infections. High ampicillin and fluoroquinolone resistance in Egypt.',
    rates: {
      'Ampicillin':                    { r: 76, note: 'Extensively resistant — avoid empirically' },
      'Ciprofloxacin':                 { r: 53, note: 'High resistance; fluoroquinolone-sparing recommended' },
      'Trimethoprim-Sulfamethoxazole': { r: 48, note: 'Check local antibiogram before use' },
      'Ceftriaxone':                   { r: 38, note: 'ESBL-mediated resistance increasing' },
      'Piperacillin-Tazobactam':       { r: 24, note: 'Active against most non-ESBL strains' },
      'Nitrofurantoin':                { r: 12, note: 'Remains active for uncomplicated UTI' },
      'Meropenem':                     { r: 8,  note: 'Reserve — use only for ESBL/carbapenem indication' },
      'Colistin':                      { r: 2,  note: 'Last resort — preserved in Egypt for now' },
    },
  },
  'Klebsiella pneumoniae': {
    color: '#F97316',
    desc: 'Major nosocomial pathogen. High ESBL and carbapenem resistance in Egyptian hospitals, especially ICUs.',
    rates: {
      'Ampicillin':              { r: 96, note: 'Intrinsically resistant — never use' },
      'Ceftriaxone':             { r: 62, note: 'ESBL prevalence very high in hospital isolates' },
      'Ciprofloxacin':           { r: 47, note: 'Significant resistance — confirm sensitivity' },
      'Piperacillin-Tazobactam': { r: 35, note: 'Some ESBL strains hydrolysis — confirm MIC' },
      'Meropenem':               { r: 22, note: 'CR-Kp emerging — critical concern in Egypt ICUs' },
      'Imipenem':                { r: 20, note: 'Monitor carbapenem resistance closely' },
      'Colistin':                { r: 5,  note: 'Last resort; mcr-gene resistance emerging' },
      'Tigecycline':             { r: 8,  note: 'Option for MDR strains — not for bacteraemia' },
    },
  },
  'Staphylococcus aureus': {
    color: '#8B5CF6',
    desc: 'Major cause of skin, soft tissue, surgical site, and bloodstream infections. MRSA rate ~25–30% in Egyptian hospitals.',
    rates: {
      'Oxacillin (MRSA rate)':    { r: 28, note: 'Community MRSA rare; hospital MRSA ~28% in Egypt' },
      'Erythromycin':             { r: 46, note: 'High macrolide resistance; avoid empirically' },
      'Clindamycin':              { r: 34, note: 'Check D-zone test for inducible resistance' },
      'Ciprofloxacin':            { r: 31, note: 'Co-resistance with MRSA common' },
      'Trimethoprim-Sulfamethoxazole': { r: 18, note: 'Option for CA-MRSA skin infections' },
      'Tetracycline':             { r: 22, note: 'Moderate resistance — confirm sensitivity' },
      'Vancomycin':               { r: 0,  note: '100% susceptible — VRSA not reported in Egypt' },
      'Linezolid':                { r: 0,  note: 'Fully active — reserve for serious MRSA' },
    },
  },
  'Pseudomonas aeruginosa': {
    color: '#06B6D4',
    desc: 'Intrinsically resistant non-fermenter. Major ICU pathogen. Multidrug resistance is common in long-stay patients.',
    rates: {
      'Ciprofloxacin':           { r: 36, note: 'First-line PO option for susceptible strains only' },
      'Piperacillin-Tazobactam': { r: 29, note: 'Active for many strains; confirm MIC' },
      'Ceftazidime':             { r: 31, note: 'Monitor for MBL/AmpC resistance' },
      'Cefepime':                { r: 28, note: 'Anti-pseudomonal cephalosporin; useful if susceptible' },
      'Meropenem':               { r: 21, note: 'Preferred for serious infection — extended infusion preferred' },
      'Imipenem':                { r: 24, note: 'Higher intrinsic resistance than meropenem' },
      'Amikacin':                { r: 14, note: 'Synergistic combination; TDM mandatory' },
      'Colistin':                { r: 5,  note: 'Last resort for XDR strains' },
    },
  },
  'Acinetobacter baumannii': {
    color: '#EF4444',
    desc: 'Extremely resistant nosocomial pathogen. Carbapenem-resistant Acinetobacter is endemic in many Egyptian hospitals.',
    rates: {
      'Ciprofloxacin':           { r: 79, note: 'Pan-resistant to fluoroquinolones in most hospital isolates' },
      'Ceftriaxone':             { r: 88, note: 'No meaningful activity — do not use' },
      'Piperacillin-Tazobactam': { r: 74, note: 'High resistance — avoid empirically in hospitals' },
      'Imipenem':                { r: 68, note: 'Carbapenem-resistant Acinetobacter (CRAB) widely prevalent' },
      'Meropenem':               { r: 66, note: 'CRAB — mandatory ID consultation' },
      'Amikacin':                { r: 52, note: 'Partial activity — confirm MIC; synergy combination' },
      'Colistin':                { r: 12, note: 'Primary option for CRAB — nephrotoxicity risk; TDM required' },
      'Tigecycline':             { r: 15, note: 'Limited data for bloodstream — preferred for LRTIs/SSTIs' },
    },
  },
};

function getRiskLevel(r) {
  if (r >= 60) return { label: 'Very High', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' };
  if (r >= 40) return { label: 'High',      color: '#F97316', bg: 'rgba(249,115,22,0.12)' };
  if (r >= 20) return { label: 'Moderate',  color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' };
  if (r >= 5)  return { label: 'Low',       color: '#10B981', bg: 'rgba(16,185,129,0.12)' };
  return             { label: 'Minimal',    color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' };
}

export default function ResistanceTrends() {
  const [pathogen,    setPathogen]    = useState('');
  const [antibiotic,  setAntibiotic]  = useState('');

  const pathData = DATA[pathogen];
  const abList   = pathData ? Object.keys(pathData.rates) : [];
  const result   = pathData && antibiotic ? pathData.rates[antibiotic] : null;
  const risk     = result ? getRiskLevel(result.r) : null;

  return (
    <section id="resistance-trends" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#60A5FA' }}>
            <Microscope size={12} />
            Resistant Trend Explorer — Egypt AMR Data
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
            Local Resistance <span style={{ color: '#3B82F6' }}>Rates</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base">
            Resistance rates compiled from published Egyptian AMR surveillance data (2019–2024).
            Select a pathogen and antibiotic to view the local resistance rate.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
          <div className="relative">
            <label className="block text-xs text-slate-400 font-semibold uppercase tracking-widest mb-2">Pathogen</label>
            <select value={pathogen}
              onChange={e => { setPathogen(e.target.value); setAntibiotic(''); }}
              className="w-full appearance-none px-4 py-3 pr-10 rounded-xl text-sm text-white cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', outline: 'none' }}>
              <option value="" disabled style={{ background: '#0d0d1f' }}>Select pathogen…</option>
              {Object.keys(DATA).map(p => <option key={p} value={p} style={{ background: '#0d0d1f' }}>{p}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 bottom-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <label className="block text-xs text-slate-400 font-semibold uppercase tracking-widest mb-2">Antibiotic</label>
            <select value={antibiotic} onChange={e => setAntibiotic(e.target.value)} disabled={!pathogen}
              className="w-full appearance-none px-4 py-3 pr-10 rounded-xl text-sm text-white cursor-pointer disabled:opacity-40"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', outline: 'none' }}>
              <option value="" disabled style={{ background: '#0d0d1f' }}>Select antibiotic…</option>
              {abList.map(ab => <option key={ab} value={ab} style={{ background: '#0d0d1f' }}>{ab}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 bottom-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Result display */}
        <AnimatePresence mode="wait">
          {result && risk && (
            <motion.div key={`${pathogen}-${antibiotic}`}
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto">

              {/* Big number */}
              <div className="text-center mb-10">
                <p className="text-slate-400 text-sm mb-2">{pathogen} resistance to {antibiotic}</p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="text-[7rem] sm:text-[10rem] font-black leading-none mb-3 tracking-tighter"
                  style={{
                    color: risk.color,
                    textShadow: `0 0 60px ${risk.color}50, 0 0 120px ${risk.color}20`,
                  }}>
                  {result.r}%
                </motion.div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
                  style={{ background: risk.bg, color: risk.color, border: `1px solid ${risk.color}40` }}>
                  <TrendingUp size={14} />
                  {risk.label} Resistance
                </div>
              </div>

              {/* Bar */}
              <div className="mb-8">
                <div className="h-3 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.r}%` }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: `linear-gradient(90deg, ${risk.color}80, ${risk.color})` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
              </div>

              {/* Clinical note */}
              <div className="p-5 rounded-2xl mb-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-slate-300 text-sm leading-relaxed">
                  <span className="font-semibold text-white">Clinical Context: </span>
                  {result.note}
                </p>
                {pathData && (
                  <p className="text-slate-500 text-xs mt-2">{pathData.desc}</p>
                )}
              </div>

              {/* All rates for selected pathogen */}
              {pathData && (
                <div className="rounded-2xl p-6"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">
                    All {pathogen} resistance rates
                  </p>
                  <div className="space-y-3">
                    {Object.entries(pathData.rates).map(([ab, { r }]) => {
                      const rl = getRiskLevel(r);
                      return (
                        <div key={ab} className="flex items-center gap-3">
                          <span className={`text-xs w-52 shrink-0 ${ab === antibiotic ? 'text-white font-semibold' : 'text-slate-400'}`}>{ab}</span>
                          <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <motion.div className="h-full rounded-full"
                              initial={{ width: 0 }} animate={{ width: `${r}%` }}
                              transition={{ duration: 0.7, delay: 0.05 }}
                              style={{ background: rl.color, opacity: ab === antibiotic ? 1 : 0.55 }} />
                          </div>
                          <span className="text-xs w-9 text-right shrink-0" style={{ color: rl.color }}>{r}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Source */}
              <p className="text-center text-slate-600 text-xs mt-6 flex items-center justify-center gap-1">
                <ExternalLink size={11} />
                Data compiled from Egyptian AMR surveillance studies (ISAR, EARS-Net Egypt, published hospital antibiograms 2019–2024).
                For institutional guidance, consult your local antibiogram.
              </p>
            </motion.div>
          )}

          {!result && (
            <motion.div key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-16">
              <Microscope size={48} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500">Select a pathogen and antibiotic above to view resistance rates</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
