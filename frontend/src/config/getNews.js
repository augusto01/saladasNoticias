// src/config/getNews.js
import newsSaladas from '../components/data/saladas/news_saladas.json';
import newsItuzaingo from '../components/data/ituzaingo/news_ituzaingo.json';
import newsSantarosa from '../components/data/santaRosa/news_santarosa.json';
import newsCorrientes from '../components/data/corrientes/news_corrientes.json';

const noticiasPorMunicipio = {
  saladas: newsSaladas,
  ituzaingo: newsItuzaingo,
  santarosa: newsSantarosa,
  corrientes: newsCorrientes
};

const claveMunicipio = import.meta.env.VITE_MUNICIPIO || "saladas";

export const getNoticias = () => {
  return noticiasPorMunicipio[claveMunicipio] || [];
};