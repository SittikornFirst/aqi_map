// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import MapContainer from "./components/MapContainer";
import InputPanel from "./components/InputPanel";
import RoutingMap from "./components/RoutingMap";
import Navbar from "./components/Navbar";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import LoadingModal from "./components/LoadingModal";

function App() {
  const [routeData, setRouteData] = useState(null);
  const [language, setLanguage] = useState("th");
  const [isMapReady, setIsMapReady] = useState(false);

  // Called by MapContainer when the map API is initialized
  const handleMapReady = () => {
    console.log("[App] Map is ready");
    setIsMapReady(true);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "th" : "en"));
    if (routeData) setRouteData({ ...routeData });
    window.location.pathname = "/";
  };

  const handleRouteSubmit = ({ startName, startCoord, destinationName, destinationCoord }) => {
    setRouteData({ startName, startCoord, destinationName, destinationCoord });
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <header className="flex border-b border-gray-900/10 bg-white shadow-sm z-40">
        <div className="w-full max-w-7xl mx-auto px-4">
          <Navbar language={language} />
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Show spinner until map is loaded */}
              <LoadingModal show={!isMapReady} />

              {/* Input panel will only call map.Search after isMapReady=true */}
              <InputPanel
                onRouteSubmit={handleRouteSubmit}
                language={language}
                isMapReady={isMapReady}
              />

              <div className="flex-1 overflow-hidden">
                {routeData ? (
                  <RoutingMap routeData={routeData} language={language} />
                ) : (
                  <MapContainer language={language} onMapReady={handleMapReady} />
                )}
              </div>
            </>
          }
        />
        <Route path="/aqi" element={<MapContainer language={language} onMapReady={handleMapReady} />} />
        <Route
          path="/setting/*"
          element={<SettingsPage language={language} toggleLanguage={toggleLanguage} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<div className="text-center mt-10">404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;