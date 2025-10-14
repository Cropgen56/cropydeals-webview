import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

const SearchField = ({ onLocationSelect }) => {
    const map = useMap();

    useEffect(() => {
        // Create GeoSearch provider
        const provider = new OpenStreetMapProvider();

        // Create GeoSearchControl with custom options
        const searchControl = new GeoSearchControl({
            provider,
            style: "bar",
            showMarker: true,
            retainZoomLevel: false,
            autoComplete: true,
        });

        // Add search control to the map
        map.addControl(searchControl);

        // Wait until the control is fully rendered to access the container
        const checkContainer = setInterval(() => {
            const container = searchControl._container;
            if (container) {
                clearInterval(checkContainer);

                // Apply custom styles directly to the search control container
                container.style.position = "absolute";
                container.style.top = "100vh";
                container.style.left = "50%";
                container.style.transform = "translateX(-50%)";
                container.style.zIndex = 1000;
                container.style.width = "80%";
                container.style.borderRadius = "30px";
                container.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";

                // Style the search bar
                const searchBar = container.querySelector('.geosearch-bar');
                if (searchBar) {
                    searchBar.style.borderRadius = "30px";
                    searchBar.style.backgroundColor = "#f0f0f0";
                    searchBar.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
                }

                // Style the input
                const input = container.querySelector('.geosearch-bar input');
                if (input) {
                    input.style.width = "100%";
                    input.style.height = "40px";
                    input.style.padding = "10px";
                    input.style.borderRadius = "30px";
                    input.style.border = "1px solid #ccc";
                    input.style.fontSize = "16px";
                    input.style.boxSizing = "border-box";
                }

                // Style the button
                const button = container.querySelector('.geosearch-bar button');
                if (button) {
                    button.style.position = "absolute";
                    button.style.right = "10px";
                    button.style.top = "50%";
                    button.style.transform = "translateY(-50%)";
                    button.style.backgroundColor = "#075a53";
                    button.style.border = "none";
                    button.style.color = "#fff";
                    button.style.padding = "8px";
                    button.style.borderRadius = "50%";
                    button.style.cursor = "pointer";
                    button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";

                    // Add hover effect
                    button.addEventListener('mouseenter', () => {
                        button.style.backgroundColor = "#4a8f7d";
                    });
                    button.addEventListener('mouseleave', () => {
                        button.style.backgroundColor = "#075a53";
                    });
                }

                // Apply mobile responsive styles
                const applyResponsiveStyles = () => {
                    const isMobile = window.innerWidth <= 768;

                    if (isMobile) {
                        container.style.width = "90%";
                        container.style.top = "5vh";

                        if (input) {
                            input.style.height = "35px";
                            input.style.fontSize = "14px";
                        }

                        if (button) {
                            button.style.padding = "6px";
                        }
                    } else {
                        container.style.width = "80%";
                        container.style.top = "100vh";

                        if (input) {
                            input.style.height = "40px";
                            input.style.fontSize = "16px";
                        }

                        if (button) {
                            button.style.padding = "8px";
                        }
                    }
                };

                // Apply responsive styles initially
                applyResponsiveStyles();

                // Add resize listener for responsive behavior
                window.addEventListener('resize', applyResponsiveStyles);

                // Store the cleanup function
                container._cleanupResize = () => {
                    window.removeEventListener('resize', applyResponsiveStyles);
                };
            }
        }, 100);

        // Handle location selection from the search box
        map.on("geosearch/showlocation", (result) => {
            const { x, y, label } = result.location;
            onLocationSelect({ lat: y, lng: x, name: label });
            map.setView([y, x], 18);
        });

        // Clean up search control when the component is unmounted
        return () => {
            const container = searchControl._container;
            if (container && container._cleanupResize) {
                container._cleanupResize();
            }
            map.removeControl(searchControl);
            clearInterval(checkContainer);
        };
    }, [map, onLocationSelect]);

    return null;
};

export default SearchField;