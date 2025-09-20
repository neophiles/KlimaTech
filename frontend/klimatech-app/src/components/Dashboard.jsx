import { useEffect, useState } from 'react';
import { HeatGauge } from './HeatGauge';
import { LocationWidget } from './LocationWidget'
import { AdvisoryWidget } from './AdvisoryWidget'
import { BriefingsWidget } from './BriefingsWidget'
import { fetchWeatherData } from "../scripts/fetchTempData"

export function Dashboard() {
    const [gaugeData, setGaugeData] = useState(null);
    const [error, setError] = useState(null);

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
        name,
        lat,
        lon,
        current: { temperature, humidity, heat_index, risk_level, updated_at },
        daily_briefing: { safe_hours, avoid_hours, advice },
        forecast
    } = gaugeData;
    
    return (
        <div className='dashboard'>
            <HeatGauge heatIndex={heat_index} timestamp={updated_at} />
            <LocationWidget />
            <AdvisoryWidget heatIndex={heat_index} riskLevel={risk_level} advice={advice} />
            <BriefingsWidget />
        </div>
    );
}