import { Link } from "react-router-dom";
import { ImageIcon, ExternalLink } from "lucide-react";

const GALLERY_IMAGES = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    alt: "Healthcare team in hospital corridor",
    caption: "Stewardship Round  Cairo University Hospitals, March 2024",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80",
    alt: "Pharmacist counselling patient",
    caption: "Patient Counselling Workshop  Ain Shams, April 2024",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1582560474992-385ebb9b46f8?w=600&q=80",
    alt: "Medical students in lecture hall",
    caption: "AMR Awareness Lecture  Faculty of Medicine, April 2024",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1631815588090-d1bcbe9a8539?w=600&q=80",
    alt: "Laboratory technician at microscope",
    caption: "Microbiology Lab  Culture & Sensitivity Reporting",
  },
];

export default function CampaignGalleryPreview() {
  return (
    <section id="gallery" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Badge */}
        <div className="flex items-center gap-2 text-sm font-medium text-teal mb-4">
          <ImageIcon size={16} strokeWidth={1.5} />
          Point 6
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-dark mb-4">
              Campaign gallery
            </h2>
            <p className="text-secondary leading-relaxed max-w-2xl">
              Moments from stewardship rounds, awareness workshops, and training
              sessions shared by healthcare professionals across Egypt.
            </p>
          </div>
          <Link
            to="/support-wall"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-secondary text-sm font-medium hover:border-teal hover:text-teal transition-colors"
          >
            <ExternalLink size={14} strokeWidth={1.5} />
            View full gallery
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {GALLERY_IMAGES.map(({ id, src, alt, caption }) => (
            <div key={id} className="group relative overflow-hidden rounded-2xl shadow-sm">
              <img
                src={src}
                alt={alt}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <p className="text-white text-sm font-medium leading-snug">{caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
