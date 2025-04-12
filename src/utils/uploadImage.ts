import { CLOUDINARY_CONFIG } from '@/configs/cloudinary';

export const createUploadFormData = (file: File): FormData => {
  const formData = new FormData();
  const publicId = `${Date.now()}`;

  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
  formData.append('public_id', publicId);
  formData.append('filename_override', `${publicId}.jpg`);

  return formData;
};
