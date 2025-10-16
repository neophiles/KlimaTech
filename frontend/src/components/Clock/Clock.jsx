import React, { useState, useEffect } from "react";
import { fetchForecastData } from "../../api/heatGauge";
import { getColorByIndex, getIndexByHeat } from "../../utils/heatUtils";
import "./Clock.css";

export default function Clock({ isAM = true, riskLevel}) {
  const [time, setTime] = useState(new Date());
  const [forecast, setForecastData] = useState([]);
  const [error, setError] = useState(null);

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

  return (
    <div className="clock-container">
      {/* Rim gradient */}
      <div className="clock-rim" style={{ background: `conic-gradient(${rimGradient})` }} />

      {/* Inner clock */}
      <div className="inner-clock">
        <div className="hour_hand" style={{ transform: `rotateZ(${time.getHours() * 30}deg)` }} />
        <div className="min_hand" style={{ transform: `rotateZ(${time.getMinutes() * 6}deg)` }} />
        <div className="sec_hand" style={{ transform: `rotateZ(${time.getSeconds() * 6}deg)` }} />

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

        <span className="risk-level">{ riskLevel }</span>

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
