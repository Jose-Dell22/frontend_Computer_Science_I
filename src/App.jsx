import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { FaHome, FaDatabase } from "react-icons/fa";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";   // ← added

export default function App() {
  return (
    <Router>
      <div className="min-h-screen text-white">

        {/* NAVBAR */}
        <nav className="navbar">
          <NavLink to="/" end>
            <FaHome />
          </NavLink>

          <NavLink to="/gallery">
            <FaDatabase />
          </NavLink>
        </nav>

        {/* ROUTES */}
        <main className="section-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />

            {/* ← Default route (404) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}
