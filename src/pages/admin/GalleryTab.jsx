import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { ImageIcon, Trash2, Loader2, UploadCloud, X } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";
import { addGalleryImage, getGallery, deleteGalleryImage } from "../../firebase/firestore";

const MAX_MB = 5;

export default function GalleryTab() {
  const [images,    setImages]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting,  setDeleting]  = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [caption,   setCaption]   = useState("");
  const [file,      setFile]      = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    getGallery(40)
      .then(setImages)
      .finally(() => setLoading(false));
  }, []);

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      toast.error(`File exceeds ${MAX_MB} MB limit.`);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function clearSelection() {
    setFile(null);
    setCaption("");
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const docRef = await addGalleryImage({ url, caption: caption.trim() });
      const newImg = { id: docRef.id, url, caption: caption.trim() };
      setImages((prev) => [newImg, ...prev]);
      toast.success("Image uploaded.");
      clearSelection();
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(img) {
    if (!window.confirm("Delete this image? This cannot be undone.")) return;
    setDeleting(img.id);
    try {
      await deleteGalleryImage(img.id);
      setImages((prev) => prev.filter((i) => i.id !== img.id));
      toast.success("Image removed.");
    } catch {
      toast.error("Failed to delete. Please try again.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      {/* Upload card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="font-semibold text-dark mb-4">Upload new image</h2>

        {preview ? (
          <div className="mb-4">
            <div className="relative inline-block">
              <img src={preview} alt="Preview" className="h-40 rounded-xl object-cover" />
              <button
                onClick={clearSelection}
                className="absolute -top-2 -right-2 w-6 h-6 bg-dark text-white rounded-full flex items-center justify-center hover:bg-danger transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-teal hover:bg-teal/5 transition-colors mb-4">
            <UploadCloud size={24} strokeWidth={1.5} className="text-secondary mb-2" />
            <span className="text-sm text-secondary">Click to select an image</span>
            <span className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP · max {MAX_MB} MB</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}

        <input
          type="text"
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors mb-4"
        />

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal text-white text-sm font-medium rounded-xl hover:bg-teal/90 transition-colors disabled:opacity-50"
        >
          {uploading
            ? <><Loader2 size={15} className="animate-spin" /> Uploading…</>
            : <><UploadCloud size={15} strokeWidth={1.5} /> Upload image</>}
        </button>
      </div>

      {/* Stat */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-6 inline-block">
        <p className="text-2xl font-bold text-dark">{images.length}</p>
        <p className="text-xs text-secondary mt-0.5">Total images</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-teal" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-secondary">
          <ImageIcon size={32} strokeWidth={1.5} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No images yet. Upload one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100">
              <img
                src={img.url}
                alt={img.caption || "Gallery image"}
                className="w-full h-full object-cover"
              />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-dark/60 px-2 py-1.5">
                  <p className="text-white text-xs leading-snug line-clamp-2">{img.caption}</p>
                </div>
              )}
              <button
                onClick={() => handleDelete(img)}
                disabled={deleting === img.id}
                className="absolute top-2 right-2 w-7 h-7 bg-dark/70 hover:bg-danger text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                title="Delete image"
              >
                {deleting === img.id
                  ? <Loader2 size={12} className="animate-spin" />
                  : <Trash2 size={12} strokeWidth={1.5} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
