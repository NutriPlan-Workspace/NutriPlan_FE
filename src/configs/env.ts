export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  // Optional: set destination folder for Cloudinary uploads
  // e.g. "UploadforNutriplan" or "parent/child"
  UPLOAD_FOLDER: import.meta.env.VITE_CLOUDINARY_UPLOAD_FOLDER,

  // Optional NutriBot animated avatar URLs (GIF/WebP/Lottie hosted somewhere)
  // If unset, the chatbot falls back to a simple inline SVG.
  // New 5-state mapping
  NUTRIBOT_HELLO_URL: import.meta.env.VITE_NUTRIBOT_HELLO_URL,
  NUTRIBOT_SAD_URL: import.meta.env.VITE_NUTRIBOT_SAD_URL,
  NUTRIBOT_IDLE_URL: import.meta.env.VITE_NUTRIBOT_IDLE_URL,
  NUTRIBOT_DONE_URL: import.meta.env.VITE_NUTRIBOT_DONE_URL,
  NUTRIBOT_NEUTRAL_URL: import.meta.env.VITE_NUTRIBOT_NEUTRAL_URL,

  // Backward-compat (old names)
  NUTRIBOT_THINKING_URL: import.meta.env.VITE_NUTRIBOT_THINKING_URL,
  NUTRIBOT_TALKING_URL: import.meta.env.VITE_NUTRIBOT_TALKING_URL,
  NUTRIBOT_HAPPY_URL: import.meta.env.VITE_NUTRIBOT_HAPPY_URL,
};
