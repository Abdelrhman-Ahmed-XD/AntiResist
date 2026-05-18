import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export default function Hero() {
  function scrollToAMR() {
    document.getElementById("what-is-amr")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="bg-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — text */}
          <div className="flex flex-col gap-6">
            {/* Badge chip */}
            <span className="inline-flex items-center gap-2 self-start bg-teal/10 text-teal text-sm font-medium px-4 py-1.5 rounded-full">
              🔬 Awareness Campaign
            </span>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl font-semibold text-gray-900 leading-tight tracking-tight">
              Join the fight against antibiotic resistance
            </h1>

            {/* Subtext */}
            <p className="text-lg text-secondary leading-relaxed max-w-lg">
              A movement of Egyptian healthcare professionals committed to rational
              antibiotic use.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/join"
                className="inline-flex items-center justify-center bg-teal text-white font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Join the Movement
              </Link>
              <button
                onClick={scrollToAMR}
                className="inline-flex items-center justify-center border border-primary text-primary bg-transparent font-medium px-6 py-3 rounded-xl hover:bg-primary/5 transition-colors"
              >
                Learn More
              </button>
            </div>

            {/* Social proof */}
            <p className="flex items-center gap-2 text-sm text-secondary">
              <Users size={16} strokeWidth={1.5} className="text-teal" />
              Joined by 482+ healthcare professionals
            </p>
          </div>

          {/* Right — image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] lg:aspect-[3/2]">
              <img
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600"
                alt="Antibiotic pills and laboratory equipment"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            {/* Decorative blob behind image */}
            <div
              aria-hidden="true"
              className="absolute -z-10 -bottom-6 -right-6 w-64 h-64 bg-teal/10 rounded-full blur-3xl"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
