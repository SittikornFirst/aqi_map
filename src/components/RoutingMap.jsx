import React, { useEffect, useRef } from 'react';

function RoutingMap({ routeData }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        // Initialize the Longdo Map if it hasn't been already.
        if (window.longdo && !mapRef.current) {
            mapRef.current = new window.longdo.Map({ placeholder: mapContainerRef.current });
            mapRef.current.Route.enableContextMenu();
            mapRef.current.Route.auto(true);
        }
    }, []);

    useEffect(() => {
        if (mapRef.current && routeData) {
            // Clear previous routing markers if a clear method is available.
            if (mapRef.current.Route.clear) {
                mapRef.current.Route.clear();
            }
            // Add start marker.
            const startMarker = new window.longdo.Marker(routeData.startCoord, {
                title: 'Start',
                detail: routeData.startName || 'Start'
            });
            mapRef.current.Route.add(startMarker);
            // Add destination marker.
            const destMarker = new window.longdo.Marker(routeData.destinationCoord, {
                title: 'Destination',
                detail: routeData.destinationName || 'Destination'
            });
            mapRef.current.Route.add(destMarker);
            // Trigger the route search to display the calculated path.
            mapRef.current.Route.search();
        }
    }, [routeData]);

    return (
        <div className="relative h-screen">
            <div ref={mapContainerRef} id="routeMap" className="w-full h-full"></div>
        </div>
    );
}

export default RoutingMap;
