const mongoose = require('mongoose');
require('dotenv').config();

// Asegura la conexión a la base de datos municipios_db
let MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI && !MONGO_URI.includes('municipios_db') && MONGO_URI.includes('mongodb.net/')) {
  MONGO_URI = MONGO_URI.replace('mongodb.net/', 'mongodb.net/municipios_db');
}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iyvncqiylnhwphqbllyp.supabase.co';
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'noticias-imagenes';
const SUPABASE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}`;

const NewsSchema = new mongoose.Schema({}, { strict: false, collection: 'news' });
const News = mongoose.model('News', NewsSchema);

// Colección completa de datos de noticias de Santa Rosa
const newsData = [
  {
    "id": "22-08-2026-1",
    "municipio": "santarosa",
    "title": "\"Milei, sobre la morosidad: 'La gente se compró teles para el Mundial y después no los pagó'\"",
    "summary": "En el aniversario de la Bolsa de Comercio de Rosario, el presidente rechazó que el aumento de la mora sea por su gestión y atribuyó los incumplimientos a créditos otorgados en 2024.",
    "category": "GESTIÓN",
    "date": "2026-08-22",
    "image": "/news_santarosa/22-08-2026-1/portada1.jpg.webp",
    "views": 18450
  },
  {
    "id": "22-08-2026-2",
    "municipio": "santarosa",
    "title": "\"Se agrava la situación de las familias endeudadas: 'Los gastos aumentan y el salario no acompaña'\"",
    "summary": "Estiman que cerca del 60% de los adultos en Argentina se encuentra endeudado y al menos 6 millones cayeron en morosidad. La organización 'Endeudados organizados' advierte el uso del crédito para comprar alimentos y servicios.",
    "category": "GESTIÓN",
    "date": "2026-08-22",
    "image": "/news_santarosa/22-08-2026-2/portada2.jpg.webp",
    "views": 16210
  },
  {
    "id": "31-08-2026-1",
    "municipio": "santarosa",
    "title": "Juan Pablo Valdés analiza aumento de sueldos y alivio para los morosos: los temas que abordará con el Gobierno Nacional",
    "summary": "En Equipo de Noticias, el gobernador Juan Pablo Valdés destacó el repunte de la coparticipación tras meses de caída, anticipó una nueva etapa del programa 'Corrientes Sostiene' a través del Banco de Corrientes y garantizó futuros aumentos salariales bajo previsibilidad financiera.",
    "category": "PROVINCIALES",
    "date": "2026-08-31",
    "image": "/news_corrientes/31-08-2026-1.jpg",
    "views": 69
  },
  {
    "id": "26-08-2026-1",
    "municipio": "santarosa",
    "title": "Santa Rosa celebra su aniversario y conmemora a su Patrona",
    "summary": "Santa Rosa conmemora su 115° aniversario fundacional y las fiestas patronales el 29 y 30 de agosto con acto cívico-militar, misa, almuerzo comunitario y festival artístico con entrada gratuita en el Polideportivo Municipal.",
    "category": "ACTUALIDAD",
    "date": "2026-08-26",
    "image": "/news_santarosa/26-08-2026-1.jpg",
    "views": 16167
  },
  {
    "id": "01-09-2026-2",
    "municipio": "santarosa",
    "title": "Estrelló su automóvil contra una columna de foto-multa en la Ruta Nacional 118",
    "summary": "Durante la madrugada en Santa Rosa, un joven de 26 años impactó su Chevrolet Corsa contra un tótem de fotomultas y una columna de alumbrado en la Ruta 118. Manifestó haber consumido alcohol y quedó demorado por conducción peligrosa.",
    "category": "POLICIALES",
    "date": "2026-09-01",
    "image": "/news_santarosa/01-09-2026-2.jpg",
    "views": 0
  },
  {
    "id": "29-08-2026-1",
    "municipio": "santarosa",
    "title": "En Santa Rosa el gobernador inauguró un hospital y un cuartel de bomberos",
    "summary": "Durante el 115° aniversario de Santa Rosa, Juan Pablo Valdés inauguró el Hospital 'Dra. María del Carmen Casellas', habilitó el nuevo Cuartel de Bomberos Forestales de la BRIF en el Parque Industrial y entregó una ambulancia 0 km.",
    "category": "PROVINCIALES",
    "date": "2026-08-29",
    "image": "/news_santarosa/29-08-2026-1.jpg",
    "views": 0
  },
  {
    "id": "28-08-2026-1",
    "municipio": "santarosa",
    "title": "Alarma: intendente correntino amenazado por narcos",
    "summary": "El intendente de Santa Rosa, José Dardo Ignacio, denunció haber recibido amenazas de muerte tras una serie de allanamientos policiales que desarticularon cuatro puntos de venta de estupefacientes en la localidad.",
    "category": "POLICIALES",
    "date": "2026-08-28",
    "image": "/news_santarosa/28-08-2026-1.jpg",
    "views": 0
  },
  {
    "id": "28-08-2026-2",
    "municipio": "santarosa",
    "title": "Las zonas de la Argentina con mayor riesgo por El Niño: qué provincias podrían sufrir lluvias extremas e inundaciones",
    "summary": "Ante la consolidación de un fenómeno de El Niño excepcionalmente intenso, el Litoral argentino —con Misiones y Corrientes a la cabeza— se ubica en el nivel máximo de alerta por lluvias recurrentes y crecidas de los ríos Paraná y Uruguay.",
    "category": "ACTUALIDAD",
    "date": "2026-08-28",
    "image": "/news_santarosa/28-08-2026-2.jpg",
    "views": 0
  },
  {
    "id": "04-09-2026-1",
    "municipio": "santarosa",
    "title": "La historia detrás del nombre de Santa Rosa",
    "summary": "La localidad celebra cada 30 de agosto a su santa patrona, Santa Rosa de Lima, la primera santa de América, cuya vida y legado religioso marcaron la identidad comunitaria e histórica del pueblo correntino.",
    "category": "CULTURA E HISTORIA",
    "date": "2026-09-04",
    "image": "/news_santarosa/04-09-2026-1.jpg",
    "views": 0
  },
  {
    "id": "18-08-2026-1",
    "municipio": "santarosa",
    "title": "Hallaron sin vida a un hombre de 53 años a la vera de la RN 118",
    "summary": "El cuerpo de Alfonso Frutos fue encontrado a la altura del kilómetro 90 de la Ruta Nacional 118, a 30 km del casco urbano de Santa Rosa. Se desplazaba en bicicleta y la Justicia investiga las circunstancias de su fallecimiento.",
    "category": "POLICIALES",
    "date": "2026-08-18",
    "image": "/news_santarosa/18-08-2026-1.jpg",
    "views": 0
  },
  {
    "id": "16-09-2026-1",
    "municipio": "santarosa",
    "title": "Santa Rosa fortalece el apoyo a pequeños productores y huertas familiares",
    "summary": "El Municipio de Santa Rosa articula labores de labranza, provisión de semillas y asistencia técnica junto a la Secretaría de Producción y Desarrollo Social para impulsar la economía familiar y la venta local.",
    "category": "PRODUCCIÓN",
    "date": "2026-09-16",
    "image": "/news_santarosa/16-09-2026-1.jpg",
    "views": 0
  },
  {
    "id": "07-10-2026-1",
    "municipio": "santarosa",
    "title": "Un camión con acoplado volcó sobre la Ruta Nacional 118 a la altura del kilómetro 108",
    "summary": "El siniestro vial ocurrió en la noche del martes sobre la RN 118, en jurisdicción de San Miguel. Efectivos de la Comisaría de Distrito Primera de Santa Rosa, bomberos y personal médico intervinieron en el rescate y traslado del chofer.",
    "category": "POLICIALES",
    "date": "2026-10-07",
    "image": "/news_santarosa/07-10-2026-1.jpg",
    "views": 115
  },
  {
    "id": "06-10-2026-1",
    "municipio": "santarosa",
    "title": "Fenómeno de El Niño: la Armada Argentina desplegará buques y medios anfibios en Corrientes y el Litoral",
    "summary": "El Comando del Área Naval Fluvial alista el buque multipropósito ARA 'Ciudad de Zárate', la patrullera ARA 'Punta Mogotes' y vehículos anfibios con base en el puerto de Corrientes para asistir a poblaciones vulnerables ante posibles crecidas e inundaciones.",
    "category": "PROVINCIALES",
    "date": "2026-10-06",
    "image": "/news_corrientes/06-10-2026-1.jpg",
    "views": 135
  },
  {
    "id": "05-10-2026-1",
    "municipio": "santarosa",
    "title": "Allanaron dos viviendas por abigeato y desarticularon un 'delivery' de carne ilegal",
    "summary": "La Policía ejecutó dos órdenes de allanamiento en Santa Rosa en una causa por robo de ganado. Secuestraron 19 bolsas con cortes vacunos comercializados a domicilio, un rifle modificado a calibre .22, proyectiles y detuvieron a un hombre mayor de edad.",
    "category": "POLICIALES",
    "date": "2026-10-05",
    "source": "Radio Sudamericana",
    "image": "/news_santarosa/05-10-2026-1.jpg",
    "views": 98
  },
  {
    "id": "24-09-2026-1",
    "municipio": "santarosa",
    "title": "Opinión | La casta tiene discurso, las pymes tienen la persiana",
    "summary": "A partir de las declaraciones del empresario maderero de Santa Rosa Juan Ramón Sotelo ('A las pymes las paga la gente, no la casta'), una reflexión sobre la distancia entre los discursos de ajuste oficial y la realidad diaria de las pequeñas y medianas empresas.",
    "category": "LOCALES",
    "date": "2026-09-24",
    "source": "Radio Sudamericana",
    "image": "/news_santarosa/24-09-2026-1.jpg",
    "views": 145
  }
];

async function importSantaRosaNews() {
  try {
    console.log('Conectando a la base de datos de MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Conectado exitosamente a: "${mongoose.connection.db.databaseName}"`);

    let count = 0;

    for (const item of newsData) {
      const cleanPath = item.image.replace(/^\//, '');
      const supabaseUrl = `${SUPABASE_BASE_URL}/${cleanPath}`;

      const docToUpsert = {
        idOriginal: item.id,
        municipio: item.municipio,
        titulo: item.title,
        subtitulo: item.summary,
        contenidoMarkdown: item.summary,
        categoria: item.category,
        fechaPublicacion: new Date(item.date),
        imagenPrincipal: supabaseUrl,
        vistas: item.views || 0,
        fuente: item.source || null,
        publicado: true
      };

      await News.updateOne(
        { idOriginal: item.id, municipio: item.municipio },
        { $set: docToUpsert },
        { upsert: true }
      );

      count++;
      console.log(`[+] [${count}/${newsData.length}] Importada (${item.municipio}): "${item.title.substring(0, 40)}..."`);
    }

    console.log(`\n🎉 Migración de Santa Rosa completada. Se guardaron/actualizaron ${count} publicaciones.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al importar noticias de Santa Rosa:', err);
    process.exit(1);
  }
}

importSantaRosaNews();