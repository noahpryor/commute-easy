// Craigslist globals
declare const CL: any;
declare const L: any;

interface Shape {
  shell: number[];
  holes: number[];
}

interface Result {
  shapes: Shape[];
}


const addShape = (shape: Shape, map: any) => {
  L.polygon([shape.shell, shape.holes]).addTo(map)
}

const addResultsToMap = (result: Result, map: any) => {
  result.shapes.map(shape => addShape(shape, map))
}

const addTransitTimeToMap = async (map: any) => {
  const $injectedScript = document.querySelector(".commute-easy-injected-script")
  const mapData = JSON.parse($injectedScript.dataset.data)
  addResultsToMap(mapData, map)
}

const timer = setInterval(addMapIfVisible, 1000);

// Check if map is on page
// CL.maps exists if the page can show a map (e.g. a search results page)
// CL.maps.map holds the leaflet map global once the map has been visible
function addMapIfVisible() {
  if(!CL.maps) {
    console.log("No map on page, ejecting")
    clearTimeout(timer);
  }
  if(CL.maps.map) {
    addTransitTimeToMap(CL.maps.map)
    clearTimeout(timer);
    console.log("commute times added to map")
  }
}



