import { useEffect, useRef, useState, useCallback } from 'react';
import { fetchAqiData } from '../services/aqiService';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

const AQI_OPTIONS = [
  { id: 'AQI', name: 'AQI' },
  { id: 'PM25', name: 'PM2.5' },
  { id: 'PM10', name: 'PM10' },
  { id: 'O3', name: 'O3' },
  { id: 'NO2', name: 'NO2' },
  { id: 'SO2', name: 'SO2' },
  { id: 'CO', name: 'CO' },
];

function MapContainer({ language }) {
  const mapRef = useRef(null);
  const [aqiData, setAqiData] = useState(null);
  const [selectedAQIType, setSelectedAQIType] = useState('AQI');

  const getColorByAQILevel = (value, type) => {
    const val = Number(value);
    if (isNaN(val) || val < 0) return '#CCCCCC';

    switch (type) {
      case 'PM25':
        if (val <= 15.0) return '#00BFFF';
        if (val <= 25.0) return '#00E400';
        if (val <= 37.5) return '#FFFF00';
        if (val <= 75.0) return '#FF7E00';
        return '#FF0000';
      case 'PM10':
        if (val <= 50) return '#00BFFF';
        if (val <= 80) return '#00E400';
        if (val <= 120) return '#FFFF00';
        if (val <= 180) return '#FF7E00';
        return '#FF0000';
      case 'O3':
        if (val <= 35) return '#00BFFF';
        if (val <= 50) return '#00E400';
        if (val <= 70) return '#FFFF00';
        if (val <= 120) return '#FF7E00';
        return '#FF0000';
      case 'CO':
        if (val <= 4.4) return '#00BFFF';
        if (val <= 6.4) return '#00E400';
        if (val <= 9.0) return '#FFFF00';
        if (val <= 15.0) return '#FF7E00';
        return '#FF0000';
      case 'NO2':
        if (val <= 60) return '#00BFFF';
        if (val <= 106) return '#00E400';
        if (val <= 170) return '#FFFF00';
        if (val <= 340) return '#FF7E00';
        return '#FF0000';
      case 'SO2':
        if (val <= 100) return '#00BFFF';
        if (val <= 200) return '#00E400';
        if (val <= 300) return '#FFFF00';
        if (val <= 400) return '#FF7E00';
        return '#FF0000';
      case 'AQI':
      default:
        if (val <= 25) return '#00BFFF';
        if (val <= 50) return '#00E400';
        if (val <= 100) return '#FFFF00';
        if (val <= 200) return '#FF7E00';
        return '#FF0000';
    }
  };

  const createMarker = useCallback((map, lat, lng, aqiValue, station) => {
    if (!map || !window.longdo) return;

    const markerElement = document.createElement('div');
    markerElement.innerHTML = `
      <div style="width:40px;height:40px;border-radius:50%;background-color:${getColorByAQILevel(aqiValue, selectedAQIType)};display:flex;justify-content:center;align-items:center;font-weight:bold;font-size:14px;">
        ${aqiValue}
      </div>
    `;

    const marker = new window.longdo.Marker({ lon: lng, lat }, {
      title: language === 'th' ? station.nameTH : station.nameEN,
      icon: { html: markerElement.innerHTML },
      popup: {
        title: language === 'th' ? station.nameTH : station.nameEN,
        detail: `
          <br>${language === 'th' ? 'สถานี' : 'Station'}: ${language === 'th' ? station.areaTH : station.areaEN}
          <br>${selectedAQIType}: ${aqiValue} µg/m³
          <br>${language === 'th' ? 'อัพเดทล่าสุด' : 'Last Update'}: ${station.AQILast?.date || 'N/A'} ${station.AQILast?.time || 'N/A'}
        `,
      },
    });

    if (!isNaN(aqiValue) && aqiValue >= 0) {
      map.Overlays.add(marker);
    }
  }, [language, selectedAQIType]);

  useEffect(() => {
    if (window.longdo) {
      mapRef.current = new window.longdo.Map({ placeholder: document.getElementById('longdoMap'), zoom: 10 });
    }

    fetchAqiData()
      .then(setAqiData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (mapRef.current && aqiData) {
      mapRef.current.Overlays.clear();
      mapRef.current.Ui.DPad.visible(false);
      // mapRef.current.Ui.Zoombar.visible(false);
      mapRef.current.Ui.Geolocation.visible(false);
      mapRef.current.Ui.Toolbar.visible(false);
      mapRef.current.Ui.LayerSelector.visible(false);
      mapRef.current.Ui.Fullscreen.visible(false);
      mapRef.current.Ui.Crosshair.visible(false);
      
      aqiData.stations.forEach((station) => {
        const lat = parseFloat(station.lat);
        const lng = parseFloat(station.long);
        const selectedParam = selectedAQIType;

        let aqiValue;
        if (selectedParam === 'AQI') {
          aqiValue = station.AQILast?.AQI?.aqi;
        } else {
          aqiValue = station.AQILast?.[selectedParam]?.value;
        }

        if (!isNaN(Number(aqiValue)) && Number(aqiValue) >= 0) {
          createMarker(mapRef.current, lat, lng, aqiValue, station);
        }
      });
    }
  }, [aqiData, selectedAQIType, createMarker]);

  return (
    <div className="relative w-full h-screen">
      {/* Overlay dropdown on top-right */}
      <div className="absolute top-4 right-4 z-50 bg-white rounded-md shadow px-3 py-2 flex items-center space-x-2">
        <label htmlFor="aqiType" className="sr-only">Select AQI Type</label>
        <div className="relative grid grid-cols-1">
          <select
            id="aqiType"
            name="aqiType"
            value={selectedAQIType}
            onChange={(e) => setSelectedAQIType(e.target.value)}
            className="appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-sm text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
          >
            {AQI_OPTIONS.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-500"
          />
        </div>
      </div>

      {/* Map container */}
      <div id="longdoMap" className="w-full h-full"></div>

      {/* Mobile navbar space */}
      <div className="block md:hidden h-16"></div>
    </div>
  );
}

export default MapContainer;
