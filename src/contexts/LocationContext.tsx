import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface LocationState {
    latitude: number | null;
    longitude: number | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    error: string | null;
    loading: boolean;
}

export interface LocationContextType extends LocationState {
    detectLocation: () => Promise<void>;
    updateLocation: (city: string) => void;
}

export const LocationContext = createContext<LocationContextType>({
    latitude: null,
    longitude: null,
    city: null,
    state: null,
    pincode: null,
    error: null,
    loading: false,
    detectLocation: async () => { },
    updateLocation: () => { },
});

interface LocationProviderProps {
    children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
    const [location, setLocation] = useState<Omit<LocationState, "loading" | "error">>({
        latitude: null,
        longitude: null,
        city: null,
        state: null,
        pincode: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if location is already saved in local storage
    useEffect(() => {
        const savedLocation = localStorage.getItem("user_location");
        if (savedLocation) {
            try {
                setLocation(JSON.parse(savedLocation));
            } catch (e) {
                console.error("Failed to parse saved location", e);
            }
        }
    }, []);

    const detectLocation = async () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Reverse geocoding using a free API (BigDataCloud)
                    // Note: In a production app, use a robust service like Google Maps API
                    const response = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    const data = await response.json();

                    const newLocation = {
                        latitude,
                        longitude,
                        city: data.city || data.locality || "Unknown City",
                        state: data.principalSubdivision || "Unknown State",
                        pincode: data.postcode || null,
                    };

                    setLocation(newLocation);
                    localStorage.setItem("user_location", JSON.stringify(newLocation));
                } catch (err) {
                    console.error("Reverse geocoding failed", err);
                    // Fallback to just coordinates if reverse geocoding fails
                    const fallbackLocation = {
                        latitude,
                        longitude,
                        city: "Current Location",
                        state: null,
                        pincode: null,
                    };
                    setLocation(fallbackLocation);
                    localStorage.setItem("user_location", JSON.stringify(fallbackLocation));
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setLoading(false);
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("Location permission denied");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("Location information is unavailable");
                        break;
                    case err.TIMEOUT:
                        setError("Location request timed out");
                        break;
                    default:
                        setError("An unknown error occurred");
                        break;
                }
            }
        );
    };

    const updateLocation = (city: string) => {
        const newLocation = {
            ...location,
            city,
            // Reset other granular fields since we only know city
            latitude: null,
            longitude: null,
            state: null,
            pincode: null,
        };
        setLocation(newLocation);
        localStorage.setItem("user_location", JSON.stringify(newLocation));
    };

    return (
        <LocationContext.Provider
            value={{
                ...location,
                loading,
                error,
                detectLocation,
                updateLocation,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};
