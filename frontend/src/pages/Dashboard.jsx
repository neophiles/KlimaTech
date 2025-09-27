import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { HeatGauge } from '../components/HeatGauge';
import { LocationWidget } from '../components/LocationWidget'
import { AdvisoryWidget } from '../components/AdvisoryWidget'
import { BriefingsWidget } from '../components/BriefingsWidget'
import { fetchWeatherData } from "../scripts/fetchWeatherData"

export function Dashboard() {
    const [gaugeData, setGaugeData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function getData() {
            try {
                const data = await fetchWeatherData();
                setGaugeData(data);
            } catch (err) {
                console.error(err);
                setError(err);
            }
        }
    
        getData();
    }, []);

    if (error) return <div>Error loading data</div>;
    if (!gaugeData) return <div>Loading...</div>;

    // Destructure the fields
    const {
        barangay,
        lat,
        lon,
        current: { temperature, humidity, wind_speed, uv_index, heat_index, risk_level, updated_at },
        daily_briefing: { safe_hours, avoid_hours, advice },
        forecast
    } = gaugeData;
    
    return (
        <div className='dashboard'>
            <HeatGauge heatIndex={heat_index} timestamp={updated_at} />
            <LocationWidget />
            <AdvisoryWidget heatIndex={heat_index} riskLevel={risk_level} advice={advice} />
            <BriefingsWidget
                temperature={temperature}
                humidity={humidity}
                wind_speed={wind_speed}
                uv_index={uv_index}
            />
            <button onClick={() => navigate('/heatmap')}>
                Go to Map
            </button>
        </div>
    );
}