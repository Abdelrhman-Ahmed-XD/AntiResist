import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Users, ImageIcon, X, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import SupporterCard from "../components/common/SupporterCard";
import { getSupporters, getGallery } from "../firebase/firestore";

const FILTERS = ["All", "Doctor", "Pharmacist", "Nurse", "Medical Student", "Pharmacy Student", "Other"];
const PAGE_SIZE = 9;

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  const img = images[index];
  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Image */}
      <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={img.url}
          alt={img.caption ?? "Gallery image"}
          className="w-full max-h-[75vh] object-contain rounded-xl"
        />
        {img.caption && (
          <p className="text-white/70 text-sm text-center mt-3">{img.caption}</p>
        )}
        <p className="text-white/40 text-xs text-center mt-1">
          {index + 1} / {images.length}
        </p>
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SupportWall() {
  const [supporters,  setSupporters]  = useState([]);
  const [gallery,     setGallery]     = useState([]);
  const [loadingSup,  setLoadingSup]  = useState(true);
  const [loadingGal,  setLoadingGal]  = useState(true);
  const [filter,      setFilter]      = useState("All");
  const [search,      setSearch]      = useState("");
  const [page,        setPage]        = useState(1);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    getSupporters()
      .then(setSupporters)
      .finally(() => setLoadingSup(false));
    getGallery(40)
      .then(setGallery)
      .finally(() => setLoadingGal(false));
  }, []);

  // Reset page when filter or search changes
  useEffect(() => { setPage(1); }, [filter, search]);

  const filtered = supporters.filter((s) => {
    const matchesFilter = filter === "All" || s.specialty === filter;
    const matchesSearch = !search.trim() ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.workplace ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevImage     = useCallback(() => setLightboxIdx((i) => (i - 1 + gallery.length) % gallery.length), [gallery.length]);
  const nextImage     = useCallback(() => setLightboxIdx((i) => (i + 1) % gallery.length), [gallery.length]);

  return (
    <>
      <Navbar />
      {lightboxIdx !== null && (
        <Lightbox
          images={gallery}
          index={lightboxIdx}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

      <main className="bg-bg min-h-screen pt-16">

        {/* ── Hero strip ── */}
        <div className="bg-white border-b border-gray-100 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm font-medium text-teal mb-4">
              <Users size={16} strokeWidth={1.5} />
              Support wall
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-dark mb-3">
              Healthcare professionals who stand with us
            </h1>
            <p className="text-secondary leading-relaxed max-w-2xl mb-6">
              Every name on this wall represents a commitment to rational antibiotic use
              and a healthier future for patients across Egypt.
            </p>
            <Link
              to="/join"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal text-white text-sm font-medium rounded-full hover:bg-teal/90 transition-colors"
            >
              Add your name
            </Link>
          </div>
        </div>

        {/* ── Supporters section ── */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Filter + search bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search size={15} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="text"
                  placeholder="Search by name or workplace…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal bg-white transition-colors"
                />
              </div>

              {/* Specialty filter chips */}
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      filter === f
                        ? "bg-teal text-white"
                        : "bg-white border border-gray-200 text-secondary hover:text-dark"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            {!loadingSup && (
              <p className="text-sm text-secondary mb-6">
                {filtered.length} supporter{filtered.length !== 1 ? "s" : ""}
                {filter !== "All" ? ` · ${filter}` : ""}
                {search ? ` · "${search}"` : ""}
              </p>
            )}

            {/* Cards grid */}
            {loadingSup ? (
              <div className="flex justify-center py-20">
                <Loader2 size={32} className="animate-spin text-teal" />
              </div>
            ) : pageItems.length === 0 ? (
              <div className="text-center py-20 text-secondary">
                <Users size={36} strokeWidth={1.5} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No supporters found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageItems.map((s) => (
                  <SupporterCard key={s.id} {...s} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-secondary hover:text-dark hover:border-gray-300 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                      n === page
                        ? "bg-teal text-white"
                        : "border border-gray-200 text-secondary hover:text-dark hover:border-gray-300"
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-secondary hover:text-dark hover:border-gray-300 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── Gallery section ── */}
        <section id="gallery" className="bg-white py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex items-center gap-2 text-sm font-medium text-teal mb-4">
              <ImageIcon size={16} strokeWidth={1.5} />
              Campaign gallery
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark mb-3">
              Moments from the campaign
            </h2>
            <p className="text-secondary text-sm leading-relaxed max-w-2xl mb-10">
              Stewardship rounds, awareness workshops, and training sessions shared by
              healthcare professionals across Egypt.
            </p>

            {loadingGal ? (
              <div className="flex justify-center py-16">
                <Loader2 size={32} className="animate-spin text-teal" />
              </div>
            ) : gallery.length === 0 ? (
              <div className="text-center py-16 text-secondary">
                <ImageIcon size={36} strokeWidth={1.5} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No gallery images yet. Check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setLightboxIdx(idx)}
                    className="group relative overflow-hidden rounded-xl aspect-square focus:outline-none focus:ring-2 focus:ring-teal/50"
                  >
                    <img
                      src={img.url}
                      alt={img.caption ?? `Gallery image ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/30 transition-colors duration-300 flex items-end p-3">
                      {img.caption && (
                        <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-snug line-clamp-2">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
