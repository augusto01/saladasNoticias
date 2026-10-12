// Configuración global de municipios multitenant
// Configuración global de municipios multitenant
export const municipios = {
  saladas: {
    id: 'saladas',
    slug: 'saladas',
    nombre: 'Municipalidad de Saladas',
    logo: '/img/logos/saladaslogo.png',
    colores: {
      primary: '#cca010',   // Dorado / Amarillo principal
      secondary: '#a17917', // Marrón / Dorado oscuro
      accent: '#fdfbf7',    // Crema de fondo
      dark: '#1e293b'
    }
  },
  santarosa: {
    id: 'santarosa',
    slug: 'santarosa',
    nombre: 'Municipalidad de Santa Rosa',
    logo: '/img/logos/santarosalogo.png',
    colores: {
      primary: '#dc2626',   // Rojo principal
      secondary: '#b91c1c', // Rojo oscuro
      accent: '#fef2f2',    // Fondo suave rosado/blanco
      dark: '#0f172a'
    }
  },
  seguitucorrientes: {
    id: 'seguitucorrientes',
    slug: 'seguitucorrientes',
    nombre: 'Seguí Tu Corrientes',
    logo: '/img/logos/01_Logotipo.png',
    colores: {
      primary: '#0284c7',
      secondary: '#0369a1',
      accent: '#f0f9ff',
      dark: '#0f172a'
    }
  },
  corrientes: {
    id: 'corrientes',
    slug: 'corrientes',
    nombre: 'Enfoque Corrientes',
    logo: '/img/logos/enfoquecorrienteslogo.png',
    colores: {
      primary: '#417913',
      secondary: '#22df18',
      accent: '#fff1f2',
      dark: '#0f172a'
    }
  },
  ituzaingo: {
    id: 'ituzaingo',
    slug: 'primiciasituzaingo',
    nombre: 'Primicias Ituzaingó',
    logo: '/img/logos/ituzaingologo.png',
    colores: {
      primary: '#0d9488',
      secondary: '#0f766e',
      accent: '#f0fdfa',
      dark: '#0f172a'
    }
  },
  nornoticiasya: {
    id: 'nornoticiasya',
    slug: 'nornoticiasya',
    nombre: 'NORNOTICIASYA',
    logo: '/img/logos/nornoticiasya.png',
    colores: {
      primary: '#8cf043',   // Verde lima
      secondary: '#121e2b', // Azul oscuro
      accent: '#f4f6f8',    // Fondo claro
      dark: '#121e2b'
    }
  },
  primiciascorrientes: {
    id: 'primiciascorrientes',
    slug: 'primiciascorrientes',
    nombre: 'PRIMICIAS CORRIENTES',
    logo: '/img/logos/primiciascorrienteslogo.png',
    colores: {
      primary: '#e11d20',   // Rojo vivo
      secondary: '#171a1d', // Negro / Antracita
      accent: '#f8fafc',    // Fondo claro
      dark: '#0f172a'
    }
  },
  laprimicianordeste: {
    id: 'laprimicianordeste',
    slug: 'laprimicianordeste',
    nombre: 'LA PRIMICIA NORDESTE',
    logo: '/img/logos/laprimicianordeste.png',
    colores: {
      primary: '#bf6216',   // Dorado / Ochre cálido
      secondary: '#3b0a0a', // Bordó / Borravino oscuro
      accent: '#faf8f5',    // Fondo crema claro
      dark: '#240505'
    }
  },

  redmesopotamialdia: {
    id: 'redmesopotamialdia',
    slug: 'redmesopotamialdia',
    nombre: 'RED MESOPOTAMIA AL DÍA',
    logo: '/img/logos/redmesopotamialdia.png',
    colores: {
      primary: '#b84c28',   // Terracota
      secondary: '#8c3116', // Terracota oscuro
      accent: '#f8f6f0',    // Arena / Crema
      dark: '#2d140b'
    }
  },
  enteratecorrientes: {
    id: 'enteratecorrientes',
    slug: 'enteratecorrientes',
    nombre: 'ENTERATE CORRIENTES',
    logo: '/img/logos/enteratecorrientes.png',
    colores: {
      primary: '#e60067',   // Magenta / Rosa Neón
      secondary: '#4a0040', // Púrpura oscuro
      accent: '#fdf2f8',    // Rosa suave para fondos
      dark: '#260021'
    }
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