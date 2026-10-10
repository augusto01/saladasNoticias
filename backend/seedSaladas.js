const mongoose = require('mongoose');
require('dotenv').config();

// Cambiá la URI por tu cadena de conexión real de Mongo Atlas si no usás .env
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://<usuario>:<password>@cluster0.xxx.mongodb.net/municipios_db?retryWrites=true&w=majority";

const NoticiaSchema = new mongoose.Schema({
  idOriginal: String,
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: '' },
  contenido: { type: String, default: '' },
  imagenPrincipal: { type: String, default: '' },
  categoria: { type: String, required: true, uppercase: true, trim: true },
  municipio: { type: String, required: true, lowercase: true, trim: true, index: true },
  publicado: { type: Boolean, default: true, index: true },
  fechaPublicacion: { type: Date, default: Date.now, index: -1 },
  vistas: { type: Number, default: 0 },
  galeria: [String],
  videos: [String]
}, { timestamps: true });

const Noticia = mongoose.model('Noticia', NoticiaSchema);

const noticiasSaladas = [
  {
    "idOriginal": "28-08-2026-1",
    "titulo": "Violencia de género: una cabo de Policía permanece internada tras sufrir una brutal agresión",
    "subtitulo": "La mujer habría sido atacada por su pareja luego de participar de los festejos por el Día de la Policía en Saladas. Sufrió graves lesiones en rostro y cráneo. Su familia desmintió el alta médica y denunció que el acusado fue liberado bajo fianza.",
    "categoria": "POLICIALES",
    "fechaPublicacion": new Date("2026-08-28"),
    "imagenPrincipal": "/news_saladas/28-08-2026-1.jpeg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "21-08-2026-1",
    "titulo": "El edificio propio del ISFD de Saladas llegó a Diputados: piden informes sobre el avance del proyecto",
    "subtitulo": "La Cámara de Diputados de Corrientes giró a comisión un proyecto que solicita información precisa sobre la construcción de la sede propia del ISFD 'María Luisa Román de Frechou', una institución con 800 estudiantes que aún no cuenta con casa propia.",
    "categoria": "EDUCACIÓN",
    "fechaPublicacion": new Date("2026-08-21"),
    "imagenPrincipal": "/news_saladas/21-08-2026-1.jpeg",
    "vistas": 1120,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "18-08-2026-1",
    "titulo": "El papa León XIV visitará la Argentina en noviembre",
    "subtitulo": "El Vaticano confirmó el viaje apostólico de León XIV por Sudamérica. El Sumo Pontífice estará en el país del 8 al 11 de noviembre y recorrerá Buenos Aires, Córdoba y Luján.",
    "categoria": "RELIGIÓN",
    "fechaPublicacion": new Date("2026-08-18"),
    "imagenPrincipal": "/news_saladas/18-08-2026-1.jpeg",
    "vistas": 420,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "29-07-2026-1",
    "titulo": "Recuperaron una motocicleta robada durante un control sobre la Ruta 118",
    "subtitulo": "La Policía de Saladas interceptó un vehículo utilitario que trasladaba una motocicleta con pedido de secuestro activo. Un hombre fue aprehendido y otro logró escapar hacia una zona de montes.",
    "categoria": "LOCALES",
    "fechaPublicacion": new Date("2026-07-29"),
    "imagenPrincipal": "/news_saladas/29-07-2026-1.jpeg",
    "vistas": 310,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "02-09-2026-1",
    "titulo": "El salario mínimo, vital y móvil llegará a $437.000 en abril de 2027",
    "subtitulo": "Tras la falta de acuerdo entre sindicatos y empresarios en el Consejo del Salario, el Gobierno nacional oficializó una suba escalonada del salario mínimo que fija el piso en $383.800 para septiembre y alcanzará los $437.000 en abril de 2027.",
    "categoria": "NACIONALES",
    "fechaPublicacion": new Date("2026-09-02"),
    "imagenPrincipal": "/news_saladas/02-09-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "29-08-2026-1",
    "titulo": "Saladas: rescataron a un oso melero que estaba en la Terminal",
    "subtitulo": "Bomberos Voluntarios y personal municipal rescataron sano y salvo a un ejemplar de oso melero que se encontraba refugiado en un árbol del predio de la Terminal de Saladas, para su posterior restitución al hábitat natural.",
    "categoria": "LOCALES",
    "fechaPublicacion": new Date("2026-08-29"),
    "imagenPrincipal": "/news_saladas/29-08-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "14-08-2026-1",
    "titulo": "Estudiantes del colegio Normal de Saladas recorrieron la ciudad de Corrientes",
    "subtitulo": "Alumnos de la división Ciencias Sociales de la Escuela Normal de Saladas, ganadores de la Expo Mundialista, viajaron a Corrientes Capital para realizar un circuito educativo por La Unidad, Casa Iberá y el Centro Cultural Sanmartiniano.",
    "categoria": "TURISMO Y CULTURA",
    "fechaPublicacion": new Date("2026-08-14"),
    "imagenPrincipal": "/news_saladas/14-08-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "23-07-2026-1",
    "titulo": "Saladas realizó limpieza y mantenimiento de los principales desagües",
    "subtitulo": "Como medida preventiva ante el fenómeno de El Niño, el Municipio de Saladas ejecuta tareas de limpieza, desmalezamiento y retiro de sedimentos en los canales de desagüe pluvial sobre las Rutas Nacionales 12 y 118.",
    "categoria": "LOCALES",
    "fechaPublicacion": new Date("2026-07-23"),
    "imagenPrincipal": "/news_saladas/23-07-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "02-08-2026-1",
    "titulo": "Saladas se prepara para homenajear a los Granaderos Correntinos y Saladeños",
    "subtitulo": "Saladas conmemora el Día Provincial del Granadero Correntino y el Día del Granadero Saladeño en honor al Sargento Cabral con vigilia, desfile cívico-militar y un festival popular con entrada libre y gratuita en Plaza Cabral.",
    "categoria": "LOCALES",
    "fechaPublicacion": new Date("2026-08-02"),
    "imagenPrincipal": "/news_saladas/02-08-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "02-09-2026-2",
    "titulo": "Saladas participa del 4° Congreso Ecoturístico del Litoral",
    "subtitulo": "Con más de mil asistentes, comenzó en Corrientes Capital el 4° Congreso Ecoturístico del Litoral. Saladas participa representada por el intendente Noel Gómez y su equipo de Turismo para fortalecer la articulación en el área de influencia del Iberá.",
    "categoria": "TURISMO",
    "fechaPublicacion": new Date("2026-09-02"),
    "imagenPrincipal": "/news_saladas/02-09-2026-2.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "01-09-2026-1",
    "titulo": "Nuevos vecinos recibieron sus Certificados Únicos de Discapacidad",
    "subtitulo": "En el Centro Cultural 'Sargento Juan Bautista Cabral', el Municipio de Saladas y el Ministerio de Salud Pública de la Provincia concretaron una nueva entrega del Certificado Único de Discapacidad (CUD) a familias locales.",
    "categoria": "SOCIEDAD",
    "fechaPublicacion": new Date("2026-09-01"),
    "imagenPrincipal": "/news_saladas/01-09-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "29-08-2026-2",
    "titulo": "Saladas fue sede del Primer Encuentro Zonal de Adultos Mayores",
    "subtitulo": "La plaza Cabral de Saladas reunió a delegaciones de diez localidades de la región en el Primer Encuentro Zonal de Adultos Mayores, con desfile de sombreros creativos, sorteos, reconocimientos y el show en vivo de Piedra Marina.",
    "categoria": "SOCIEDAD",
    "fechaPublicacion": new Date("2026-08-29"),
    "imagenPrincipal": "/news_saladas/29-08-2026-2.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "03-08-2026-1",
    "titulo": "Saladas vivió una histórica celebración del Día Provincial del Granadero Correntino y del Día del Granadero Saladeño",
    "subtitulo": "Con la presencia del gobernador Juan Pablo Valdés y el intendente Noel Gómez, Saladas rindió tributo al sargento Juan Bautista Cabral con acto protocolar, ofrenda floral en el Museo Histórico, desfile cívico-militar y festival de cierre con Los de Imaguaré.",
    "categoria": "HISTORIA Y CULTURA",
    "fechaPublicacion": new Date("2026-08-03"),
    "imagenPrincipal": "/news_saladas/03-08-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "04-09-2026-1",
    "titulo": "Saladas participó del 4° Congreso Ecoturístico del Litoral",
    "subtitulo": "El intendente Noel Gómez encabezó la comitiva saladeña en el 4° Congreso Ecoturístico del Litoral en Corrientes Capital, consolidando la integración de la localidad dentro de los circuitos del Iberá y el trabajo conjunto regional.",
    "categoria": "TURISMO",
    "fechaPublicacion": new Date("2026-09-04"),
    "imagenPrincipal": "/news_saladas/04-09-2026-1.jpg",
    "vistas": 3,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "05-09-2026-1",
    "titulo": "Se realizó una jornada de capacitación y concientización sobre Obstetricia",
    "subtitulo": "En el Centro Cultural 'Sargento Cabral', el Municipio de Saladas junto al Hospital María Auxiliadora y el Instituto Santa Rita realizaron una jornada sobre el cuidado integral en el embarazo, parto y puerperio.",
    "categoria": "SALUD",
    "fechaPublicacion": new Date("2026-09-05"),
    "imagenPrincipal": "/news_saladas/05-09-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "11-09-2026-1",
    "titulo": "Se realizó el acto central por el Día del Maestro en Saladas",
    "subtitulo": "En la Casa del Bicentenario del barrio Estación, la comunidad educativa de Saladas celebró el Día del Maestro con distinciones a docentes destacados, discursos alusivos y la actuación de la Orquesta Municipal.",
    "categoria": "EDUCACIÓN",
    "fechaPublicacion": new Date("2026-09-11"),
    "imagenPrincipal": "/news_saladas/11-09-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "14-09-2026-1",
    "titulo": "El ICAP ya funciona en Saladas como espacio de abordaje y prevención",
    "subtitulo": "El Instituto Correntino de Abordaje y Prevención (ICAP) coordina acciones con la Secretaría de Acción Social de Saladas para brindar asistencia interdisciplinaria en psicología y trabajo social.",
    "categoria": "SALUD",
    "fechaPublicacion": new Date("2026-09-14"),
    "imagenPrincipal": "/news_saladas/14-09-2026-1.jpg",
    "vistas": 1,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "16-09-2026-1",
    "titulo": "Habló la cabo agredida en Saladas: denunció violencia de género y acoso de su superior",
    "subtitulo": "Mariela Ayala, cabo de la Policía en Saladas, relató la brutal golpiza sufrida a manos de su expareja y ratificó la denuncia por abuso de autoridad contra su superior. Reclamó por la lentitud judicial y la carátula de la causa.",
    "categoria": "POLICIALES",
    "fechaPublicacion": new Date("2026-09-16"),
    "imagenPrincipal": "/news_saladas/16-09-2026-1.jpg",
    "vistas": 1,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "12-09-2026-1",
    "titulo": "Saladas: desarticulan puntos de narcomenudeo tras dos allanamientos con tres aprehendidos",
    "subtitulo": "En operativos nocturnos simultáneos, la Policía secuestró marihuana, cocaína, más de $360.000 en efectivo, motocicletas, celulares y armas blancas en Saladas. Tres personas quedaron a disposición judicial.",
    "categoria": "POLICIALES",
    "fechaPublicacion": new Date("2026-09-12"),
    "imagenPrincipal": "/news_saladas/12-09-2026-1.jpg",
    "vistas": 126,
    "galeria": [
      "/news_saladas/12-09-2026-1-1.jpg",
      "/news_saladas/12-09-2026-1-2.jpg"
    ],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "19-09-2026-1",
    "titulo": "El operativo 'Ver para ser Libres' brindó atención oftalmológica y anteojos gratuitos en Saladas",
    "subtitulo": "Niños y jóvenes de 6 a 17 años accedieron a controles de agudeza visual y entrega gratuita de anteojos en el CIC del barrio Estación, en un operativo conjunto entre Nación, Provincia, la UNNE y el Municipio de Saladas.",
    "categoria": "SALUD",
    "fechaPublicacion": new Date("2026-09-19"),
    "imagenPrincipal": "/news_saladas/19-09-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "20-09-2026-1",
    "titulo": "El Municipio de Saladas acompañó el acto por el Día del Profesor y la jubilación de la Prof. Sandra Dovis",
    "subtitulo": "En el ISFD 'María Luisa Román de Frechou', autoridades comunales encabezadas por el intendente Noel Gómez compartieron la conmemoración docente y rindieron homenaje a la trayectoria educativa de la profesora Sandra Dovis por su jubilación.",
    "categoria": "EDUCACIÓN",
    "fechaPublicacion": new Date("2026-09-20"),
    "imagenPrincipal": "/news_saladas/20-09-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "21-09-2026-1",
    "titulo": "Saladas se prepara para recibir el Torneo Clausura de Taekwondo ITF en el Club Antorcha",
    "subtitulo": "El domingo 11 de octubre, el Club Antorcha recibirá el Torneo Clausura de Taekwondo ITF con competidores de toda la provincia, la región y países limítrofes. Autoridades municipales, directivos del club y la ACAST ultimaron detalles logísticos.",
    "categoria": "DEPORTES",
    "fechaPublicacion": new Date("2026-09-21"),
    "imagenPrincipal": "/news_saladas/21-09-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "22-09-2026-1",
    "titulo": "Presentaron la XXIII Fiesta Provincial de la Miel y el Desarrollo Emprendedor en Saladas",
    "subtitulo": "La tradicional fiesta se desarrollará el 17 y 18 de octubre en el Complejo Turístico Municipal. Incluirá la 5ª Expo Saladas, el primer Concurso Regional de Mieles, visitas al Apiario Municipal, elección de la Reina y una gran grilla artística.",
    "categoria": "CULTURA",
    "fechaPublicacion": new Date("2026-09-22"),
    "imagenPrincipal": "/news_saladas/22-09-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "22-09-2026-2",
    "titulo": "Inauguraron un mural y descubrieron una placa conmemorativa en homenaje a Juan Bautista Alberdi en Saladas",
    "subtitulo": "En el Paseo La Estación, la Municipalidad de Saladas y el Colegio Público de Abogados descubrieron un busto, mural y placa conmemorativa para honrar al prócer y padre de la Constitución Nacional.",
    "categoria": "CULTURA",
    "fechaPublicacion": new Date("2026-09-22"),
    "imagenPrincipal": "/news_saladas/22-09-2026-2.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "28-09-2026-1",
    "titulo": "Saladas celebró la 5ª Fiesta del Estudiante y la Primavera en la plaza Cabral",
    "subtitulo": "Con una multitudinaria convocatoria en la plaza central, la comunidad celebró la llegada de la primavera con shows en vivo, desfile de reinitas y la coronación de las nuevas soberanas estudiantiles entre 17 postulantes.",
    "categoria": "CULTURA",
    "fechaPublicacion": new Date("2026-09-28"),
    "imagenPrincipal": "/news_saladas/28-09-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "28-09-2026-2",
    "titulo": "Gran noche de básquet en Saladas: Regatas se impuso ante Comunicaciones y se quedó con la 'Copa Ciudad de Saladas'",
    "subtitulo": "En un colmado estadio del Club Atlético Saladas, Regatas Corrientes superó 79-70 a Comunicaciones de Mercedes en un duelo de preparación de cara a sus competencias nacionales. Las autoridades comunales entregaron la copa en disputa.",
    "categoria": "DEPORTES",
    "fechaPublicacion": new Date("2026-09-28"),
    "imagenPrincipal": "/news_saladas/28-09-2026-2.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "01-10-2026-1",
    "titulo": "Nuevo operativo gratuito de DNI acercó trámites de documentación a los vecinos del barrio Vélez Sarsfield",
    "subtitulo": "En el Salón Comunitario del barrio Vélez Sarsfield se llevó a cabo una jornada de documentación sin costo. Los vecinos gestionaron renovaciones y cambios de domicilio junto a autoridades del Registro Provincial de las Personas.",
    "categoria": "SOCIEDAD",
    "fechaPublicacion": new Date("2026-10-01"),
    "imagenPrincipal": "/news_saladas/01-10-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "01-10-2026-2",
    "titulo": "Capacitación y entrega de kits del programa 'Detectar Dengue' en Saladas",
    "subtitulo": "En el Centro Cultural Sargento Cabral se capacitó a equipos territoriales y vecinos del paraje Paso Naranjo sobre prevención y control de vectores. La Provincia entregó kits para fortalecer el bloqueo del mosquito transmisor.",
    "categoria": "SALUD",
    "fechaPublicacion": new Date("2026-10-01"),
    "imagenPrincipal": "/news_saladas/01-10-2026-2.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "03-10-2026-1",
    "titulo": "El Municipio de Saladas y la Escuela Especial N° 14 coordinan actividades por el Mes de la Inclusión",
    "subtitulo": "El intendente Noel Gómez recibió a directivos y docentes de la Escuela Especial N° 14 'Prof. Graciela Itatí Escobar' para planificar la agenda comunitaria de concientización e integración durante octubre.",
    "categoria": "EDUCACIÓN",
    "fechaPublicacion": new Date("2026-10-03"),
    "imagenPrincipal": "/news_saladas/03-10-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "04-10-2026-1",
    "titulo": "Se realizó en Saladas la segunda Feria de Intercambio de Semillas, Saberes y Sabores",
    "subtitulo": "En el Paseo de los Artesanos, productores de la agricultura familiar, escuelas agrotécnicas, INTA, INCUPO y Ferias Francas compartieron una jornada de intercambio de semillas nativas, saberes ancestrales y platos tradicionales.",
    "categoria": "PRODUCCIÓN",
    "fechaPublicacion": new Date("2026-10-04"),
    "imagenPrincipal": "/news_saladas/04-10-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "04-10-2026-2",
    "titulo": "Music Evolution celebró 20 años de historia con una multitudinaria noche en el Complejo Turístico Municipal",
    "subtitulo": "El emblemático festival de la Escuela Normal 'María Luisa Román de Frechou' conmemoró dos décadas reuniendo a estudiantes, familias y docentes. Por primera vez se realizó al aire libre en el Complejo Turístico con presentaciones de los 60 a los 90.",
    "categoria": "CULTURA",
    "fechaPublicacion": new Date("2026-10-04"),
    "imagenPrincipal": "/news_saladas/04-10-2026-2.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "05-10-2026-1",
    "titulo": "Saladas inauguró el programa provincial 'La Unidad nos Acerca' con una multitudinaria muestra en Corrientes Capital",
    "subtitulo": "La ciudad fue la primera en participar del programa de la Subsecretaría de Asuntos Municipales en el predio 'La Unidad'. Desplegó su oferta turística, artesanías, apicultura, danzas, desfile de soberanas y el lanzamiento formal de la Fiesta Provincial de la Miel.",
    "categoria": "CULTURA",
    "fechaPublicacion": new Date("2026-10-05"),
    "imagenPrincipal": "/news_saladas/05-10-2026-1.jpg",
    "vistas": 0,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "23-09-2026-1",
    "titulo": "Tragedia en Saladas: un joven juntaba tacuaras para una actividad escolar, recibió una descarga eléctrica y murió",
    "subtitulo": "Ezequiel Romero (23) falleció en la zona de Primera Sección Lomas al hacer contacto una tacuara con una línea de media tensión mientras recolectaba material para un evento escolar junto a su pareja.",
    "categoria": "POLICIALES",
    "fechaPublicacion": new Date("2026-09-23"),
    "imagenPrincipal": "/news_saladas/23-09-2026-1.jpg",
    "vistas": 124,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "29-09-2026-1",
    "titulo": "Saladas: la Policía detuvo a dos hombres que intentaron robar en una vivienda",
    "subtitulo": "Efectivos de la Dirección de Investigación Criminal de la Comisaría de Distrito Saladas aprehendieron a dos hombres mayores de edad tras ser alertados por la dueña de una casa sobre un intento de robo.",
    "categoria": "POLICIALES",
    "fechaPublicacion": new Date("2026-09-29"),
    "imagenPrincipal": "/news_saladas/29-09-2026-1.jpg",
    "vistas": 120,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  },
  {
    "idOriginal": "03-10-2026-2",
    "titulo": "Saladas: fueron a cumplir una exclusión de hogar por violencia familiar y hallaron cocaína, marihuana y dinero",
    "subtitulo": "Durante un allanamiento ordenado por la Justicia en calle Coronel Leyes por una causa de violencia familiar, la Policía secuestró estupefacientes, dinero e insumos de fraccionamiento. Un joven de 23 años quedó detenido.",
    "categoria": "POLICIALES",
    "fechaPublicacion": new Date("2026-10-03"),
    "imagenPrincipal": "/news_saladas/03-10-2026-2.jpg",
    "vistas": 159,
    "galeria": [],
    "videos": [],
    "municipio": "saladas",
    "publicado": true
  }
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB Atlas...');
    
    // Opcional: Elimina noticias anteriores de Saladas para evitar duplicados
    await Noticia.deleteMany({ municipio: 'saladas' });
    console.log('Noticias anteriores de Saladas limpiadas.');

    const resultado = await Noticia.insertMany(noticiasSaladas);
    console.log(`¡Éxito! Se insertaron ${resultado.length} noticias para Saladas.`);

    process.exit(0);
  } catch (error) {
    console.error('Error al insertar las noticias:', error);
    process.exit(1);
  }
}

seedDB();