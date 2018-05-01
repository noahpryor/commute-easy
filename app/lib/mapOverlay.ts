// Add a layer displaying transit areas
// to a provided Leaflet.js map
import {StringKeyedMap} from "./interfaces"
declare const L: any

interface Shape {
  shell: number[]
  holes: number[]
}

interface Result {
  shapes: Shape[]
  mode: string
  commuteMinutes: number
}

const createPolygon = (shape: Shape) => {
  return L.polygon([shape.shell, shape.holes], {
    color: "#1EB300",
    opacity: 0.3,
  })
}

const createCommuteLayerGroup = (shapes: Shape[]) => {
  const polygons = shapes.map(createPolygon)
  return L.layerGroup(polygons)
}


// Map polygons are embedded as json in the data-data attribute
// on the script tag
const getTransitMapData = () => {
  const $injectedScript = document.querySelector(
    ".commute-easy-injected-script"
  )
  return JSON.parse($injectedScript.getAttribute("data-data"))
}


export function addTransitTimeToMap(map: any) {
  try {
    const {
      shapes,
      mode,
      commuteMinutes
    } = getTransitMapData()

    const commuteLayer = createCommuteLayerGroup(shapes)
    const layerGroupName = `<${commuteMinutes}m ${mode}`

    const layerControls: StringKeyedMap = {}

    layerControls[layerGroupName] = commuteLayer
    commuteLayer.addTo(map)

    const controls = L.control.layers({},layerControls, {collapsed: false})

    controls.addTo(map)
    // addResultsToMap(mapLayer, map)
  } catch (e) {
    console.error("CommuteEasy: Adding transit data to map failed", e)
  }
}
