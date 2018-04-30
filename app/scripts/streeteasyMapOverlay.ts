import { addTransitTimeToMap } from "../lib/mapOverlay"

// StreetEasy globals
declare const SEMaps: any

const leafletMap = SEMaps._maps.map
if (leafletMap) {
  addTransitTimeToMap(leafletMap)
}
