import { motion } from 'framer-motion';
import { Heart, GraduationCap, AlertTriangle } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

export default function SDGSection() {
  return (
    <section id="sdg" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Label */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="flex flex-col items-center text-center mb-12"
        >
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ background: 'rgba(76,159,56,0.08)', border: '1px solid rgba(76,159,56,0.25)', color: '#4C9F38' }}>
            United Nations SDG Alignment
          </motion.div>
          <motion.h2 variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Aligned with{' '}
            <span style={{ color: '#4C9F38' }}>SDG 3</span>
            {' '}and{' '}
            <span style={{ color: '#C5192D' }}>SDG 4</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 text-sm font-medium">
            Good Health and Well-being &nbsp;·&nbsp; Quality Education
          </motion.p>
        </motion.div>

        {/* Two SDG cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
        >
          {/* SDG 3 */}
          <motion.div variants={fadeUp}
            className="bg-white rounded-2xl p-8 flex flex-col gap-4 shadow-sm"
            style={{ border: '1px solid rgba(76,159,56,0.25)' }}
            whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(76,159,56,0.14)', borderColor: 'rgba(76,159,56,0.45)', scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white"
                style={{ background: '#4C9F38' }}>
                3
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#4C9F38' }}>SDG 3</p>
                <p className="text-gray-900 font-bold text-lg leading-tight">Good Health & Well-being</p>
              </div>
              <Heart size={24} className="ml-auto shrink-0" style={{ color: '#4C9F38' }} />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              By promoting rational antibiotic use and awareness of AMR, we directly support global efforts to achieve healthy lives and promote well-being — particularly by helping communities access safer healthcare practices and reducing preventable deaths from drug-resistant infections.
            </p>
          </motion.div>

          {/* SDG 4 */}
          <motion.div variants={fadeUp}
            className="bg-white rounded-2xl p-8 flex flex-col gap-4 shadow-sm"
            style={{ border: '1px solid rgba(197,25,45,0.25)' }}
            whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(197,25,45,0.12)', borderColor: 'rgba(197,25,45,0.45)', scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white"
                style={{ background: '#C5192D' }}>
                4
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#C5192D' }}>SDG 4</p>
                <p className="text-gray-900 font-bold text-lg leading-tight">Quality Education</p>
              </div>
              <GraduationCap size={24} className="ml-auto shrink-0" style={{ color: '#C5192D' }} />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Through accessible, evidence-based educational content — interactive quizzes, myth-busting tools, and stewardship guidance — we empower both patients and healthcare professionals with the knowledge needed to make informed decisions about antibiotic use.
            </p>
          </motion.div>
        </motion.div>

        {/* Full text block */}
        <motion.div
          className="rounded-2xl p-8 mb-6"
          style={{ background: '#F8FAFC', border: '1px solid #E5E7EB' }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <p className="text-gray-600 text-base leading-relaxed text-center max-w-4xl mx-auto">
            Our Antibiotic Stewardship Platform supports global health and education goals by raising awareness about
            Antimicrobial Resistance and promoting the responsible use of antibiotics among patients and healthcare
            professionals. The platform provides accessible educational content, interactive tools, stewardship guidance,
            and awareness resources to help reduce antibiotic misuse and combat the growing threat of antimicrobial
            resistance. By improving public understanding and supporting healthcare professionals with evidence-based
            information, the website contributes to safer healthcare practices, better treatment outcomes, and stronger
            health education within the community.
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          className="flex items-start gap-3 rounded-2xl p-5"
          style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)' }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <AlertTriangle size={18} className="shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
          <p className="text-sm" style={{ color: '#92400E' }}>
            <strong>Disclaimer:</strong> This platform is intended for educational antimicrobial stewardship support only
            and does not replace clinical judgment or institutional protocols. Always consult a qualified healthcare
            professional for medical advice.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
