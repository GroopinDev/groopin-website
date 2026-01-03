"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Input from "../ui/input";

const SCRIPT_ID = "google-places-script";
let googlePlacesLoader = null;

const loadGooglePlaces = (apiKey) => {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }
  if (window.google?.maps?.places) {
    return Promise.resolve(true);
  }
  if (!apiKey) {
    return Promise.resolve(false);
  }
  if (googlePlacesLoader) {
    return googlePlacesLoader;
  }

  googlePlacesLoader = new Promise((resolve) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  return googlePlacesLoader;
};

export default function PlaceAutocomplete({
  label,
  value,
  onChange,
  onSelect,
  placeholder,
  error,
  required,
  countryCode,
  disabled
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const serviceRef = useRef(null);
  const blurTimeoutRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    loadGooglePlaces(apiKey).then((loaded) => {
      if (!isMounted) return;
      setIsReady(Boolean(loaded));
    });
    return () => {
      isMounted = false;
    };
  }, [apiKey]);

  useEffect(() => {
    if (!isReady || serviceRef.current) return;
    if (!window.google?.maps?.places) return;
    serviceRef.current = new window.google.maps.places.AutocompleteService();
  }, [isReady]);

  const requestOptions = useMemo(() => {
    const trimmedCountry = String(countryCode || "").trim().toLowerCase();
    if (!trimmedCountry) return null;
    return { componentRestrictions: { country: trimmedCountry } };
  }, [countryCode]);

  const updatePredictions = useCallback(
    (inputValue) => {
      const trimmed = String(inputValue || "").trim();
      if (!serviceRef.current || trimmed.length < 3) {
        setPredictions([]);
        return;
      }
      serviceRef.current.getPlacePredictions(
        {
          input: trimmed,
          ...(requestOptions || {})
        },
        (results, status) => {
          if (status !== "OK" || !results) {
            setPredictions([]);
            return;
          }
          setPredictions(results);
        }
      );
    },
    [requestOptions]
  );

  const handleInputChange = (event) => {
    const nextValue = event.target.value;
    onChange?.(nextValue);
    if (isReady) {
      updatePredictions(nextValue);
    }
  };

  const handleSelect = (prediction) => {
    const placeId = prediction?.place_id || "";
    const description = prediction?.description || "";
    onSelect?.({ placeId, description, prediction });
    setPredictions([]);
    setIsOpen(false);
  };

  const handleBlur = (event) => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    blurTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <Input
        label={label}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        error={error}
        required={required}
        disabled={disabled}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        autoComplete="off"
      />
      {isOpen && predictions.length > 0 ? (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-[#EADAF1] bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto py-2 text-sm text-secondary-500">
            {predictions.map((prediction) => (
              <li key={prediction.place_id}>
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleSelect(prediction);
                  }}
                  className="w-full px-4 py-2 text-left transition hover:bg-neutral-50"
                >
                  <span className="block font-medium text-primary-800">
                    {prediction.structured_formatting?.main_text ||
                      prediction.description}
                  </span>
                  {prediction.structured_formatting?.secondary_text ? (
                    <span className="block text-xs text-secondary-400">
                      {prediction.structured_formatting.secondary_text}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
