import React, { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FitBounds({ coordinates }) {
    const map = useMap();

    useEffect(() => {
        if (coordinates?.length >= 3) {
            const bounds = coordinates.map(({ lat, lng }) => [lat, lng]);
            map.fitBounds(bounds, { maxZoom: 17, padding: [16, 16] });
        }
    }, [coordinates, map]);

    return null;
}

export default function FarmMap({ coordinates = [] }) {
    const center = coordinates.length
        ? [
            coordinates.reduce((sum, c) => sum + c.lat, 0) / coordinates.length,
            coordinates.reduce((sum, c) => sum + c.lng, 0) / coordinates.length,
        ]
        : [28.6139, 77.209]; 

    return (
        // <div className="relative w-full">
            <MapContainer
                center={center}
                zoom={15}
                className="w-full h-full z-0"
                scrollWheelZoom={false}
                zoomControl={true} >
                <TileLayer
                    url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                    maxZoom={22}
                />

                {coordinates.length >= 3 && (
                    <Polygon
                        positions={coordinates.map(({ lat, lng }) => [lat, lng])}
                        pathOptions={{ color: "#FFD700", weight: 2 }}
                    />
                )}

                <FitBounds coordinates={coordinates} />
            </MapContainer>
        // </div>
    );
}
