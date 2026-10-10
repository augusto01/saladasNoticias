// src/config/municipios.js

export const MUNICIPIOS = {
  saladas: {
    id: "saladas",
    nombre: "Saladas",
    portal: "Saladas Noticias",
    saludo: "¡Hola Saladeño!",
    slogan: "Noticias de Saladas",
    descripcion: "Mantente al día con las últimas novedades, obras y eventos de nuestra querida ciudad de Saladas.",
    colorPrimario: "#a29118",   // Azul institucional
    colorSecundario: "#070100",
    colorAccento: "#f59e0b",
    logo: "/img/logos/saladaslogo.png"
  },
  ituzaingo: {
    id: "ituzaingo",
    nombre: "Ituzaingó",
    portal: "Primicias Ituzaingó",
    saludo: "¡Hola Ituzaingueño!",
    slogan: "Primicias Ituzaingó",
    descripcion: "Toda la información oficial, primicias, obras y eventos de la ciudad de Ituzaingó.",
    colorPrimario: "#001343",   // Verde institucional
    colorSecundario: "#008fff",
    colorAccento: "#f9f8f6",
    logo: "/img/logos/ituzaingologo.png"
  },
  santarosa: {
    id: "santarosa",
    nombre: "Santa Rosa",
    portal: "Santa Rosa Noticias",
    saludo: "¡Hola Santarroseño!",
    slogan: "Santa Rosa Noticias",
    descripcion: "Toda la actualidad, información municipal y novedades de la comunidad de Santa Rosa.",
    colorPrimario: "#ff0000",   // Rojo cálido
    colorSecundario: "#000000",
    colorAccento: "#9ca2a5",
    logo: "/img/logos/santarosalogo.png"
  },
  corrientes: {
    id: "corrientes",
    nombre: "Corrientes",
    portal: "Enfoque Corrientes",
    saludo: "¡Hola Correntino!",
    slogan: "Enfoque Corrientes",
    descripcion: "El portal de noticias con la visión integral de lo que sucede en la provincia y la capital.",
    colorPrimario: "#00360a",   // Rojo institucional
    colorSecundario: "#54d434",
    colorAccento: "#000001",
    logo: "/img/logos/enfoquecorrienteslogo.png"
  },
  seguitucorrientes: {
    id: "seguitucorrientes",
    nombre: "Seguí Tu Corrientes",
    portal: "Seguí Tu Corrientes",
    saludo: "¡Hola Correntino!",
    slogan: "Seguí Tu Corrientes",
    descripcion: "Portal de información y actualidad regional. Enterate de todas las noticias en un solo lugar.",
    colorPrimario: "#002b5c",
    colorSecundario: "#00a8e8",
    colorAccento: "#0f172a",
    logo: "/img/logos/01_Logotipo.png",
    isotipo: "/img/logos/01_Isotipo.png"
  }
};

// Lee la clave del municipio desde el archivo .env (Por defecto usa saladas)
// Lee VITE_MUNICIPIO (el que tenés cargado en Netlify)
const claveMunicipio = (
  import.meta.env.VITE_MUNICIPIO || 
  import.meta.env.VITE_MUNICIPIO_ID || 
  'saladas'
).toLowerCase().trim();

// 2. Usarla para exportar la configuración
export const configActual = municipios[claveMunicipio] || municipios.saladas

