import Dashboard from '../pages/Dashboard'
import HeatMap from "../pages/HeatMap";
import { Routes, Route } from "react-router-dom";
import Settings from '../pages/Settings';

function Main() {
    return (
        <main>
            <Routes>
                {/* Default page */}
                <Route path="/" element={<Dashboard />} />
                {/* Heatmap page */}
                <Route path="/heatmap" element={<HeatMap />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </main>
    );
}

export default Main;