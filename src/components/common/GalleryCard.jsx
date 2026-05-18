export default function GalleryCard({ url, caption, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl aspect-square focus:outline-none focus:ring-2 focus:ring-teal/50 bg-gray-100"
    >
      <img
        src={url}
        alt={caption ?? "Gallery image"}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {caption && (
        <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/40 transition-colors duration-300 flex items-end p-3">
          <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-snug line-clamp-2">
            {caption}
          </p>
        </div>
      )}
    </button>
  );
}
