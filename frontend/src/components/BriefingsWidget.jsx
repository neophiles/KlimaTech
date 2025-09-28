import { WeatherStats } from './WeatherStats'

export function BriefingsWidget({ temperature, humidity, wind_speed, uv_index }) {
    return (
        <div className="base-widget briefings-widget">
            <p className="summary">Hotter than yesterday!</p>
            <div className="status-grid">
                <WeatherStats icon="🌡️" name="Temperature" value={temperature} unit="°C" />
                <WeatherStats icon="💧" name="Humidity" value={humidity} unit="%" />
                <WeatherStats icon="💨" name="Wind" value={wind_speed} unit="km/h" />
                <WeatherStats icon="🔆" name="UV Index" value={uv_index} unit="" />
            </div>
        </div>
    );
}