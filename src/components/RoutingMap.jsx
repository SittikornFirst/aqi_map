import React, { useEffect, useRef } from 'react';

function RoutingMap({ routeData }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    // Create the map only once
    useEffect(() => {
        if (window.longdo && !mapRef.current) {
            mapRef.current = new window.longdo.Map({
                placeholder: mapContainerRef.current,
            });

            mapRef.current.Route.enableContextMenu();
            mapRef.current.Route.auto(true);
        }
    }, []);

    // Update route when routeData changes
    useEffect(() => {
        if (mapRef.current && routeData) {
            const map = mapRef.current;
            // console.log('Route Data:', routeData);
            map.Overlays.clear();
            if (map.Route.clear) map.Route.clear();

            const startMarker = new window.longdo.Marker(routeData.startCoord, {
                title: 'Start',
                detail: routeData.startName || 'Start',
            });
            map.Route.add(startMarker);

            const destMarker = new window.longdo.Marker(routeData.destinationCoord, {
                title: 'Destination',
                detail: routeData.destinationName || 'Destination',
            });
            map.Route.add(destMarker);

            map.Route.search();

            setTimeout(() => {
                // map.Route.bound( routeData.startCoord.log , routeData.startCoord.lat, routeData.destinationCoord.log, routeData.destinationCoord.lat); 
            }, 500); 
        }
    }, [routeData]);

    return (
        <div className="relative h-screen">
            <div ref={mapContainerRef} id="routeMap" className="w-full h-full"></div>
        </div>
    );
}

export default RoutingMap;
