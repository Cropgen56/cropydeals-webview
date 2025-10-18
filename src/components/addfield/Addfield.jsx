import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  AddFieldIcon,
  BackButtonIcon,
  CurrentLocationIcon,
  DeleteFieldIcon,
  LeftArrowIcon,
  SaveIcon,
} from "../../assets/Icons";
import AddFieldDetails from "./AddFieldDetails";
import UpdateFarmDetails from "./UpdateFarmDetails";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import { getCityState } from "../../utils/getUserLocation";
import { useTranslation } from "react-i18next";

// --- Updated geolocation helper with retry ---
export const getCurrentLocation = ({ setLocation, retries = 3 }) => {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (position?.coords) {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } else {
        console.error("Position coordinates are undefined.");
      }
    },
    (err) => {
      console.error("Error fetching location:", err.message);
      if (retries > 0) {
        // Retry after 2 seconds
        setTimeout(() => getCurrentLocation({ setLocation, retries: retries - 1 }), 2000);
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};

const AddFieldMap = ({ setIsSubmitting }) => {
  const data = useLocation();
  const farmDetails = data.state;
  const { t } = useTranslation();  
  

  const [markers, setMarkers] = useState([]);
  const [isAddingMarkers, setIsAddingMarkers] = useState(false);
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const navigate = useNavigate();
  const [selectedIcon, setSelectedIcon] = useState("");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    if (farmDetails) setIsOpen(true);
  }, []);

  // Get current location
  useEffect(() => {
    getCurrentLocation({
      setLocation: (loc) => {
        setLocation(loc);
        if (loc?.latitude && loc?.longitude) {
          setSelectedLocation({
            lat: loc.latitude,
            lng: loc.longitude,
            name: "Your Current Location",
          });

          getCityState({
            lat: loc.latitude,
            lng: loc.longitude,
            setCity,
            setState,
          });
        } else {
          setLocationError(true);
        }
      },
    });
  }, []);

  const yellowMarkerIcon = new L.divIcon({
    className: "yellow-marker",
    html: '<div style="background-color: yellow; border-radius: 50%; width: 15px; height: 15px; border: 1px solid #ffcc00;"></div>',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
  });

  const toggleForm = () => {
    if (markers.length >= 3) setIsOpen(!isOpen);
    else alert(t("please_complete_field_first"));
  };

  const clearMarkers = () => setMarkers([]);
  const removeLastMarker = () => {
    setMarkers((currentMarkers) => {
      if (currentMarkers.length === 0) {
        alert(t("no_markers_left_to_remove"));
        return currentMarkers;
      }
      return currentMarkers.slice(0, -1);
    });
  };

  const Markers = () => {
    useMapEvents({
      click: (e) => {
        if (isAddingMarkers) {
          const { lat, lng } = e.latlng;
          setMarkers((currentMarkers) =>
            currentMarkers.length > 12
              ? [...currentMarkers.slice(1), { lat, lng }]
              : [...currentMarkers, { lat, lng }]
          );
        }
      },
    });
    return null;
  };

  const CurrentLocationButton = ({ onLocationFound }) => {
    const map = useMap();

    const handleCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            onLocationFound({
              lat: latitude,
              lng: longitude,
              name: "Your Current Location",
            });
            map.setView([latitude, longitude], 18);
          },
          () => alert("Unable to fetch your location."),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        alert("Geolocation not supported.");
      }
    };

    return (
      <button
        className={`absolute top-[65vh] right-4 z-[1000] p-3.5 bg-[#075a53] text-white border-none rounded-[50px] cursor-pointer ${
          selectedIcon === "current-location" ? "!bg-[#0a796f]" : ""
        }`}
        onClick={() => {
          handleCurrentLocation();
          setSelectedIcon("current-location");
        }}
      >
        <CurrentLocationIcon />
      </button>
    );
  };

  const SearchField = ({ onLocationSelect }) => {
    const map = useMap();

    useEffect(() => {
      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider,
        style: "bar",
        showMarker: true,
        retainZoomLevel: false,
        autoComplete: true,
      });

      map.addControl(searchControl);

      map.on("geosearch/showlocation", (result) => {
        const { x, y, label } = result.location;
        onLocationSelect({ lat: y, lng: x, name: label });
        map.setView([y, x], 18);
      });

      return () => map.removeControl(searchControl);
    }, [map, onLocationSelect]);

    return <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-[500px]"></div>;
  };

  // Custom Leaflet bar style
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `.leaflet-bar { width: 100%; }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (locationError)
    return (
      <div className="h-screen flex items-center justify-center text-red-600">
        {t("unable_to_fetch_location")}
      </div>
    );

  return (
    <div className="h-screen flex flex-col items-center add-field">
      {selectedLocation?.lat && selectedLocation?.lng && (
        <>
          <div className="absolute top-0 w-full z-[1000] flex justify-between items-center p-2.5 shadow-md">
            <div className="cursor-pointer" onClick={() => navigate(-1)}>
              <LeftArrowIcon />
            </div>
          </div>

          <MapContainer
            center={[selectedLocation.lat, selectedLocation.lng]}
            zoom={17}
            zoomControl={false}
            className="h-screen w-screen m-0 p-0"
            attributionControl={false}
          >
            <TileLayer
              attribution=""
              url="http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
              maxZoom={50}
            />

            {markers.map((marker, idx) => (
              <Marker
                key={idx}
                position={[marker.lat, marker.lng]}
                icon={yellowMarkerIcon}
              >
                <Popup>
                  {t("marker_at")} [{marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}]
                </Popup>
              </Marker>
            ))}

            {markers.length > 0 && (
              <Polygon
                positions={markers.map((marker) => [marker.lat, marker.lng])}
                color="yellow"
              />
            )}

            <Markers />
            <SearchField onLocationSelect={setSelectedLocation} />
            <CurrentLocationButton onLocationFound={setSelectedLocation} />
          </MapContainer>

          {/* Buttons */}
          <div className="absolute top-[20vh] right-5 flex flex-col gap-5 z-[1100]">
            <button
              onClick={removeLastMarker}
              className="p-3 bg-[#075a53] text-white rounded-full"
            >
              <BackButtonIcon />
            </button>
            <button
              onClick={() => setIsAddingMarkers(!isAddingMarkers)}
              className="p-3 bg-[#075a53] text-white rounded-full"
            >
              <AddFieldIcon />
            </button>
            <button
              onClick={toggleForm}
              className="p-3 bg-[#075a53] text-white rounded-full"
            >
              <SaveIcon />
            </button>
            <button
              onClick={clearMarkers}
              className="p-3 bg-[#075a53] text-white rounded-full"
            >
              <DeleteFieldIcon />
            </button>
          </div>

          {/* Add/Update Farm Details Form */}
          {farmDetails ? (
            <UpdateFarmDetails
              isOpen={isOpen}
              toggleForm={toggleForm}
              fieldCoordinate={markers}
              setIsSubmitting={setIsSubmitting}
              farmDetails={farmDetails}
            />
          ) : (
            <AddFieldDetails
              isOpen={isOpen}
              toggleForm={toggleForm}
              fieldCoordinate={markers}
              setIsSubmitting={setIsSubmitting}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AddFieldMap;
