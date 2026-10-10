const mongoose = require('mongoose');
require('dotenv').config();

// Asegurar que conecte a la BD correcta municipios_db si no está en el .env
let MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI && !MONGO_URI.includes('municipios_db') && MONGO_URI.includes('mongodb.net/')) {
  MONGO_URI = MONGO_URI.replace('mongodb.net/', 'mongodb.net/municipios_db');
}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iyvncqiylnhwphqbllyp.supabase.co';
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'noticias-imagenes';

const SUPABASE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}`;

const NewsSchema = new mongoose.Schema({}, { strict: false, collection: 'news' });
const News = mongoose.model('News', NewsSchema);

async function updateImageUrls() {
  try {
    console.log('Conectando a MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Conectado a la BD: "${mongoose.connection.db.databaseName}"`);

    const newsList = await News.find({});
    console.log(`Encontrados ${newsList.length} documentos en la colección 'news'.`);

    let updatedCount = 0;

    for (const item of newsList) {
      const rawImg = item.imagenPrincipal;

      if (rawImg && typeof rawImg === 'string' && !rawImg.startsWith('http')) {
        // Convierte "/news_saladas/28-08-2026-1.jpeg" en "news_saladas/28-08-2026-1.jpeg"
        const cleanPath = rawImg.replace(/^\//, '');
        const newUrl = `${SUPABASE_BASE_URL}/${cleanPath}`;

        await News.updateOne(
          { _id: item._id },
          { $set: { imagenPrincipal: newUrl } }
        );

        updatedCount++;
        console.log(`[+] [${updatedCount}] Actualizado ID ${item._id} -> ${newUrl}`);
      }
    }

    console.log(`\n🎉 ¡Finalizado! Se actualizaron ${updatedCount} noticias con sus URLs de Supabase Storage.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar MongoDB:', error);
    process.exit(1);
  }
}

updateImageUrls();