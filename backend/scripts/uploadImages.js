import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const BUCKET_NAME = process.env.SUPABASE_BUCKET || 'noticias-imagenes';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: No se encontraron SUPABASE_URL o SUPABASE_KEY en el .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Apunta a la carpeta public de la carpeta frontend
const PUBLIC_FOLDER = path.resolve(__dirname, '../../frontend/public');

async function processFolder(currentPath) {
  if (!fs.existsSync(currentPath)) {
    console.error(`❌ La carpeta no existe: ${currentPath}`);
    return;
  }

  const items = fs.readdirSync(currentPath);

  for (const item of items) {
    const fullPath = path.join(currentPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recorre subcarpetas (img, news_saladas, news_corrientes, etc.)
      await processFolder(fullPath);
    } else {
      const ext = path.extname(item).toLowerCase();

      if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) {
        const fileBuffer = fs.readFileSync(fullPath);
        
        // Mantiene la estructura de carpetas (ej: news_saladas/1.jpg)
        const relativePath = path.relative(PUBLIC_FOLDER, fullPath).replace(/\\/g, '/');

        console.log(`Subiendo: ${relativePath}...`);

        const contentType = ext === '.jpg' ? 'image/jpeg' : `image/${ext.replace('.', '')}`;

        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(relativePath, fileBuffer, {
            contentType,
            upsert: true // Sobrescribe si ya existe en el bucket
          });

        if (error) {
          console.error(`❌ Error al subir ${relativePath}:`, error.message);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(relativePath);

          console.log(`✅ Subida OK: ${publicUrlData.publicUrl}`);
        }
      }
    }
  }
}

console.log(`🚀 Buscando imágenes en: ${PUBLIC_FOLDER}`);
console.log('🚀 Subiendo carpetas de fotos a Supabase Storage...');

processFolder(PUBLIC_FOLDER)
  .then(() => console.log('🎉 Migración de fotos finalizada con éxito.'))
  .catch((err) => console.error('Error durante la migración:', err));