import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";

export const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

/**
 * Returns a <img> element from a Cloudinary public_id.
 * Usage: <CldImg publicId="folder/my-image" width={400} height={300} alt="..." />
 */
export function CldImg({ publicId, width, height, alt = "", className = "" }) {
  const img = cld
    .image(publicId)
    .resize(auto().width(width).height(height).gravity(autoGravity()))
    .format("auto")
    .quality("auto");

  return <AdvancedImage cldImg={img} alt={alt} className={className} />;
}

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * Create an unsigned preset in Cloudinary dashboard → Settings → Upload → Upload Presets.
 *
 * @param {File}   file         - File object from an <input type="file">
 * @param {string} uploadPreset - Your unsigned upload preset name
 * @param {string} folder       - Optional folder path (e.g. "profiles")
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
export async function uploadToCloudinary(file, uploadPreset, folder = "") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
  if (folder) formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Cloudinary upload failed");
  }

  return res.json();
}
