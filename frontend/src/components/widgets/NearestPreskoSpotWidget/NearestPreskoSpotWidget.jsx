import { useNavigate } from "react-router-dom";
import Button from "../../Button";
import "./NearestPreskoSpotWidget.css";

function NearestPreskoSpotWidget() {
    const navigate = useNavigate();

    const handleGoToMap = () => {
        navigate("/map");
    };

    return (
        <div className="base-widget raised-widget nearest-preskospot-widget">
            <div className="outer-container">
                    <svg className="nav-btn-icon location-marker-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                <div className="inner-container">
                    <span>Pinakamalapit na preskohan</span>
                    <span>SM City Lucena</span>
                    <span>0.5 km</span>
                </div>
            </div>
            <Button
                onClick={handleGoToMap}
                otherClass={"go-to-preskospot"}
                children={
                    <>
                        <svg className="nav-btn-icon go-to-preskospot-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 18l-2 -4l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5l-2.901 8.034" />
                            <path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879z" />
                            <path d="M19 18v.01" />
                        </svg>
                        <span>
                            Tignan ang PreskoSpots
                        </span>
                    </>
                }
            />
        </div>
    );
}

export default NearestPreskoSpotWidget;