import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Button";
import "./NearestPreskoSpotWidget.css";

function NearestPreskoSpotWidget({ userLocation }) {
  const navigate = useNavigate();
  const [spots, setSpots] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userLocation?.lat || !userLocation?.lon) return;

    const fetchSpots = async () => {
      try {
        const res = await fetch(
          `/api/coolspots/preskospots/nearest?lat=${userLocation.lat}&lon=${userLocation.lon}`
        );
        if (!res.ok) throw new Error("Failed to fetch Presko spots");
        const data = await res.json();
        setSpots(data.spots || []);
      } catch (err) {
        console.error("Error fetching Presko spots:", err);
        setError(err.message);
      }
    };

    fetchSpots();
  }, [userLocation]);

  const handleGoToMap = () => navigate("/map");

  const nextSpot = () => {
    setCurrentIndex((prev) => (prev + 1) % spots.length);
  };

  const prevSpot = () => {
    setCurrentIndex((prev) => (prev - 1 + spots.length) % spots.length);
  };

  const currentSpot = spots[currentIndex];

  return (
    <div className="base-widget raised-widget nearest-preskospot-widget">
      <div className="outer-container">
        <button className="spot-nav-btn prev" onClick={prevSpot} disabled={spots.length <= 1}>
          <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M13.883 5.007l.058 -.005h.118l.058 .005l.06 .009l.052 .01l.108 .032l.067 .027l.132 .07l.09 .065l.081 .073l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059v12c0 .852 -.986 1.297 -1.623 .783l-.084 -.076l-6 -6a1 1 0 0 1 -.083 -1.32l.083 -.094l6 -6l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01z" />
          </svg>
        </button>
        
        <svg
          className="nav-btn-icon location-marker-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <div className="inner-container">
          <span>Nearest PreskoSpot</span>

          {error ? (
            <span className="error-text">Error loading data</span>
          ) : currentSpot ? (
            <>
              <span>{currentSpot.name}</span>
              <span>{currentSpot.distance.toFixed(2)} km</span>
            </>
          ) : (
            <span>Loading...</span>
          )}
        </div>

        <button className="spot-nav-btn next" onClick={nextSpot} disabled={spots.length <= 1}>
          <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 6c0 -.852 .986 -1.297 1.623 -.783l.084 .076l6 6a1 1 0 0 1 .083 1.32l-.083 .094l-6 6l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002l-.059 -.002l-.058 -.005l-.06 -.009l-.052 -.01l-.108 -.032l-.067 -.027l-.132 -.07l-.09 -.065l-.081 -.073l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057l-.002 -12.059z" />
          </svg>
        </button>
      </div>

      <Button
        onClick={handleGoToMap}
        otherClass={"go-to-preskospot"}
        children={
          <>
            <svg
              className="nav-btn-icon go-to-preskospot-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 18l-2 -4l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5l-2.901 8.034" />
              <path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879z" />
              <path d="M19 18v.01" />
            </svg>
            <span>Tignan ang PreskoSpots</span>
          </>
        }
      /> 
    </div>
  );
}

export default NearestPreskoSpotWidget;
