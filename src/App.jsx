import React, { useState } from 'react';
import MapContainer from './components/MapContainer';
import InputPanel from './components/InputPanel';
import RoutingMap from './components/RoutingMap';
import Navbar from './components/Navbar';

// Dummy geocoding function – replace this with your real geocoding logic.
async function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    if (window.longdo && window.longdo.Util && typeof window.longdo.Util.search === 'function') {
      window.longdo.Util.search(address, (result) => {
        if (result && result.length > 0) {
          const { lon, lat } = result[0];
          resolve({ lon, lat });
        } else {
          reject(new Error("No results found"));
        }
      });
    } else {
      reject(new Error("Longdo map not ready"));
    }
  });
}


function App() {
  const [routeData, setRouteData] = useState(null);
  const [language, setLanguage] = useState('th'); // default to English

  const handleRouteSubmit = async ({ start, destination }) => {
    const startCoord = await geocodeAddress(start);
    const destinationCoord = await geocodeAddress(destination);
    setRouteData({
      startCoord,
      destinationCoord,
      startName: start,
      destinationName: destination,
    });
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'th' : 'en'));
  };

  return (
    <div>
      <header className="inset-x-0 top-0 flex h-16 border-b border-gray-900/10 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl px-4 sm:px-6 lg:px-8 justify-between items-center">
          <Navbar language={language} />
          <button
            onClick={toggleLanguage}
            className="rounded px-3 py-1 text-sm font-medium bg-gray-200 hover:bg-gray-300"
          >
            {language === 'en' ? 'TH' : 'EN'}
          </button>
        </div>
      </header>

      <InputPanel onRouteSubmit={handleRouteSubmit} language={language} />
      <div className="relative h-screen">
        {routeData ? <RoutingMap routeData={routeData} /> : <MapContainer />}
      </div>
    </div>
  );
}


export default App;
