export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  // Optional: set destination folder for Cloudinary uploads
  // e.g. "UploadforNutriplan" or "parent/child"
  UPLOAD_FOLDER: import.meta.env.VITE_CLOUDINARY_UPLOAD_FOLDER,
  AI_SERVICE_URL: import.meta.env.VITE_AI_SERVICE_URL,
};
