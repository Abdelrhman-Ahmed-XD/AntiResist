const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dyrf3eqtn";
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "antiresist_profiles";

export async function uploadToCloudinary(file, uploadPreset, folder = "", publicId = "") {
  const preset = uploadPreset || PRESET;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  if (folder)   formData.append("folder", folder);
  if (publicId) formData.append("public_id", publicId);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message || `Cloudinary upload failed (${res.status})`);
  }

  return res.json();
}
