"use client";
import {Doc} from "@/convex/_generated/dataModel";
import {colors, MAPS_DARK_MODE_STYLES} from "@/lib/constants";
import {GoogleMap, useJsApiLoader, OverlayView, Libraries} from "@react-google-maps/api";
import {MapPin} from "lucide-react";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

type MapProps = {
  topPlacesToVisit: (Doc<"plan">["topplacestovisit"][number] & {id: string})[] | undefined;
  selectedPlace: {lat: number; lng: number} | undefined;
};

export default function Map({topPlacesToVisit, selectedPlace}: MapProps) {
  const [mapCenter, setMapCenter] = useState(selectedPlace);
  const [mapZoom, setMapZoom] = useState(13);

  const {resolvedTheme} = useTheme();

  useEffect(() => {
    if (!selectedPlace) return;
    zoomSelecedPlace(selectedPlace?.lat, selectedPlace?.lng);
  }, [selectedPlace]);

  const zoomSelecedPlace = (lat: number, lng: number) => {
    setMapCenter({lat, lng});
    setMapZoom(16);
  };

  return topPlacesToVisit && topPlacesToVisit?.length > 0 ? (
    <GoogleMap
      mapContainerStyle={{height: "100%", width: "100%"}}
      center={mapCenter}
      zoom={mapZoom}
      options={{
        styles: resolvedTheme === "dark" ? MAPS_DARK_MODE_STYLES : [],
        disableDefaultUI: false,
        clickableIcons: true,
        scrollwheel: true,
      }}
    >
      {topPlacesToVisit?.map((place, index) => (
        <OverlayView
          position={place.coordinates}
          key={place.id}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <MapPinMarker index={index} />
        </OverlayView>
      ))}
    </GoogleMap>
  ) : (
    <div className="w-full h-full flex flex-col gap-2 justify-center items-center bg-background text-balance px-2 text-center">
      <MapPin className="h-20 w-20" />
      <span>Search and select a lcoation to add to places to visit</span>
    </div>
  );
}

const MapPinMarker = ({index}: {index: number}) => {
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
          <p className="w-[10px] rotate-[45deg] text-base font-bold text-white">{index + 1}</p>
        </div>
      </div>
    </div>
  );
};
