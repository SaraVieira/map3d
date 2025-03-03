import L, { LatLng, LatLngBounds } from "leaflet"
import { useEffect, useRef, useState } from "react"
import { Rectangle, useMapEvents } from "react-leaflet"

export function RectangleSelector({
  isDrag = true,
  bounds,
  drawBounds,
  onChange,
  onDrawChange,
}: {
  isDrag: boolean
  bounds: LatLngBounds | null
  drawBounds: LatLngBounds | null
  onChange: (bounds: LatLngBounds) => void
  onDrawChange: (bounds: LatLngBounds) => void
}) {
  const [firstPoint, setFirstPoint] = useState<LatLng | null>(null)

  const lastLatlngRef = useRef<LatLng | null>(null)

  const adjustLng = (latlng: LatLng): LatLng => {
    const adjustedLng = ((((latlng.lng + 180) % 360) + 360) % 360) - 180
    return new L.LatLng(latlng.lat, adjustedLng)
  }

  const map = useMapEvents({
    mousedown(e) {
      if (!isDrag) {
        setFirstPoint(e.latlng)
      }
    },
    mousemove(e) {
      if (firstPoint) {
        lastLatlngRef.current = adjustLng(e.latlng)
        onDrawChange(new L.LatLngBounds(firstPoint, e.latlng))
        onChange(new L.LatLngBounds(adjustLng(firstPoint), adjustLng(e.latlng)))
      }
    },
    mouseup(e) {
      if (firstPoint) {
        onDrawChange(new L.LatLngBounds(firstPoint, e.latlng))
        onChange(new L.LatLngBounds(adjustLng(firstPoint), adjustLng(e.latlng)))
        setFirstPoint(null)
      }
    },
  })

  useEffect(() => {
    const container = map.getContainer()
    const handleTouchStart = (e: TouchEvent) => {
      if (!isDrag && e.touches.length > 0) {
        const touch = e.touches[0]
        const latlng = map.mouseEventToLatLng(touch as any)
        setFirstPoint(latlng)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (firstPoint && e.touches.length > 0) {
        const touch = e.touches[0]
        const latlng = map.mouseEventToLatLng(touch as any)
        lastLatlngRef.current = latlng

        onDrawChange(new L.LatLngBounds(firstPoint, latlng))
        onChange(new L.LatLngBounds(adjustLng(firstPoint), adjustLng(latlng)))
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (firstPoint) {
        const latlng = lastLatlngRef.current || firstPoint

        onDrawChange(new L.LatLngBounds(firstPoint, latlng))
        onChange(new L.LatLngBounds(adjustLng(firstPoint), adjustLng(latlng)))
        setFirstPoint(null)
      }
    }

    container.addEventListener("touchstart", handleTouchStart)
    container.addEventListener("touchmove", handleTouchMove)
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [map, isDrag, firstPoint, onChange])

  useEffect(() => {
    if (map) {
      isDrag ? map.dragging.enable() : map.dragging.disable()
    }
  }, [isDrag, map])

  return drawBounds ? (
    <Rectangle bounds={drawBounds} pathOptions={{ color: "blue" }} />
  ) : null
}
