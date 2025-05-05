import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MapContainer from './components/MapContainer';
import InputPanel from './components/InputPanel';
import RoutingMap from './components/RoutingMap';
import Navbar from './components/Navbar';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import 
function App() {
  const [routeData, setRouteData] = useState(null);
  const [language, setLanguage] = useState('th');
  const isLoading = false;
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'th' : 'en'));
    isLoading = true;
    setTimeout(() => {
      isLoading = false;
    }, 500);
  };
  const handleRouteSubmit = ({
    startName,
    startCoord,
    destinationName,
    destinationCoord,
  }) => {
    setRouteData({ startName, startCoord, destinationName, destinationCoord });
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <header className="flex h-16 border-b border-gray-900/10 bg-white shadow-sm z-40">
        <div className="mx-auto flex w-full max-w-7xl px-4 sm:px-6 lg:px-8 justify-between items-center relative">
          <Navbar language={language} />
        </div>
      </header>

      <Routes>
        <Route
          path="/home"
          link="/"
          element={
            <>
              <InputPanel onRouteSubmit={handleRouteSubmit} language={language} />
              <div className="flex-1 overflow-hidden">
                {routeData ? (
                  <RoutingMap routeData={routeData} language={language} />
                ) : (
                  <MapContainer language={language} />
                )}
              </div>
            </>
          }
        />
        <Route path="/aqi" element={<MapContainer language={language} />} />
        <Route
          path="/setting/*"
          element={
            <SettingsPage language={language} toggleLanguage={toggleLanguage} />
          }
        />        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="*"
          element={
            <div className="text-center mt-10">404 - Page Not Found</div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
