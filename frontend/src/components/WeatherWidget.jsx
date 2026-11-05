import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, ExternalLink } from "lucide-react";
import "../styles/WeatherWidget.css";

// 1. Coordenadas y nombres por localidad
const UBICACIONES = {
  corrientes: { lat: -27.4692, lon: -58.8306, name: "Corrientes" },
  ituzaingo: { lat: -27.5924, lon: -56.6806, name: "Ituzaingó" },
  santarosa: { lat: -28.2647, lon: -58.1172, name: "Santa Rosa" },
};

// 2. Resolver ubicación y variante visual según el dominio / tenant
const obtenerConfiguracionSitio = (tenantProp) => {
  const host = typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";
  const key = (tenantProp || "").toLowerCase();

  // A. ITUZAINGÓ (Estilo Verde Neón / Agua)
  if (
    key.includes("ituzaingo") || 
    key.includes("primiciasituzaingo") || 
    key.includes("elportaldeitu") ||
    host.includes("ituzaingo") || 
    host.includes("elportaldeitu") || 
    host.includes("primiciasituzaingo")
  ) {
    return { ...UBICACIONES.ituzaingo, variant: "theme-ituzaingo" };
  }

  // B. SANTA ROSA (Estilo Cálido / Naranja-Rojo)
  if (
    key.includes("santa") || 
    key.includes("lavozdesantarosa") || 
    key.includes("santarosanoticias") || 
    host.includes("santa") || 
    host.includes("lavozdesantarosa") || 
    host.includes("santarosanoticias")
  ) {
    return { ...UBICACIONES.santarosa, variant: "theme-santarosa" };
  }

  // C. VARIACIONES PARA PORTALES DE CORRIENTES CAPITAL Y REGIONALES
  if (host.includes("sietepuntas") || key.includes("sietepuntas")) {
    return { ...UBICACIONES.corrientes, variant: "theme-sietepuntas" }; // Estilo Minimal Glassmorphism
  }
  if (host.includes("enfoque") || key.includes("enfoque")) {
    return { ...UBICACIONES.corrientes, variant: "theme-enfoque" }; // Estilo Dark Elegante
  }
  if (host.includes("laredcorrentina") || key.includes("laredcorrentina")) {
    return { ...UBICACIONES.corrientes, variant: "theme-lared" }; // Estilo Azul Corporativo
  }
  if (host.includes("aldiaporctes") || key.includes("aldiaporctes")) {
    return { ...UBICACIONES.corrientes, variant: "theme-aldia" }; // Estilo Modern Light/Dark Border
  }

  // Estilo Default para el resto
  return { ...UBICACIONES.corrientes, variant: "theme-default" };
};

export default function WeatherWidget({ tenant }) {
  const configuracion = obtenerConfiguracionSitio(tenant);
  const { lat, lon, name: CITY_NAME, variant } = configuracion;

  const [weather, setWeather] = useState({
    temp: null,
    code: null,
    loading: true,
    error: false,
  });

  const WEATHER_EXTERNAL_URL = `https://weather.com/es-AR/tiempo/hoy/l/${lat},${lon}`;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeather((prev) => ({ ...prev, loading: true, error: false }));
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        if (!response.ok) throw new Error("Error fetching weather");
        
        const data = await response.json();
        setWeather({
          temp: Math.round(data.current_weather.temperature),
          code: data.current_weather.weathercode,
          loading: false,
          error: false,
        });
      } catch (err) {
        console.error("Error cargando el clima:", err);
        setWeather((prev) => ({ ...prev, loading: false, error: true }));
      }
    };

    fetchWeather();
  }, [lat, lon]);

  const getWeatherDetails = (code) => {
    if (code === 0) return { label: "Despejado", icon: <Sun className="weather-icon sun" />, stateClass: "state-sun" };
    if ([1, 2, 3].includes(code)) return { label: "Nublado", icon: <Cloud className="weather-icon cloud" />, stateClass: "state-cloud" };
    if ([45, 48].includes(code)) return { label: "Niebla", icon: <Cloud className="weather-icon cloud" />, stateClass: "state-cloud" };
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { label: "Lluvia", icon: <CloudRain className="weather-icon rain" />, stateClass: "state-rain" };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Nieve", icon: <CloudSnow className="weather-icon snow" />, stateClass: "state-cloud" };
    if ([95, 96, 99].includes(code)) return { label: "Tormenta", icon: <CloudLightning className="weather-icon storm" />, stateClass: "state-storm" };
    return { label: "Clima", icon: <Sun className="weather-icon sun" />, stateClass: "state-sun" };
  };

  const details = getWeatherDetails(weather.code);

  return (
    <a
      href={WEATHER_EXTERNAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="weather-card-link"
      title={`Pronóstico en ${CITY_NAME}`}
    >
      <div className={`weather-card ${variant} ${details.stateClass}`}>
        <div className="weather-header">
          <span className="weather-city">{CITY_NAME}</span>
          <ExternalLink size={13} className="weather-external-icon" />
        </div>

        {weather.loading ? (
          <div className="weather-status">Cargando clima...</div>
        ) : weather.error ? (
          <div className="weather-status">Clima no disponible</div>
        ) : (
          <div className="weather-body">
            <div className="weather-temp-group">
              {details.icon}
              <span className="weather-temp">{weather.temp}°</span>
            </div>
            <span className="weather-label">{details.label}</span>
          </div>
        )}
      </div>
    </a>
  );
}