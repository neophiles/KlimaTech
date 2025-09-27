import './App.css'
import { Header } from './components/Header'
import { Main } from './components/Main'
import { Footer } from './components/Footer'
import HeatMap from "./pages/HeatMap";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Default page */}
        <Route path="/" element={<Main />} />
        {/* Heatmap page */}
        <Route path="/heatmap" element={<HeatMap />} />
      </Routes>

      <Footer />
    </Router>
  )
}

export default App
