import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, ExternalLink, MapPin } from "lucide-react";
import "../styles/WeatherWidget.css";

const UBICACIONES = {
  corrientes: { lat: -27.4692, lon: -58.8306, name: "Corrientes" },
  ituzaingo: { lat: -27.5924, lon: -56.6806, name: "Ituzaingó" },
  santarosa: { lat: -28.2647, lon: -58.1172, name: "Santa Rosa" },
  saladas: { lat: -28.2539, lon: -58.6259, name: "Saladas" },
};

const obtenerUbicacion = (tenantProp) => {
  const host = typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";
  const key = (tenantProp || "").toLowerCase();
  const id = `${key} ${host}`;

  if (id.includes("saladas")) return UBICACIONES.saladas;
  if (id.includes("ituzaingo") || id.includes("elportaldeitu") || id.includes("primiciasituzaingo")) {
    return UBICACIONES.ituzaingo;
  }
  if (id.includes("santa") || id.includes("lavozdesantarosa") || id.includes("santarosanoticias")) {
    return UBICACIONES.santarosa;
  }
  return UBICACIONES.corrientes;
};

export default function WeatherWidget({ tenant, layout = "card", styleVariant = "light" }) {
  const ubicacion = obtenerUbicacion(tenant);
  const { lat, lon, name: CITY_NAME } = ubicacion;

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
    if (code === 0) return { label: "Despejado", icon: <Sun className="ww-icon ww-sun" /> };
    if ([1, 2, 3].includes(code)) return { label: "Nublado", icon: <Cloud className="ww-icon ww-cloud" /> };
    if ([45, 48].includes(code)) return { label: "Niebla", icon: <Cloud className="ww-icon ww-cloud" /> };
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return { label: "Lluvia", icon: <CloudRain className="ww-icon ww-rain" /> };
    }
    if ([71, 73, 75, 77, 85, 86].includes(code)) {
      return { label: "Nieve", icon: <CloudSnow className="ww-icon ww-snow" /> };
    }
    if ([95, 96, 99].includes(code)) {
      return { label: "Tormenta", icon: <CloudLightning className="ww-icon ww-storm" /> };
    }
    return { label: "Clima", icon: <Sun className="ww-icon ww-sun" /> };
  };

  const details = getWeatherDetails(weather.code);

  // FORMATO 1: BARRA HORIZONTAL (Arriba de todo)
  if (layout === "banner") {
    return (
      <a href={WEATHER_EXTERNAL_URL} target="_blank" rel="noopener noreferrer" className="ww-link">
        <div className={`ww-box ww-layout-banner ww-variant-${styleVariant}`}>
          <div className="ww-banner-left">
            <MapPin size={18} className="ww-pin" />
            <span className="ww-city">El tiempo en {CITY_NAME}</span>
          </div>
          {weather.loading ? (
            <span className="ww-status">Cargando...</span>
          ) : weather.error ? (
            <span className="ww-status">No disponible</span>
          ) : (
            <div className="ww-banner-right">
              {details.icon}
              <span className="ww-temp">{weather.temp}°C</span>
              <span className="ww-badge">{details.label}</span>
              <ExternalLink size={14} className="ww-ext" />
            </div>
          )}
        </div>
      </a>
    );
  }

  // FORMATO 2: TIRA COMPACTA (Encima de la noticia principal)
  if (layout === "compact") {
    return (
      <a href={WEATHER_EXTERNAL_URL} target="_blank" rel="noopener noreferrer" className="ww-link">
        <div className={`ww-box ww-layout-compact ww-variant-${styleVariant}`}>
          <div className="ww-compact-left">
            <span className="ww-city">{CITY_NAME}</span>
            <span className="ww-sep">•</span>
            <span className="ww-label">{weather.loading ? "..." : details.label}</span>
          </div>
          {!weather.loading && !weather.error && (
            <div className="ww-compact-right">
              {details.icon}
              <span className="ww-temp">{weather.temp}°</span>
              <ExternalLink size={13} className="ww-ext" />
            </div>
          )}
        </div>
      </a>
    );
  }

  // FORMATO 4: PÍLDORA EDITORIAL (Divisor entre noticia destacada y grilla secundaria)
  if (layout === "pill") {
    return (
      <div className="ww-pill-wrapper">
        <a href={WEATHER_EXTERNAL_URL} target="_blank" rel="noopener noreferrer" className="ww-link">
          <div className={`ww-box ww-layout-pill ww-variant-${styleVariant}`}>
            <span className="ww-pill-tag">CLIMA ACTUAL</span>
            <span className="ww-city">{CITY_NAME}</span>
            <span className="ww-sep">|</span>
            {weather.loading ? (
              <span className="ww-status">...</span>
            ) : weather.error ? (
              <span className="ww-status">--</span>
            ) : (
              <div className="ww-pill-data">
                {details.icon}
                <span className="ww-temp">{weather.temp}°C</span>
                <span className="ww-label">{details.label}</span>
              </div>
            )}
          </div>
        </a>
      </div>
    );
  }

  // FORMATO 3: TARJETA SIDEBAR
  return (
    <a href={WEATHER_EXTERNAL_URL} target="_blank" rel="noopener noreferrer" className="ww-link">
      <div className={`ww-box ww-layout-card ww-variant-${styleVariant}`}>
        <div className="ww-card-top">
          <span className="ww-city">{CITY_NAME}</span>
          <ExternalLink size={14} className="ww-ext" />
        </div>

        {weather.loading ? (
          <div className="ww-status">Cargando clima...</div>
        ) : weather.error ? (
          <div className="ww-status">Clima no disponible</div>
        ) : (
          <div className="ww-card-bottom">
            <div className="ww-temp-wrap">
              {details.icon}
              <span className="ww-temp">{weather.temp}°C</span>
            </div>
            <span className="ww-badge">{details.label}</span>
          </div>
        )}
      </div>
    </a>
  );
}