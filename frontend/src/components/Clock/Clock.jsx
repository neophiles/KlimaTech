import { useState, useEffect } from "react";
import { fetchForecastData } from "../../api/heat";
import { getColorByIndex, getIndexByHeat } from "../../utils/heatUtils";
import "./Clock.css";
import {
  Box,
  Text,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Clock({ barangayId }) {
  const [time, setTime] = useState(new Date());
  const [forecast, setForecastData] = useState([]);
  const [error, setError] = useState(null);

  const currentHour = time.getHours();
  const isAM = currentHour < 12; // Automatically determine AM/PM

  // Live time update
  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    async function getData() {
      try {
        if (!barangayId) return; // Don't fetch if barangayId is undefined
        const data = await fetchForecastData(barangayId);
        console.log(data);
        setForecastData(data.forecast);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    }
    getData();
  }, [barangayId]);

  // Classify hours
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
    : "#999999"; // default gray if no data

  // Filter for AM or PM hours
  const hoursForDisplay = classifiedHours.filter((h) =>
    isAM ? h.hour < 12 : h.hour >= 12
  );

  //  Rim segment colors
  const rimGradient = hoursForDisplay
    .slice(0, 12)
    .map((h, i) => {
      const start = i * 30;
      const end = (i + 1) * 30;
      const color = getColorByIndex(h.index);
      return `${color} ${start}deg ${end}deg`;
    })
    .join(", ");

  const innerBgColor = useColorModeValue("gray.50", "gray.700");

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
      <div className="clock-rim" style={{ background: `conic-gradient(${rimGradient})` }} />

      <Box className="inner-clock" bg={innerBgColor}>
        {hourNames.map((name, i) => {
          const angle = (i / 12) * (2 * Math.PI) - Math.PI / 2; // start at top (12)
          const radius = 40; // % distance from center

          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);

          const hourNumber = i === 0 ? 12 : i;
          const currentHour = time.getHours() % 12 || 12;
          const isCurrent = currentHour === hourNumber;

          return (
            <span
              key={i}
              className={`hour ${isCurrent ? "active-hour" : ""}`}
              style={{
                "--x": `${x}%`,
                "--y": `${y}%`,
              }}
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
        ) : error ? (
          <div className="clock-heat-info">
            <Text fontSize={["sm", "md"]} color="red.500">
              Failed to fetch
            </Text>
          </div>
        ) : (
          <Spinner size="xl" />
        )}
      </Box>
    </div>    
  );
}
