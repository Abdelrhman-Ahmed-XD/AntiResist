import { Link } from "react-router-dom";
import { Shield, Target, Eye, HeartHandshake, BookOpen, FlaskConical, Users } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const MISSION_POINTS = [
  {
    icon: Target,
    title: "Our mission",
    desc: "To raise awareness among Egyptian healthcare professionals about the global threat of antimicrobial resistance and empower every clinician, pharmacist, nurse, and student to act as a steward of antibiotics.",
  },
  {
    icon: Eye,
    title: "Our vision",
    desc: "A healthcare system where every antibiotic prescription is evidence-based, every patient is counselled, and Egypt's resistance rates fall through coordinated, professional-led action.",
  },
  {
    icon: HeartHandshake,
    title: "Our approach",
    desc: "We unite healthcare professionals behind a shared public commitment  making stewardship visible, peer-driven, and tied to real clinical practice rather than policy alone.",
  },
];

const PILLARS = [
  { icon: BookOpen,     label: "Education",   desc: "Evidence-based content on AMR, rational prescribing, and the WHO AWaRe framework." },
  { icon: Users,        label: "Community",   desc: "A public wall of committed professionals that makes stewardship a shared, social act." },
  { icon: FlaskConical, label: "Data",        desc: "Local resistance data from Egyptian hospitals to ground prescribing decisions in reality." },
  { icon: HeartHandshake, label: "Action",   desc: "Role-specific responsibilities that translate awareness into tangible clinical behaviour." },
];

const TEAM = [
  { name: "Campaign Team",      role: "Content & Clinical Review",   initials: "CT", color: "bg-teal"    },{ name: "Campaign Team",      role: "Content & Clinical Review",   initials: "CT", color: "bg-teal"    },{ name: "Campaign Team",      role: "Content & Clinical Review",   initials: "CT", color: "bg-teal"    },{ name: "Campaign Team",      role: "Content & Clinical Review",   initials: "CT", color: "bg-teal"    },{ name: "Campaign Team",      role: "Content & Clinical Review",   initials: "CT", color: "bg-teal"    },{ name: "Campaign Team",      role: "Content & Clinical Review",   initials: "CT", color: "bg-teal"    },{ name: "Campaign Team",      role: "Content & Clinical Review",   initials: "CT", color: "bg-teal"    },
];

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <main className="bg-bg min-h-screen">

        {/* ── Hero ── */}
        <div className="bg-white border-b border-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm font-medium text-teal mb-4">
              <Shield size={16} strokeWidth={1.5} />
              About AntiResist
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-dark mb-6 max-w-2xl leading-tight">
              Why we built this campaign
            </h1>
            <p className="text-secondary leading-relaxed max-w-2xl text-lg mb-8">
              Antimicrobial resistance is one of the most urgent health threats of our time.
              In Egypt  where ESBL rates exceed 85 % and MDR organisms are routine in ICUs
              the gap between knowledge and practice must close now. AntiResist is our answer.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/join"
                className="px-6 py-3 bg-teal text-white text-sm font-medium rounded-full hover:bg-teal/90 transition-colors"
              >
                Join the movement
              </Link>
              <Link
                to="/support-wall"
                className="px-6 py-3 border border-gray-200 text-dark text-sm font-medium rounded-full hover:border-teal hover:text-teal transition-colors"
              >
                View supporters
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mission / Vision / Approach ── */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {MISSION_POINTS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                  <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                    <Icon size={20} strokeWidth={1.5} className="text-teal" />
                  </div>
                  <p className="font-semibold text-dark mb-2">{title}</p>
                  <p className="text-sm text-secondary leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The problem ── */}
        <section className="bg-white py-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-semibold text-dark mb-4">
                  The problem we're solving
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  Globally, antimicrobial resistance caused 1.27 million deaths in 2019  more than
                  HIV/AIDS or malaria. By 2050, projections put that figure at 10 million annually
                  if current trends continue.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  In Egyptian hospitals, resistance rates among common pathogens are among the
                  highest documented anywhere. MRSA exceeds 60 %, ESBL-producing organisms
                  dominate urinary infections, and MDR <em>Acinetobacter baumannii</em> is
                  virtually universal in ICU surveys.
                </p>
                <p className="text-secondary leading-relaxed">
                  The drivers are well-understood: over-prescribing, self-medication, inadequate
                  stewardship programmes, and weak enforcement of prescription-only policies.
                  These are solvable  and healthcare professionals are the key lever.
                </p>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { stat: "1.27M", label: "Deaths attributable to AMR in 2019", color: "text-primary" },
                  { stat: "10M",   label: "Projected annual deaths by 2050 without action", color: "text-danger" },
                  { stat: "85%",   label: "ESBL resistance rate in Egyptian E. coli isolates", color: "text-amber-500" },
                  { stat: ">60%",  label: "MRSA prevalence in Egyptian hospital surveys", color: "text-orange-500" },
                ].map(({ stat, label, color }) => (
                  <div key={stat} className="bg-bg border border-gray-100 rounded-2xl p-5">
                    <p className={`text-3xl font-bold mb-1 ${color}`}>{stat}</p>
                    <p className="text-xs text-secondary leading-snug">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Four pillars ── */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark mb-3">
              What the campaign offers
            </h2>
            <p className="text-secondary text-sm leading-relaxed max-w-xl mb-10">
              AntiResist is built around four interconnected pillars that move awareness into action.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PILLARS.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon size={20} strokeWidth={1.5} className="text-primary" />
                  </div>
                  <p className="font-semibold text-dark mb-1">{label}</p>
                  <p className="text-sm text-secondary leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="bg-white py-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark mb-3">Behind the campaign</h2>
            <p className="text-secondary text-sm leading-relaxed max-w-xl mb-10">
              AntiResist was created by Egyptian healthcare professionals and developers committed
              to translating stewardship science into public action.
            </p>
            <div className="flex flex-wrap gap-5">
              {TEAM.map(({ name, role, initials, color }) => (
                <div key={name} className="flex items-center gap-4 bg-bg border border-gray-100 rounded-2xl px-5 py-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${color}`}>
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">{name}</p>
                    <p className="text-xs text-secondary">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── References ── */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-xs text-secondary border border-gray-100 rounded-xl p-5 space-y-1">
              <p className="font-semibold text-dark mb-2">References</p>
              <p>Murray CJ, et al. (2022). Global burden of bacterial antimicrobial resistance in 2019. <em>The Lancet</em>, 399(10325), 629–655.</p>
              <p>O'Neill J. (2016). Tackling drug-resistant infections globally. <em>Review on Antimicrobial Resistance</em>.</p>
              <p>Saber S, et al. (2023). Antimicrobial resistance patterns in Egyptian hospitals: a systematic review. <em>Journal of Global Antimicrobial Resistance</em>.</p>
              <p>WHO (2019). Antimicrobial stewardship programmes in health-care facilities in low- and middle-income countries. WHO Practical Toolkit.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
