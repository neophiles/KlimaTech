import { useState, useEffect } from "react";
import { fetchForecastData } from "../../api/heatGauge";
import { getColorByIndex, getIndexByHeat } from "../../utils/heatUtils";
import "./Clock.css";

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [forecast, setForecastData] = useState([]);
  const [error, setError] = useState(null);

  const currentHour = time.getHours();
  const isAM = currentHour < 12; // automatically determine AM/PM

  // Live time update
  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  // Fetch forecast data once
  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchForecastData(1); // test barangay
        setForecastData(data.forecast);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    }
    getData();
  }, []);

  // Process and classify hours
  const classifiedHours = forecast.map(({ time, heat_index }) => {
    const hour = new Date(time).getHours();
    return {
      hour,
      heat_index,
      index: getIndexByHeat(heat_index),
    };
  });

  // Find matching forecast for the current hour
  const currentHourData = classifiedHours.find(h => h.hour === currentHour);

  // Determine color based on current heat index
  const riskColor = currentHourData
    ? getColorByIndex(currentHourData.index)
    : "#999"; // default gray if no data

  // Filter for AM or PM hours
  const hoursForDisplay = classifiedHours.filter((h) =>
    isAM ? h.hour < 12 : h.hour >= 12
  );

  // Create rim color segments
  const rimGradient = hoursForDisplay
    .slice(0, 12)
    .map((h, i) => {
      const start = i * 30;
      const end = (i + 1) * 30;
      const color = getColorByIndex(h.index);
      return `${color} ${start}deg ${end}deg`;
    })
    .join(", ");

  const hourNames = [
    "twelve", "one", "two", "three", "four", "five",
    "six", "seven", "eight", "nine", "ten", "eleven"
  ];

  const casualLabel = [
    "Ayos Lang!", "Mag-Ingat!", "Ingat Nang Husto!", 
    "Delikado!"," Wag Nang Lumabas!"
  ]

  return (
    <div className="clock-container">
      {/* Rim gradient */}
      <div className="clock-rim" style={{ background: `conic-gradient(${rimGradient})` }} />

      {/* Inner clock */}
      <div className="inner-clock">
        {/* <div className="hour_hand" style={{ transform: `rotateZ(${time.getHours() * 30}deg)` }} />
        <div className="min_hand" style={{ transform: `rotateZ(${time.getMinutes() * 6}deg)` }} />
        <div className="sec_hand" style={{ transform: `rotateZ(${time.getSeconds() * 6}deg)` }} /> */}

        {/* Clock numbers */}
        {hourNames.map((name, i) => {
          const hourNumber = i === 0 ? 12 : i; // 12-hour format
          const currentHour = time.getHours() % 12 || 12; // handle 0 → 12
          const isCurrent = currentHour === hourNumber;

          return (
            <span
              key={i}
              className={`hour ${name} ${isCurrent ? "active-hour" : ""}`}
            >
              {hourNumber}
            </span>
          );
        })}

        { currentHourData ? (
          <div className="clock-heat-info">
            <span className="am-pm">{isAM ? "AM" : "PM"}</span>
            <span className="risk-level" style={{ color: riskColor }}>
              {casualLabel[currentHourData.index]}
            </span>
            <span
              className="current-hour-heat-index"
              style={{ backgroundColor: riskColor }}
            >
              {currentHourData.heat_index}°C
            </span>
          </div>
        ) : (
          <div className="clock-heat-info loading">
            <svg className="nav-btn-icon loader-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M14.828 14.828a4 4 0 1 0 -5.656 -5.656a4 4 0 0 0 5.656 5.656z" />
              <path d="M6.343 17.657l-1.414 1.414" />
              <path d="M6.343 6.343l-1.414 -1.414" />
              <path d="M17.657 6.343l1.414 -1.414" />
              <path d="M17.657 17.657l1.414 1.414" />
              <path d="M4 12h-2" />
              <path d="M12 4v-2" />
              <path d="M20 12h2" />
              <path d="M12 20v2" />
            </svg>
          </div>
        )}

        {/* (Optional) Heat index labels
        {hoursForDisplay.map((h) => {
          const label = hourNames[h.hour % 12];
          return (
            <span key={h.hour} className={`${label}-heat`}>
              {h.heat_index}
            </span>
          );
        })} */}
      </div>
    </div>    
  );
}
