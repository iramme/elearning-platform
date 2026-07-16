const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload direct d'un fichier vers Cloudinary, sans passer par notre backend.
 * Évite les problèmes de mémoire serveur (RAM limitée sur les plans gratuits).
 */
export async function uploadToCloudinary(file, resourceType = 'video') {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Échec de l'upload vers Cloudinary");
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    duration: data.duration ? Math.round(data.duration) : 0,
  };
}