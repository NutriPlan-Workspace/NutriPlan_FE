import { CLOUDINARY_CONFIG } from '@/configs/cloudinary';

export const createUploadFormData = (file: File, folder?: string): FormData => {
  const formData = new FormData();
  const publicId = `${Date.now()}`;

  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
  const targetFolder = folder ?? CLOUDINARY_CONFIG.UPLOAD_FOLDER;
  if (targetFolder) formData.append('folder', targetFolder);
  formData.append('public_id', publicId);
  formData.append('filename_override', `${publicId}.jpg`);

  return formData;
};
