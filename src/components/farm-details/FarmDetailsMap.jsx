import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  MapContainer,
  TileLayer,
  Polygon,
  ImageOverlay,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "../common/Loader";

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
  const { indexData, isLoading } = useSelector((state) => state.satellite);

  // Calculate the map center
  const center = useMemo(() => {
    if (coordinates.length) {
      const lat =
        coordinates.reduce((sum, c) => sum + c.lat, 0) / coordinates.length;
      const lng =
        coordinates.reduce((sum, c) => sum + c.lng, 0) / coordinates.length;
      return [lat, lng];
    }
    return [28.6139, 77.209]; // default (Delhi)
  }, [coordinates]);

  // Compute bounds for image overlay
  const bounds = useMemo(() => {
    if (coordinates.length >= 3) {
      const latLngs = coordinates.map(({ lat, lng }) => [lat, lng]);
      return L.latLngBounds(latLngs);
    }
    return null;
  }, [coordinates]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={15}
        className="w-full h-full z-0"
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          maxZoom={22}
        />

        {/* Polygon Boundary */}
        {coordinates.length >= 3 && (
          <Polygon
            positions={coordinates.map(({ lat, lng }) => [lat, lng])}
            pathOptions={{ color: "#FFD700", weight: 2 }}
          />
        )}

        {/* Base64 Image Overlay */}
        {indexData?.image_base64 && bounds && (
          <ImageOverlay
            url={`data:image/png;base64,${indexData.image_base64}`}
            bounds={bounds}
            opacity={1}
          />
        )}

        <FitBounds coordinates={coordinates} />
      </MapContainer>

      {/* Loader overlay */}
      {isLoading?.index && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[1999]">
          <Loading />
        </div>
      )}
    </div>
  );
}
