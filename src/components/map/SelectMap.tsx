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

function RectangleSelector({
  isDrag = true,
  bounds,
  onChange,
}: {
  isDrag: boolean;
  bounds: LatLngBounds | null;
  onChange: (LatLngBounds: LatLngBounds) => void;
}) {
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
        onChange(new L.LatLngBounds(firstPoint, e.latlng));
      }
    },
    mouseup(e) {
      if (firstPoint) {
        onChange(new L.LatLngBounds(firstPoint, e.latlng));
        setFirstPoint(null);
      }
    },
  });
  return bounds ? (
    <Rectangle bounds={bounds} pathOptions={{ color: "blue" }} />
  ) : null;
}

export function MapComponent({
  onDone,
  onRemove,
}: {
  onDone: (e) => void;
  onRemove: () => void;
}) {
  const [isDrag, setIsDrag] = useState(true);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  const handleClickSwitchDrag = () => {
    setIsDrag(!isDrag);
  };

  const handleClickRemoveBox = () => {
    onRemove();
    setBounds(null);
    setIsDrag(true);
  };

  const handleChangeDone = (e) => {
    setBounds(e);
    onDone([e._northEast, e._southWest]);
  };

  return (
    <div
      css={css({
        position: "relative",
      })}
    >
      <div
        css={css({
          position: "absolute",
          zIndex: 9999,
          right: "1rem",
          top: "1rem",
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.5rem",
        })}
      >
        <button
          css={css({
            display: isDrag ? "none" : "",
            color: "#ffffff",

            backgroundColor: "#ef4444",
            backdropFilter: "blur(8px)",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            outline: "#ef4444c2 solid 0.1rem",
            cursor: "pointer",
            transition: "0.2s",
            ":hover": {
              backgroundColor: "#ef4444",
            },
          })}
          onClick={handleClickRemoveBox}
        >
          Remove Box
        </button>

        <button
          css={css({
            color: isDrag ? "#ffffff" : "#000000",

            backgroundColor: isDrag ? "#007bffe8" : "#ffffff96",
            backdropFilter: "blur(8px)",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            outline: isDrag
              ? "#086ad4c2 solid 0.1rem"
              : "rgba(240, 240, 244, 0.51) solid 0.1rem",
            cursor: "pointer",
            transition: "0.2s",
            ":hover": {
              backgroundColor: isDrag ? "#085fbd" : "#ebeef0c2",
            },
          })}
          onClick={handleClickSwitchDrag}
        >
          {isDrag ? "Select Box" : "Back to Drag"}
        </button>
      </div>

      <MapContainer
        center={[36.48656, 127.29064]}
        zoom={13}
        style={{
          height: "70vh",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RectangleSelector
          bounds={bounds}
          isDrag={isDrag}
          onChange={handleChangeDone}
        />
      </MapContainer>
    </div>
  );
}
