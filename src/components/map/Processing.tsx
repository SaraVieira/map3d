import { useAreaStore } from "@/state/areaStore";
import { css } from "@emotion/react";
import React, { useState } from "react";

interface Building {
  id: number;
  tags: { [key: string]: string | undefined };
  geometry?: { lat: number; lng: number }[];
}

export function BuildingHeights({ area }: { area: any }) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const appendAreas = useAreaStore((state) => state.appendAreas);

  const requestBuildings = () => {
    const south = area[1].lat;
    const west = area[1].lng;
    const north = area[0].lat;
    const east = area[0].lng;
    console.log(south, west, north, east);
    const query = `[out:json][timeout:25];(way["building"]( ${south},${west},${north},${east} );relation["building"]( ${south},${west},${north},${east} ););out body geom;`;
    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => response.json())
      .then((data) => {
        const blds: Building[] = data.elements.map((element) => ({
          id: element.id,
          tags: element.tags,
          geometry: element.geometry
            ? element.geometry.map((pt) => ({ lat: pt.lat, lng: pt.lon }))
            : undefined,
        }));
        setBuildings(blds);
        appendAreas(blds);

        console.log("Building Data:", blds);
      })
      .catch((error) => {
        console.error("Error fetching building data:", error);
      });
  };

  return (
    <div
      css={css({
        position: "relative",
      })}
    >
      <button
        css={css({
          color: "#ffffff",

          backgroundColor: "#007bffe8",
          backdropFilter: "blur(8px)",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          outline: "#086ad4c2 solid 0.1rem",
          cursor: "pointer",
          transition: "0.2s",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          ":hover": {
            backgroundColor: "#085fbd",
          },
        })}
        onClick={requestBuildings}
      >
        request
      </button>
      <ul
        css={css({
          overflow: "scroll",
          zIndex: 999,
          position: "absolute",
          top: "1rem",
          height: "80vh",
        })}
      >
        {buildings.map((b) => (
          <li key={b.id}>
            <div>Building {b.id}</div>
            <div>Height: {b.tags.height || "No height info"}</div>
            <div>Location/Shape:</div>
            {b.geometry ? (
              <ul>
                {b.geometry.map((pt, index) => (
                  <li key={index}>
                    ({pt.lat.toFixed(5)}, {pt.lng.toFixed(5)})
                  </li>
                ))}
              </ul>
            ) : (
              <div>No geometry info</div>
            )}
            <div>Other Tags: {JSON.stringify(b.tags)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
