// src/config/municipios.js

export const MUNICIPIOS = {
  saladas: {
    id: "saladas",
    nombre: "Saladas",
    portal: "Saladas Noticias",
    saludo: "¡Hola Saladeño!",
    slogan: "Noticias de Saladas",
    descripcion: "Mantente al día con las últimas novedades, obras y eventos de nuestra querida ciudad de Saladas.",
    colorPrimario: "#8a851e",   // Azul institucional
    colorSecundario: "#020202",
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
    colorPrimario: "#0217fc",   // Verde institucional
    colorSecundario: "#10b981",
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
    colorPrimario: "#e60c0c",   // Rojo cálido
    colorSecundario: "#000000",
    colorAccento: "#0284c7",
    logo: "/img/logos/santarosalogo.png"
  },
  corrientes: {
    id: "corrientes",
    nombre: "Corrientes",
    portal: "Enfoque Corrientes",
    saludo: "¡Hola Correntino!",
    slogan: "Enfoque Corrientes",
    descripcion: "El portal de noticias con la visión integral de lo que sucede en la provincia y la capital.",
    colorPrimario: "#1f991b",   // Rojo institucional
    colorSecundario: "#61f810",
    colorAccento: "#000001",
    logo: "/img/logos/enfoquecorrienteslogo.png"
  }
};

// Lee la clave del municipio desde el archivo .env (Por defecto usa saladas)
const claveMunicipio = import.meta.env.VITE_MUNICIPIO || "saladas";

export const configActual = MUNICIPIOS[claveMunicipio] || MUNICIPIOS.saladas;