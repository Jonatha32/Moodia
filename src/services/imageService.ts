const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Verificación para ayudar a depurar problemas de configuración
if (!CLOUD_NAME || !UPLOAD_PRESET) {
  throw new Error(
    'Error de configuración: Asegúrate de que VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET están definidos en tu archivo .env'
  );
}

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('transformation', 'c_fill,w_800,h_800,q_auto,f_auto'); // Optimización automática

  try {
    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error del servidor de Cloudinary: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`Error de Cloudinary: ${data.error.message}`);
    }
    return data.secure_url; // Solo retorna la URL
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error);
    throw new Error('No se pudo subir la imagen.');
  }
};

// Función específica para fotos de perfil con recorte circular
export const uploadProfileImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('transformation', 'c_fill,w_400,h_400,g_face,r_max,q_auto,f_auto'); // Circular y centrado en cara

  try {
    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error del servidor de Cloudinary: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`Error de Cloudinary: ${data.error.message}`);
    }
    return data.secure_url;
  } catch (error) {
    console.error('Error al subir la imagen de perfil:', error);
    throw new Error('No se pudo subir la imagen de perfil.');
  }
};