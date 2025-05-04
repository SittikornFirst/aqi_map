import { useEffect, useRef, useState, useCallback } from 'react';
import { fetchAqiData } from '../services/aqiService';

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

    const createMarker = useCallback((map, lat, lng, aqi, station, nameTH, nameEN, areaTH, areaEN, pm25, pm10, o3, no2, so2, co,date,time) => {
        if (!map || !window.longdo) return;

        // สร้าง element สำหรับ marker icon
        const markerElement = document.createElement('div');
        markerElement.className = 'relative';
        markerElement.innerHTML = `
      <div style="
        width: 40px; 
        height: 40px; 
        border-radius: 50%; 
        background-color: ${getColorByAQILevel(aqi)}; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        font-weight: bold; 
        font-family: Arial, sans-serif;
        font-size: 14px; 
        color: black;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      ">
        ${aqi}
      </div>
    `;

        try {
            const marker = new window.longdo.Marker({ lon: lng, lat: lat }, {
                title: language === 'th' ? nameTH : nameEN,
                draggable: false,
                clickable: false, // หากต้องการให้ popup ไม่แสดงเมื่อคลิก สามารถตั้ง clickable: false
                weight: window.longdo.OverlayWeight.Top,
                icon: {
                    html: markerElement.innerHTML,
                },
                popup: {
                    title: language === 'th' ? nameTH : nameEN,
                    detail:
                        //     `
                        //                         <br>${language === 'th' ? 'สถานี' : 'Station'}: ${language === 'th' ? areaTH : areaEN}

                        //     <br>${language === 'th' ? 'ดัชนีคุณภาพอากาศ' : 'AQI'}: ${aqi}
                        //     <br>${language === 'th' ? 'PM2.5' : 'PM2.5'}: ${pm25} µg/m³
                        //     <br>${language === 'th' ? 'PM10' : 'PM10'}: ${pm10} µg/m³
                        //     <br>${language === 'th' ? 'O3' : 'O3'}: ${o3} µg/m³
                        //     <br>${language === 'th' ? 'NO2' : 'NO2'}: ${no2} µg/m³
                        //     <br>${language === 'th' ? 'SO2' : 'SO2'}: ${so2} µg/m³
                        //     <br>${language === 'th' ? 'CO' : 'CO'}: ${co} µg/m³
                        //   `
                        `
                                <br>${language === 'th' ? 'สถานี' : 'Station'}: ${language === 'th' ? areaTH : areaEN}
                                <br>${language === 'th' ? 'ดัชนีคุณภาพอากาศ' : 'AQI'}: ${aqi}
                                <br>${language === 'th' ? 'PM2.5' : 'PM2.5'}: ${pm25} µg/m³
                                <br>${language === 'th' ? 'อัพเดทล่าสุด' : 'Last Update'}: ${date} ${time}
                        `
                },
            });
            if (station.AQILast?.PM25?.aqi < 0) {
                return
            };
            map.Overlays.add(marker);
        } catch (error) {
            console.error("Error creating IQAir style marker:", error);
        }
    }, [language]);

    // Initial Map และ Fetch AQI data
    useEffect(() => {
        if (window.longdo) {
            const map = new window.longdo.Map({
                placeholder: document.getElementById('longdoMap'),
                zoom: 10,
                lastView: false,
            });
            mapRef.current = map;
            window.map = map;
        }

        fetchAqiData()
            .then((data) => {
                setAqiData(data);
            })
            .catch((err) => {
                console.error('Error fetching AQI data: ', err);
            });
    }, []);

    // เมื่อได้รับข้อมูล AQI ให้สร้าง marker สำหรับแต่ละสถานี
    useEffect(() => {
        if (mapRef.current && aqiData && aqiData.stations) {
            // ลบ marker เก่าก่อนเพื่อป้องกันการซ้ำซ้อน
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
                if (isNaN(lat) || isNaN(lng)) {
                    console.warn(`Invalid coordinates for station ${station.nameEN}`);
                    return;
                }
                // console.log(station); b    bv
                const nameTH = station.nameTH || 'N/A';
                const nameEN = station.nameEN || 'N/A';
                const areaTH = station.areaTH || 'N/A';
                const areaEN = station.areaEN || 'N/A';
                const date = station.AQILast?.date || 'N/A';
                const time = station.AQILast?.time || 'N/A';

                // ดึงค่า AQI จาก station (ตรวจสอบโครงสร้างข้อมูลตาม API)
                const aqi = station.AQILast?.PM25?.aqi || 'N/A';
                const pm25 = station.AQILast?.PM25?.value || 'N/A';
                const pm10 = station.AQILast?.PM10?.aqi || 'N/A';
                const o3 = station.AQILast?.O3?.aqi || 'N/A';
                const no2 = station.AQILast?.NO2?.aqi || 'N/A';
                const so2 = station.AQILast?.SO2?.aqi || 'N/A';
                const co = station.AQILast?.CO?.aqi || 'N/A';

                // สร้าง marker เฉพาะเมื่อข้อมูล AQI เป็นตัวเลข
                if (!isNaN(Number(aqi))) {
                    createMarker(mapRef.current, lat, lng, aqi, station, nameTH, nameEN, areaTH, areaEN, pm25, pm10, o3, no2, so2, co,date,time);
                }
            });

        }
    }, [aqiData, createMarker]);

    return (
        <div className="w-full h-screen">
            <div id="longdoMap" className="w-full h-full"></div>
        </div>
    );
}

export default MapContainer;
