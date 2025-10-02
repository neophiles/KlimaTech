import { useEffect, useState } from "react";
import { TimeSlotContainer } from "./TimeSlotContainer";
import { fetchForecastData } from "../scripts/api";
import { getIndexByHeat, getColorByIndex, formatHourLabel } from "../scripts/utils";

export function HeatClockWidget() {

    const [forecast, setForecastData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getData() {
            try {
                const data = await fetchForecastData(1); // barangayId = 1 for testing
                setForecastData(data.forecast);
            } catch (err) {
                console.error(err);
                setError(err);
            }
        }
    
        getData();
    }, []);

    if (error) return <div className="base-widget">Error loading data</div>;
    if (!forecast) return <div className="base-widget">Loading...</div>;

    // Split forecast into Safe vs Hot
    const classifiedHours = forecast
        .map(({ time, heat_index }) => ({
            hour: formatHourLabel(time, 6, 18),
            heat_index: heat_index,
            color: getColorByIndex(getIndexByHeat(heat_index)),
        }))
        .filter(({ hour }) => hour); // keep only defined hours;

    return (
        <div className="base-widget heat-clock-widget">
            <h1>Today's Forecast</h1>
            <TimeSlotContainer hours={classifiedHours} />
        </div>
    );
}