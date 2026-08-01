import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, ExternalLink } from "lucide-react";
import "../styles/WeatherWidget.css";

// Coordenadas fijas (Ej: Corrientes/Resistencia: lat = -27.4692, lon = -58.8306)
// Puedes cambiar las coordenadas a las de tu localidad.
const LATITUDE = -27.4692;
const LONGITUDE = -58.8306;
const CITY_NAME = "Corrientes";

// Enlace externo al hacer clic
const WEATHER_EXTERNAL_URL = `https://weather.com/es-AR/tiempo/hoy/l/${LATITUDE},${LONGITUDE}`;

export default function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: null,
    code: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current_weather=true`
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
  }, []);

  // Mapeo de códigos WMO de Open-Meteo a iconos y texto
  const getWeatherDetails = (code) => {
    if (code === 0) return { label: "Despejado", icon: <Sun className="weather-icon sun" /> };
    if ([1, 2, 3].includes(code)) return { label: "Nublado", icon: <Cloud className="weather-icon cloud" /> };
    if ([45, 48].includes(code)) return { label: "Niebla", icon: <Cloud className="weather-icon cloud" /> };
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return { label: "Lluvia", icon: <CloudRain className="weather-icon rain" /> };
    }
    if ([71, 73, 75, 77, 85, 86].includes(code)) {
      return { label: "Nieve", icon: <CloudSnow className="weather-icon snow" /> };
    }
    if ([95, 96, 99].includes(code)) {
      return { label: "Tormenta", icon: <CloudLightning className="weather-icon storm" /> };
    }
    return { label: "Clima", icon: <Sun className="weather-icon sun" /> };
  };

  const details = getWeatherDetails(weather.code);

  return (
    <a
      href={WEATHER_EXTERNAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="weather-card-link"
      title="Ver pronóstico extendido en Weather.com"
    >
      <div className="weather-card">
        <div className="weather-header">
          <span className="weather-city">{CITY_NAME}</span>
          <ExternalLink size={14} className="weather-external-icon" />
        </div>

        {weather.loading ? (
          <div className="weather-status">Cargando clima...</div>
        ) : weather.error ? (
          <div className="weather-status">Clima no disponible</div>
        ) : (
          <div className="weather-body">
            <div className="weather-temp-group">
              {details.icon}
              <span className="weather-temp">{weather.temp}°C</span>
            </div>
            <span className="weather-label">{details.label}</span>
          </div>
        )}
      </div>
    </a>
  );
}