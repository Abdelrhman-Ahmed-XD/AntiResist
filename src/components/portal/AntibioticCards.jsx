import { useState } from 'react';
import { ChevronDown, Pill, AlertTriangle, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';

const ANTIBIOTICS = [
  {
    id: 'amoxicillin', name: 'Amoxicillin', brand: 'Augmentin', class: 'Penicillin / β-lactam',
    color: 'from-blue-600/20 to-indigo-600/20', border: 'border-blue-500/30', accent: 'text-blue-400',
    uses: ['Upper respiratory tract infections', 'Dental & oral infections', 'Skin & soft-tissue infections', 'Community-acquired pneumonia (mild)'],
    sideEffects: ['GI upset: nausea, diarrhea, bloating', 'Skin rash (maculopapular)', 'Allergic reactions (urticaria to anaphylaxis)'],
    warnings: ['Contraindicated in confirmed penicillin allergy', 'Beta-lactam cross-reactivity with cephalosporins', 'Clavulanate component carries hepatotoxicity risk; monitor LFTs on prolonged use'],
  },
  {
    id: 'azithromycin', name: 'Azithromycin', brand: 'Zithromax / Z-Pack', class: 'Macrolide',
    color: 'from-purple-600/20 to-violet-600/20', border: 'border-purple-500/30', accent: 'text-purple-400',
    uses: ['Atypical pneumonia (Mycoplasma, Chlamydophila)', 'Upper & lower respiratory tract infections', 'Chlamydia trachomatis (urogenital)', 'Typhoid (alternative regimen)'],
    sideEffects: ['GI upset: nausea, abdominal cramps', 'QT interval prolongation (cardiac risk)', 'Rare hepatotoxicity / cholestatic jaundice'],
    warnings: ['Avoid in patients with cardiac arrhythmias or long QT syndrome', 'Significant macrolide resistance globally; culture sensitivity recommended', 'Not indicated for viral upper respiratory infections'],
  },
  {
    id: 'ceftriaxone', name: 'Ceftriaxone', brand: 'Rocephin', class: '3rd-generation Cephalosporin',
    color: 'from-cyan-600/20 to-teal-600/20', border: 'border-cyan-500/30', accent: 'text-cyan-400',
    uses: ['Severe community-acquired pneumonia', 'Bacterial meningitis', 'Sepsis (gram-negative coverage)', 'Typhoid fever (IV)', 'Gonorrhea (IM, single dose)'],
    sideEffects: ['Injection site pain (IM) / phlebitis (IV)', 'Biliary sludge / pseudolithiasis', 'Diarrhea / C. difficile risk', 'Hypersensitivity reactions'],
    warnings: ['NEVER mix with IV calcium-containing solutions in neonates (fatal precipitation)', 'Promotes ESBL-producing organism selection under overuse', 'Use reserved for serious infections; broad empiric use accelerates resistance'],
  },
  {
    id: 'cefixime', name: 'Cefixime', brand: 'Suprax / Cefspan', class: '3rd-generation Cephalosporin (oral)',
    color: 'from-teal-600/20 to-emerald-600/20', border: 'border-teal-500/30', accent: 'text-teal-400',
    uses: ['Uncomplicated UTIs', 'Typhoid fever (oral step-down)', 'Mild-to-moderate respiratory infections', 'Gonorrhea (alternative)'],
    sideEffects: ['Diarrhea, abdominal pain', 'Skin rash, urticaria', 'Nausea, dyspepsia'],
    warnings: ['Increasing resistance rates; confirm susceptibility before use', 'Not appropriate for severe systemic or CNS infections', 'Avoid in patients with known cephalosporin or penicillin allergy'],
  },
  {
    id: 'doxycycline', name: 'Doxycycline', brand: 'Vibramycin / Doryx', class: 'Tetracycline',
    color: 'from-amber-600/20 to-orange-600/20', border: 'border-amber-500/30', accent: 'text-amber-400',
    uses: ['Acne vulgaris (moderate-severe)', 'Atypical respiratory infections', 'Rickettsial diseases (typhus, RMSF)', 'Chlamydia / Mycoplasma infections', 'Malaria prophylaxis'],
    sideEffects: ['Photosensitivity; avoid direct sunlight', 'Esophagitis (always take with full glass of water, upright)', 'Permanent tooth discoloration in children'],
    warnings: ['Contraindicated in pregnancy and children under 8 years', 'Take on empty stomach if tolerated; avoid dairy and antacids (chelation)', 'Use broad-spectrum sunscreen throughout treatment'],
  },
  {
    id: 'metronidazole', name: 'Metronidazole', brand: 'Flagyl', class: 'Nitroimidazole',
    color: 'from-rose-600/20 to-pink-600/20', border: 'border-rose-500/30', accent: 'text-rose-400',
    uses: ['Anaerobic bacterial infections (abdominal, pelvic)', 'Dental / periodontal infections', 'Bacterial vaginosis', 'Protozoal infections: Giardia, Trichomonas, Amoebiasis', 'Intra-abdominal sepsis (combination therapy)'],
    sideEffects: ['Metallic/bitter taste', 'Nausea, anorexia, vomiting', 'Dark urine (harmless metabolite)', 'Peripheral neuropathy (on prolonged use)'],
    warnings: ['Strict alcohol avoidance during treatment and 48h after (disulfiram-like reaction)', 'Neurotoxicity risk on high doses or long-term use', 'Avoid in first trimester of pregnancy'],
  },
  {
    id: 'tmp-smx', name: 'Trimethoprim–Sulfamethoxazole', brand: 'Bactrim / Septrin', class: 'Sulfonamide + DHFR inhibitor',
    color: 'from-violet-600/20 to-purple-600/20', border: 'border-violet-500/30', accent: 'text-violet-400',
    uses: ['Uncomplicated UTIs', 'MRSA skin & soft-tissue infections (oral)', 'Pneumocystis jirovecii pneumonia (PCP): treatment and prophylaxis', 'Nocardiosis', "Traveler's diarrhea"],
    sideEffects: ['Severe skin reactions: SJS / TEN (Stevens-Johnson syndrome)', 'Hyperkalemia (potassium elevation)', 'Bone marrow suppression (leukopenia, thrombocytopenia)', 'Photosensitivity'],
    warnings: ['Avoid in late pregnancy and neonates (kernicterus risk)', 'Monitor serum potassium, especially with ACE inhibitors or ARBs', 'High resistance rates for community UTIs; culture before prescribing'],
  },
];

function DrugCard({ drug, onFirstExpand }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState('uses');

  const handleToggle = () => {
    if (!open) onFirstExpand(drug.id);
    setOpen(o => !o);
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -3, boxShadow: '0 0 20px rgba(138,43,226,0.25)' }}
      className={`rounded-2xl border overflow-hidden bg-gradient-to-br ${drug.color} ${drug.border}`}
    >
      {/* Header */}
      <motion.button
        onClick={handleToggle}
        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
            transition={{ duration: 0.35 }}
            className={`w-10 h-10 rounded-lg bg-white/5 border ${drug.border} flex items-center justify-center shrink-0`}
          >
            <Pill size={18} className={drug.accent} strokeWidth={1.8} />
          </motion.div>
          <div>
            <p className="text-white font-bold text-base leading-none">{drug.name}</p>
            <p className="text-slate-500 text-xs mt-1">{drug.brand} · {drug.class}</p>
          </div>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} className="text-slate-500 shrink-0" />
        </motion.span>
      </motion.button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{   height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6 pb-6">
              {/* Tab bar */}
              <div className="flex gap-1 mb-5 bg-white/5 rounded-xl p-1">
                {[
                  { id: 'uses',    label: 'Uses',         icon: Shield        },
                  { id: 'effects', label: 'Side Effects',  icon: AlertTriangle },
                  { id: 'warnings',label: 'Warnings',      icon: Zap           },
                ].map(({ id, label, icon: Icon }) => (
                  <motion.button
                    key={id}
                    onClick={() => setTab(id)}
                    whileHover={{ scale: tab !== id ? 1.03 : 1 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200
                      ${tab === id
                        ? `bg-gradient-to-r ${drug.color.replace('/20', '/50')} border ${drug.border} ${drug.accent}`
                        : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Icon size={12} />
                    <span className="hidden sm:inline">{label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Tab content with AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.ul
                  key={tab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{   opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  {(tab === 'uses' ? drug.uses : tab === 'effects' ? drug.sideEffects : drug.warnings).map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2.5 text-sm text-slate-300"
                    >
                      <span className={`mt-0.5 shrink-0 ${tab === 'uses' ? drug.accent : tab === 'effects' ? 'text-amber-400' : 'text-red-400'}`}>
                        {tab === 'uses' ? '✓' : tab === 'effects' ? '⚠' : '⛔'}
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function AntibioticCards() {
  const { addPoints, hasAction } = useGamification();

  const handleFirstExpand = (id) => {
    if (!hasAction(`card-${id}`)) addPoints(`card-${id}`, 5);
  };

  return (
    <section id="antibiotic-cards" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label mb-4 mx-auto">Educational</div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Antibiotic Library</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Click any drug card to explore its uses, side effects, and warnings. Earn{' '}
            <span className="text-purple-400 font-semibold">+5 points</span> for each new card you open.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {ANTIBIOTICS.map(drug => (
            <motion.div key={drug.id} variants={cardVariant}>
              <DrugCard drug={drug} onFirstExpand={handleFirstExpand} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 p-4 rounded-xl bg-white/3 border border-white/8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-slate-600 text-xs">
            This reference is for educational purposes only. Always consult a licensed healthcare professional before starting, stopping, or changing any medication.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
