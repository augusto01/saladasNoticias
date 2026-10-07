const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Advertencia: Credenciales de Supabase no configuradas en .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Sube un archivo de buffer a Supabase Storage y retorna la URL pública
 */
const uploadToSupabase = async (fileBuffer, fileName, mimeType, folder = 'general') => {
  const bucketName = process.env.SUPABASE_BUCKET || 'noticias-imagenes';
  const filePath = `${folder}/${Date.now()}_${fileName.replace(/\s+/g, '_')}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Error subiendo imagen a Supabase: ${error.message}`);
  }

  // Obtener URL pública directa
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

module.exports = { supabase, uploadToSupabase };