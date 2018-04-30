console.log("I am injected")

const addShape = (shape, map) => {
  L.polygon([shape.shell, shape.holes]).addTo(map)
}

const addResultsToMap = (results, map) => {
  results.map(result => result.shapes.map(shape => addShape(shape, map)))
}

const addTransitTimeToMap = async (map) => {
  const data = await fetch("https://distancematrix-api.glitch.me/test/").then(response => response.json())
  addResultsToMap(data.results, map)
}

// Check if map is on page



// CL.maps exists if the page can show a map (e.g. a search results page)
// CL.maps.map holds the leaflet map global once the map has been visible

const timer = setInterval(addMapIfVisible, 1000);

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



