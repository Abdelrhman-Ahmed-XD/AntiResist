import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import SupporterCard from "../common/SupporterCard";

const MOCK_SUPPORTERS = [
  {
    id: "1",
    name: "Dr. Ahmed Hassan",
    specialty: "Doctor",
    workplace: "Cairo University Hospitals",
    comment: "Rational antibiotic prescribing is our shared responsibility. AMR is a silent pandemic we must address together.",
    createdAt: "2024-03-15",
  },
  {
    id: "2",
    name: "Pharm. Sara Khalil",
    specialty: "Pharmacist",
    workplace: "Ain Shams Medical Center",
    comment: "Every dispensing decision matters. We must counsel patients on completing their full course.",
    createdAt: "2024-03-18",
  },
  {
    id: "3",
    name: "Nurse Mona Farouk",
    specialty: "Nurse",
    workplace: "Alexandria General Hospital",
    comment: "Infection control starts at the bedside. Proper hand hygiene saves lives.",
    createdAt: "2024-03-20",
  },
  {
    id: "4",
    name: "Dr. Omar Saleh",
    specialty: "Doctor",
    workplace: "Mansoura University Hospital",
    comment: "Culture before empiric therapy is not a luxury — it is the standard of care.",
    createdAt: "2024-04-02",
  },
  {
    id: "5",
    name: "Youssef Mahmoud",
    specialty: "Medical Student",
    workplace: "Faculty of Medicine, Cairo University",
    comment: "Future physicians must graduate with stewardship principles embedded in their practice.",
    createdAt: "2024-04-10",
  },
  {
    id: "6",
    name: "Pharm. Nada Ibrahim",
    specialty: "Pharmacy Student",
    workplace: "Faculty of Pharmacy, Alexandria University",
    comment: "Learning antibiotic stewardship from day one changes how we see our role in patient care.",
    createdAt: "2024-04-14",
  },
];

export default function SupportWallPreview() {
  return (
    <section id="support-wall" className="bg-bg py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Badge */}
        <div className="flex items-center gap-2 text-sm font-medium text-teal mb-4">
          <Users size={16} strokeWidth={1.5} />
          Point 5
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-dark mb-4">
              Healthcare professionals who stand with us
            </h2>
            <p className="text-secondary leading-relaxed max-w-2xl">
              Doctors, pharmacists, nurses, and students across Egypt committed to rational
              antibiotic use and fighting antimicrobial resistance.
            </p>
          </div>
          <Link
            to="/support-wall"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-teal text-teal text-sm font-medium hover:bg-teal hover:text-white transition-colors"
          >
            <Users size={15} strokeWidth={1.5} />
            View all supporters
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SUPPORTERS.map((supporter) => (
            <SupporterCard key={supporter.id} {...supporter} />
          ))}
        </div>
      </div>
    </section>
  );
}
