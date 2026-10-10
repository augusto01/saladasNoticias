// 1. PRIMERO declaramos el objeto de municipios
export const municipios = {
  saladas: {
    id: 'saladas',
    slug: 'saladas',
    nombre: 'Municipalidad de Saladas',
    logo: '/img/logos/saladas.png'
  },
  santarosa: {
    id: 'santarosa',
    slug: 'santarosa',
    nombre: 'Municipalidad de Santa Rosa',
    logo: '/img/logos/01_Logotipo.png'
  },
  seguitucorrientes: {
    id: 'seguitucorrientes',
    slug: 'seguitucorrientes',
    nombre: 'Seguí Tu Corrientes',
    logo: '/img/logos/01_Logotipo.png'
  }
};

// 2. DESPUÉS obtenemos la clave desde la variable de entorno
const claveMunicipio = (
  import.meta.env.VITE_MUNICIPIO || 
  import.meta.env.VITE_MUNICIPIO_ID || 
  'saladas'
).toLowerCase().trim();

// 3. FINALLY exportamos la configuración activa asegurando el fallback a saladas
export const configActual = municipios[claveMunicipio] || municipios.saladas;