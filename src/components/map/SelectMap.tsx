import { useEffect, useRef, useState } from "react"
import { MapContainer, Rectangle, TileLayer, useMapEvents } from "react-leaflet"
import L, { LatLng, LatLngBounds, LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"
import { CircleMinus, MousePointerClick } from "lucide-react"
import { LeafletControlGeocoder } from "./Control"
import { useGeolocated } from "react-geolocated"
import { RectangleSelector } from "./RectangleSelector"

export function MapComponent({
  onDone,
  onRemove,
}: {
  onDone: (e) => void
  onRemove: () => void
}) {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    })
  const [center, setCenter] = useState<LatLngExpression>([40.8, -73.95])
  const [isDrag, setIsDrag] = useState(true)
  const [bounds, setBounds] = useState<LatLngBounds | null>(null)
  const [drawBounds, setDrawBounds] = useState<LatLngBounds | null>(null)

  const handleClickSwitchDrag = () => {
    setIsDrag(!isDrag)
  }

  const handleClickRemoveBox = () => {
    onRemove()
    setBounds(null)
    setDrawBounds(null)
    setIsDrag(true)
  }

  const handleChangeDone = (e) => {
    setBounds(e)
    onDone([e._northEast, e._southWest])
  }

  const handleChangeDraw = (e) => {
    setDrawBounds(e)
    onDone([e._northEast, e._southWest])
  }

  useEffect(() => {
    if (coords) {
      setCenter([coords.latitude, coords.longitude])
    }
  }, [coords])

  return (
    <div>
      <div>
        <button
          style={{
            display: bounds == null || isDrag == true ? "none" : "flex",
          }}
          onClick={handleClickRemoveBox}
        >
          <CircleMinus /> Remove Box
        </button>

        <button
          style={{ color: isDrag ? "#ffffff" : "#000000" }}
          onClick={handleClickSwitchDrag}
        >
          {isDrag ? <SelectBox /> : "Back to Drag"}
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={13}
        style={{
          height: "70vh",
          width: "100vw",
        }}
      >
        <LeafletControlGeocoder />
        <TileLayer
          attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
          url="	https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />
        <RectangleSelector
          bounds={bounds}
          drawBounds={drawBounds}
          isDrag={isDrag}
          onChange={handleChangeDone}
          onDrawChange={handleChangeDraw}
        />
      </MapContainer>
    </div>
  )
}

function SelectBox() {
  return (
    <>
      <MousePointerClick />
      <span>Select Box</span>
    </>
  )
}
