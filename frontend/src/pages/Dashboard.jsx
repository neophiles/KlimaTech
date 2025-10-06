import { useEffect, useState } from 'react';
import HeatGauge from '../components/widgets/HeatGauge';
import LocationWidget from '../components/widgets/LocationWidget'
import AdvisoryWidget from '../components/widgets/AdvisoryWidget'
import BriefingsWidget from '../components/widgets/BriefingsWidget/BriefingsWidget'
import { fetchWeatherData } from "../api/heatGauge"
import HeatClockWidget from '../components/widgets/HeatClockWidget/HeatClockWidget'

function Dashboard() {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getData() {
            try {
                const data = await fetchWeatherData(1); // barangayId = 1 for testing
                setWeatherData(data);
            } catch (err) {
                console.error(err);
                setError(err);
            }
        }
    
        getData();
    }, []);

    if (error) return <div>Error loading data</div>;
    if (!weatherData) return <div>Loading...</div>;

    // Destructure the fields
    const {
        id,
        barangay,
        locality,
        province,
        lat,
        lon,
        current: { temperature, humidity, wind_speed, uv_index, heat_index, risk_level, updated_at },
        daily_briefing: { safe_hours, avoid_hours, advice },
        forecast
    } = weatherData;

    return (
        <div className='dashboard'>
            <HeatGauge heatIndex={heat_index} timestamp={updated_at} />
            <LocationWidget barangay={barangay} locality={locality} province={province} />
            <AdvisoryWidget heatIndex={heat_index} riskLevel={risk_level} advice={advice} />
            <BriefingsWidget
                temperature={temperature}
                humidity={humidity}
                wind_speed={wind_speed}
                uv_index={uv_index}
            />
            <HeatClockWidget />
        </div>
    );
}

export default Dashboard;