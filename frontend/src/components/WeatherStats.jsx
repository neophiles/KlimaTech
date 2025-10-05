function WeatherStats({ icon, name, value, unit }) {
    return (
        <div className="stat">
            <div className="stat-icon">{icon}</div>
            <div>
                <p className="stat-name">{name}</p>
                <p className="stat-value">{value}{unit}</p>
            </div>
        </div>
    );
}

export default WeatherStats;