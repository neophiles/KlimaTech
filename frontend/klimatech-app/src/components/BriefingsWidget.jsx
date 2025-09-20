import { WeatherStats } from './WeatherStats'

export function BriefingsWidget() {
    return (
        <div className="base-widget flat-widget briefings-widget">
            <p className="summary">Hotter than yesterday!</p>
            <div className="status-grid">
                <WeatherStats />
                <WeatherStats />
                <WeatherStats />
                <WeatherStats />
            </div>
        </div>
    );
}