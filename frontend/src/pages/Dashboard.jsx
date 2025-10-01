import { useEffect, useState } from 'react';
import { HeatGauge } from '../components/HeatGauge';
import { LocationWidget } from '../components/LocationWidget'
import { AdvisoryWidget } from '../components/AdvisoryWidget'
import { BriefingsWidget } from '../components/BriefingsWidget'
import { fetchWeatherData } from "../scripts/fetchWeatherData"
import { HeatClockWidget } from '../components/HeatClockWidget';

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
        id,
        barangay,
        locality,
        province,
        lat,
        lon,
        current: { temperature, humidity, wind_speed, uv_index, heat_index, risk_level, updated_at },
        daily_briefing: { safe_hours, avoid_hours, advice },
        forecast
    } = gaugeData;

    const safeHours = [
        { hour: 8, hi: 28 },
        { hour: 9, hi: 29 },
        { hour: 10, hi: 30 },
        { hour: 16, hi: 31 },
        { hour: 17, hi: 30 },
        { hour: 18, hi: 29 },
        { hour: 19, hi: 28 }
    ];

    const hotHours = [
        { hour: 11, hi: 33 },
        { hour: 12, hi: 35 },
        { hour: 13, hi: 36 },
        { hour: 14, hi: 36 },
        { hour: 15, hi: 35 }
    ];

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
            <HeatClockWidget safeHours={safeHours} hotHours={hotHours} />
        </div>
    );
}