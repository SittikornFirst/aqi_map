import { useEffect, useRef, useState, useCallback } from "react";
import { fetchAqiData } from "../services/aqiService";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const AQI_OPTIONS = [
  { id: "PM25", name: "AQI" },
  { id: "PM25", name: "PM2.5" },
  { id: "PM10", name: "PM10" },
  { id: "O3", name: "O3" },
  { id: "NO2", name: "NO2" },
  { id: "SO2", name: "SO2" },
  { id: "CO", name: "CO" },
];

function MapContainer({ language }) {
    const mapRef = useRef(null);
    const [aqiData, setAqiData] = useState(null);

    // ฟังก์ชันสำหรับแปลงค่า AQI เป็นสี (IQAir style)
    const getColorByAQILevel = (aqi) => {
        const numericAQI = Number(aqi);
        if (isNaN(numericAQI)) return "#CCCCCC"; // ถ้าไม่ใช่ตัวเลขให้ใช้สีเทา
        if (numericAQI > 0 && numericAQI <= 25) return "#00E400"; // Good
        else if (numericAQI > 25 && numericAQI <= 50) return "#00E400"; // Good
        else if (numericAQI > 50 && numericAQI <= 100) return "#FFFF00"; // Moderate
        else if (numericAQI > 100 && numericAQI <= 150) return "#FF7E00"; // Unhealthy for Sensitive Groups
        else if (numericAQI > 150 && numericAQI <= 200) return "#FF0000"; // Unhealthy
        else return "#99004C"; // Very Unhealthy or above
    };

    // ฟังก์ชันสร้าง marker แบบ IQAir (กลมๆ) โดยใช้ HTML ในการกำหนด icon
    // eslint-disable-next-line no-unused-vars
    const createMarker = useCallback((map, lat, lng, aqi, station, nameTH, nameEN, areaTH, areaEN, pm25, pm10, o3, no2, so2, co,date,time) => {
        if (!map || !window.longdo) return;

      const markerElement = document.createElement("div");
      markerElement.innerHTML = `
                  <div style="width:40px;height:40px;border-radius:50%;background-color:${getColorByAQILevel(
                    aqiValue
                  )};display:flex;justify-content:center;align-items:center;font-weight:bold;font-size:14px;">
                    ${aqiValue}
                  </div>
                `;

      const marker = new window.longdo.Marker(
        { lon: lng, lat },
        {
          title: language === "th" ? station.nameTH : station.nameEN,
          icon: { html: markerElement.innerHTML },
          popup: {
            title: language === "th" ? station.nameTH : station.nameEN,
            detail: `
                      <br>${language === "th" ? "สถานี" : "Station"}: ${
              language === "th" ? station.areaTH : station.areaEN
            }
                      <br>${selectedAQIType.name}: ${aqiValue} µg/m³
                      <br>${
                        language === "th" ? "อัพเดทล่าสุด" : "Last Update"
                      }: ${station.AQILast?.date || "N/A"} ${
              station.AQILast?.time || "N/A"
            }
                    `,
          },
        }
      );

      if (!isNaN(aqiValue) && aqiValue >= 0) {
        map.Overlays.add(marker);
      }
    },
    [language, selectedAQIType]
  );

  useEffect(() => {
    if (window.longdo) {
      mapRef.current = new window.longdo.Map({
        placeholder: document.getElementById("longdoMap"),
        zoom: 10,
      });
      
    }

    fetchAqiData().then(setAqiData).catch(console.error);
  }, []);
  
  useEffect(() => {
    if (mapRef.current && aqiData) {
        mapRef.current.Overlays.clear();
        mapRef.current.Ui.DPad.visible(false);
        mapRef.current.Ui.Zoombar.visible(false);
        mapRef.current.Ui.Geolocation.visible(false);
        mapRef.current.Ui.Toolbar.visible(false);
        mapRef.current.Ui.LayerSelector.visible(false);
        mapRef.current.Ui.Fullscreen.visible(false);
        mapRef.current.Ui.Crosshair.visible(false);
        mapRef.current.Ui.Fullscreen.visible(false);
 

      aqiData.stations.forEach((station) => {
        const lat = parseFloat(station.lat);
        const lng = parseFloat(station.long);
        const aqiValue = station.AQILast?.[selectedAQIType.id]?.value;

        if (!isNaN(Number(aqiValue))) {
          createMarker(mapRef.current, lat, lng, aqiValue, station);
        }
      });
    }
  }, [aqiData, selectedAQIType, createMarker]);

  return (
    <div className="relative flex flex-col w-full h-screen">
      <div className="flex-none z-20 bg-white p-4 rounded shadow m-4 max-w-xs">
        <Combobox value={selectedAQIType} onChange={setSelectedAQIType}>
          <Label className="block text-sm font-medium text-gray-900">
            Select AQI Type
          </Label>
          <div className="relative mt-1">
            <ComboboxInput
              className="block w-full rounded-md py-2 pr-12 pl-3 outline outline-gray-300 focus:outline-indigo-600 " 
              onChange={(e) => setQuery(e.target.value)}
              displayValue={(option) => option.name}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </ComboboxButton>
            {filteredOptions.length > 0 && (
              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white shadow-lg ring-1 ring-black/5">
                {filteredOptions.map((option) => (
                  <ComboboxOption
                    key={option.id}
                    value={option}
                    className="cursor-pointer px-3 py-2"
                  >
                    {option.name}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            )}
          </div>
        </Combobox>
      </div>
      <div id="longdoMap" className="flex-grow"></div>
      {/* Reserve space at bottom for mobile Navbar */}
      <div className="block md:hidden h-16"></div>
    </div>
  
  );
}

export default MapContainer;
