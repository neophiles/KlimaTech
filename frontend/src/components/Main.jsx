import Dashboard from '../pages/Dashboard'
import HeatMap from "../pages/HeatMap";
import { Routes, Route } from "react-router-dom";

function Main() {
    return (
        <main>
            <Routes>
                {/* Default page */}
                <Route path="/" element={<Dashboard />} />
                {/* Heatmap page */}
                <Route path="/heatmap" element={<HeatMap />} />
            </Routes>
        </main>
    );
}

export default Main;