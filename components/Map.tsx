"use client";
import {Doc} from "@/convex/_generated/dataModel";
import {colors} from "@/lib/constants";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  useGoogleMap,
  OverlayView,
} from "@react-google-maps/api";
import {useEffect, useState} from "react";

type MapProps = {
  topPlacesToVisit: Doc<"plan">["topplacestovisit"] | undefined;
  selectedPlace: {lat: number; lng: number} | undefined;
};

export default function Map({topPlacesToVisit, selectedPlace}: MapProps) {
  const {isLoaded} = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [mapCenter, setMapCenter] = useState(selectedPlace);
  const [mapZoom, setMapZoom] = useState(13);

  const handleMarkerClick = (lat: number, lng: number) => {
    zoomSelecedPlace(lat, lng);
  };

  useEffect(() => {
    if (!selectedPlace) return;
    zoomSelecedPlace(selectedPlace?.lat, selectedPlace?.lng);
  }, [selectedPlace]);

  const zoomSelecedPlace = (lat: number, lng: number) => {
    setMapCenter({lat, lng});
    setMapZoom(16);
  };

  return (
    isLoaded && (
      <GoogleMap
        mapContainerStyle={{height: "100%", width: "100%"}}
        center={mapCenter}
        zoom={mapZoom}
        options={{
          disableDefaultUI: false,
          clickableIcons: true,
          scrollwheel: true,
        }}
      >
        {topPlacesToVisit?.map((place, index) => (
          <OverlayView
            position={place.coordinates}
            key={place.name}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <MapPinMarker index={index} />
          </OverlayView>
        ))}
      </GoogleMap>
    )
  );
}

export const MapPinMarker = ({index}: {index: number}) => {
  return (
    <div
      aria-label="Map marker"
      className="mapboxgl-marker"
      role="button"
      aria-expanded="false"
      style={{
        opacity: 1,
        pointerEvents: "auto",
      }}
    >
      <div style={{transform: "none"}}>
        <div
          className="absolute flex h-[32px] w-[32px] rotate-[-45deg] items-center justify-center rounded-full !rounded-bl-none border-4 border-solid border-white p-1 shadow-[2px_2px_2px_-1px_rgba(0,0,0,0.43)]"
          style={{backgroundColor: colors[index % 6]}}
        >
          <p className="w-[10px] rotate-[45deg] text-base font-bold text-white">
            {index + 1}
          </p>
        </div>
      </div>
    </div>
  );
};
