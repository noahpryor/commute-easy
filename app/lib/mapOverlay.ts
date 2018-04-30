// Add a layer displaying transit areas
// to a provided Leaflet.js map

declare const L: any

interface Shape {
  shell: number[]
  holes: number[]
}

interface Result {
  shapes: Shape[]
}

const addShape = (shape: Shape, map: any) => {
  L.polygon([shape.shell, shape.holes], {color: "#1EB300", opacity: 0.3}).addTo(map)
}

const addResultsToMap = (result: Result, map: any) => {
  return result.shapes.map(shape => addShape(shape, map))
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
    const mapData = getTransitMapData()
    addResultsToMap(mapData, map)
  } catch (e) {
    console.error("CommuteEasy: Adding transit data to map failed", e)
  }
}
