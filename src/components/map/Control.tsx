import "leaflet-control-geocoder/dist/Control.Geocoder.css"
import "leaflet-control-geocoder"
import { useEffect } from "react"
import { useMap } from "react-leaflet"
import L, { Control } from "leaflet"

type NewControl = Control & { Geocoder: any; geocoder: any }

export function LeafletControlGeocoder() {
  const map = useMap()

  useEffect(() => {
    const c = L.Control as unknown as NewControl
    var geocoder = c.Geocoder.nominatim()
    if (typeof URLSearchParams !== "undefined" && location.search) {
      // parse /?geocoder=nominatim from URL
      var params = new URLSearchParams(location.search)
      var geocoderString = params.get("geocoder")
      if (geocoderString && c.Geocoder[geocoderString]) {
        geocoder = c.Geocoder[geocoderString]()
      } else if (geocoderString) {
        console.warn("Unsupported geocoder", geocoderString)
      }
    }

    c.geocoder({
      query: "",
      placeholder: "Search here...",
      defaultMarkGeocode: false,
      geocoder,
    })
      .on("markgeocode", function (e) {
        map.fitBounds(e.geocode.bbox)
      })
      .addTo(map)
  }, [])

  return null
}
