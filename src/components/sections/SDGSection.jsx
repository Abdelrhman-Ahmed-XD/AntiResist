import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, GraduationCap, AlertTriangle } from 'lucide-react';

const VP   = { once: true, amount: 0.08 };
const ease = [0.22, 1, 0.36, 1];

export default function SDGSection() {
  const headerRef      = useRef(null);
  const cardsRef       = useRef(null);
  const platformRef    = useRef(null);
  const disclaimerRef  = useRef(null);

  const headerInView     = useInView(headerRef,     VP);
  const cardsInView      = useInView(cardsRef,      VP);
  const platformInView   = useInView(platformRef,   VP);
  const disclaimerInView = useInView(disclaimerRef, VP);

  return (
    <section id="sdg" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="flex flex-col items-center text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ background: 'rgba(245,158,11,0.10)', border: '1.5px solid rgba(245,158,11,0.40)', color: '#B45309' }}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease }}
          >
            Disclaimer and SDG Alignment
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease, delay: headerInView ? 0.08 : 0 }}
          >
            Aligned with{' '}
            <span style={{ color: '#D97706' }}>SDG 3</span>
            {' '}and{' '}
            <span style={{ color: '#EA580C' }}>SDG 4</span>
          </motion.h2>
          <motion.p
            className="text-gray-500 text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease, delay: headerInView ? 0.16 : 0 }}
          >
            Good Health and Wellbeing &nbsp;·&nbsp; Quality Education
          </motion.p>
        </div>

        {/* SDG cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* SDG 3 */}
          <motion.div
            className="bg-white rounded-2xl p-8 flex flex-col gap-4 shadow-sm"
            style={{ border: '1px solid rgba(245,158,11,0.30)' }}
            initial={{ opacity: 0, y: 28 }}
            animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.55, ease }}
            whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(245,158,11,0.16)', borderColor: 'rgba(245,158,11,0.55)', scale: 1.01 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 4px 14px rgba(245,158,11,0.30)' }}>
                3
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#D97706' }}>SDG 3</p>
                <p className="text-gray-900 font-bold text-lg leading-tight">Good Health and Wellbeing</p>
              </div>
              <Heart size={24} className="ml-auto shrink-0" style={{ color: '#D97706' }} />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              By promoting rational antibiotic use and awareness of AMR, we directly support global efforts to achieve
              healthy lives and promote wellbeing, particularly by helping communities access safer healthcare practices
              and reducing preventable deaths from drug resistant infections.
            </p>
          </motion.div>

          {/* SDG 4 */}
          <motion.div
            className="bg-white rounded-2xl p-8 flex flex-col gap-4 shadow-sm"
            style={{ border: '1px solid rgba(234,88,12,0.30)' }}
            initial={{ opacity: 0, y: 28 }}
            animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.55, ease, delay: cardsInView ? 0.13 : 0 }}
            whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(234,88,12,0.14)', borderColor: 'rgba(234,88,12,0.55)', scale: 1.01 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #EA580C, #C2410C)', boxShadow: '0 4px 14px rgba(234,88,12,0.28)' }}>
                4
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#EA580C' }}>SDG 4</p>
                <p className="text-gray-900 font-bold text-lg leading-tight">Quality Education</p>
              </div>
              <GraduationCap size={24} className="ml-auto shrink-0" style={{ color: '#EA580C' }} />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Through accessible, evidence based educational content including interactive quizzes, myth busting tools,
              and stewardship guidance, we empower both patients and healthcare professionals with the knowledge needed
              to make informed decisions about antibiotic use.
            </p>
          </motion.div>
        </div>

        {/* Platform description */}
        <div ref={platformRef}>
          <motion.div
            className="rounded-2xl p-8 mb-6"
            style={{ background: 'rgba(255,251,235,0.80)', border: '1px solid rgba(245,158,11,0.22)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={platformInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="max-w-4xl mx-auto space-y-4 text-gray-700 text-base leading-relaxed text-center">
              <p>
                Our Antibiotic Stewardship Platform supports global health and education goals by raising awareness about
                Antimicrobial Resistance and promoting the responsible use of antibiotics among patients and healthcare
                professionals.
              </p>
              <p>
                The platform provides accessible educational content, interactive tools, stewardship guidance, and awareness
                resources to help reduce antibiotic misuse and combat the growing threat of antimicrobial resistance.
              </p>
              <p>
                By improving public understanding and supporting healthcare professionals with evidence based information,
                the website contributes to safer healthcare practices, better treatment outcomes, and stronger health
                education within the community.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <div ref={disclaimerRef}>
          <motion.div
            className="flex items-start gap-4 rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.10) 0%, rgba(234,88,12,0.08) 100%)',
              border: '1.5px solid rgba(245,158,11,0.50)',
              boxShadow: '0 4px 28px rgba(245,158,11,0.14)',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={disclaimerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #EA580C)', boxShadow: '0 4px 14px rgba(245,158,11,0.40)' }}>
              <AlertTriangle size={20} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest mb-1.5" style={{ color: '#B45309' }}>
                Disclaimer
              </p>
              <p className="text-sm leading-relaxed font-medium" style={{ color: '#92400E' }}>
                This platform is intended for educational antimicrobial stewardship support only and does not replace
                clinical judgment or institutional protocols. Always consult a qualified healthcare professional for
                medical advice.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
