const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Verificación para ayudar a depurar problemas de configuración
if (!CLOUD_NAME || !UPLOAD_PRESET) {
  throw new Error(
    'Error de configuración: Asegúrate de que VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET están definidos en tu archivo .env'
  );
}

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const uploadImageToCloudinary = async (
  file: File
): Promise<{ secure_url: string; public_id: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      // Si la respuesta no es exitosa (ej. 4xx, 5xx), lanza un error
      const errorText = await response.text();
      throw new Error(`Error del servidor de Cloudinary: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`Error de Cloudinary: ${data.error.message}`);
    }
    return { secure_url: data.secure_url, public_id: data.public_id }; // Retorna un objeto con ambos datos
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error);
    throw new Error('No se pudo subir la imagen.');
  }
};