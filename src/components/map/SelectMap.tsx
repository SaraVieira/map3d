import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Rectangle,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import L, { LatLng, LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import { css } from "@emotion/react";

function RectangleSelector({ isDrag = true }: { isDrag: boolean }) {
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [firstPoint, setFirstPoint] = useState<LatLng | null>(null);

  useEffect(() => {
    if (isDrag) {
      map.dragging.enable();
    } else {
      map.dragging.disable();
    }
  }, [isDrag]);

  const map = useMapEvents({
    mousedown(e) {
      if (isDrag == false) {
        setFirstPoint(e.latlng);
      }
    },
    mousemove(e) {
      if (firstPoint) {
        setBounds(new L.LatLngBounds(firstPoint, e.latlng));
      }
    },
    mouseup(e) {
      if (firstPoint) {
        setBounds(new L.LatLngBounds(firstPoint, e.latlng));
        console.log(firstPoint, e.latlng);
        setFirstPoint(null);
      }
    },
  });
  return bounds ? (
    <Rectangle bounds={bounds} pathOptions={{ color: "blue" }} />
  ) : null;
}

export function MapComponent() {
  const [isDrag, setIsDrag] = useState(true);
  const handleClickSwitchDrag = () => {
    setIsDrag(!isDrag);
  };
  return (
    <div
      css={css({
        position: "relative",
      })}
    >
      <button
        css={css({
          position: "absolute",
          zIndex: 9999,
          right: "1rem",
          top: "1rem",
          color: "#000000",
          backgroundColor: "#ffffff96",
          backdropFilter: "blur(8px)",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          outline: "rgba(240, 240, 244, 0.51) solid 0.1rem",
          cursor: "pointer",
          transition: "0.2s",
          ":hover": {
            backgroundColor: "#ebeef0c2",
          },
        })}
        onClick={handleClickSwitchDrag}
      >
        {isDrag ? "Disable" : "Enable"} Drag
      </button>

      <MapContainer
        center={[36.48656, 127.29064]}
        zoom={13}
        style={{ height: "70vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RectangleSelector isDrag={isDrag} />
      </MapContainer>
    </div>
  );
}
