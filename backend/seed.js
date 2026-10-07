const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Municipio = require('./models/Municipio');
const News = require('./models/News');

dotenv.config();

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Conectado a MongoDB para ejecutar el seed...');

    // Limpiar colecciones de prueba
    await User.deleteMany({});
    await Municipio.deleteMany({});
    await News.deleteMany({});

    // 1. Crear Usuario Super Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin1234', salt);

    const adminUser = await User.create({
      nombre: 'Augusto Admin',
      email: 'admin@municipios.gob.ar',
      password: hashedPassword,
      rol: 'SUPER_ADMIN',
      municipioAsignado: null
    });
    console.log('✅ Usuario Super Admin creado (admin@municipios.gob.ar / admin1234)');

    // 2. Crear Municipio Base
    const municipioBase = await Municipio.create({
      slug: 'saladas',
      nombre: 'Municipalidad de Saladas',
      slogan: 'Cuna del Héroe Cabral',
      saludo: 'NOTICIAS E INFORMACIÓN OFICIAL',
      descripcion: 'Portal institucional de la Municipalidad de Saladas.',
      logoUrl: '/logos/saladas-logo.png',
      colorPrimario: '#0284c7',
      colorSecundario: '#0f172a',
      layoutType: 'layout_moderno',
      headerType: 'header_inline',
      activo: true
    });
    console.log('✅ Municipio "Saladas" creado');

    // 3. Crear una noticia inicial de prueba
    await News.create({
      municipioId: 'saladas',
      titulo: 'Inauguración de obras en el casco urbano',
      subtitulo: 'Se presentaron las nuevas luminarias LED y pavimentación.',
      contenidoMarkdown: '## Nueva infraestructura para la ciudad\n\nEl intendente junto a las autoridades locales habilitaron los nuevos tramos de pavimentación e iluminación LED...',
      categoria: 'GESTIÓN',
      imagenPrincipal: '/news_saladas/noticia1.jpg',
      destacada: true,
      publicado: true
    });
    console.log('✅ Noticia de prueba creada para Saladas');

    console.log('🚀 Seed completado con éxito');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando el seed:', error);
    process.exit(1);
  }
};

runSeed();