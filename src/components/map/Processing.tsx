import { useAreaStore } from "@/state/areaStore"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface Building {
  id: number
  tags: { [key: string]: string | undefined }
  geometry?: { lat: number; lng: number }[]
}

export function BuildingHeights({ area }: { area: any }) {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(false)

  const appendAreas = useAreaStore((state) => state.appendAreas)

  const requestBuildings = () => {
    setLoading(true)

    const south = area[1].lat
    const west = area[1].lng
    const north = area[0].lat
    const east = area[0].lng
    console.log(south, west, north, east)
    const query = `[out:json][timeout:25];(way["building"]( ${south},${west},${north},${east} );relation["building"]( ${south},${west},${north},${east} ););out body geom;`
    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => response.json())
      .then((data) => {
        const blds: any = data.elements.map((element) => ({
          id: element.id,
          tags: element.tags,
          geometry: element.geometry
            ? element.geometry.map((pt) => ({ lat: pt.lat, lng: pt.lon }))
            : undefined,
        }))
        setBuildings(blds)
        appendAreas(blds)

        console.log("Building Data:", blds)
      })
      .catch((error) => {
        console.error("Error fetching building data:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <button onClick={requestBuildings}>
        {loading && <Loader2 size={16} />}
        request
      </button>
      <ul>
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
  )
}
