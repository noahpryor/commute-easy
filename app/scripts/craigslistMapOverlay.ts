import { addTransitTimeToMap } from "../lib/mapOverlay";

// Craigslist globals
declare const CL: any;

const timer = setInterval(addMapIfVisible, 1000);

// Check if map is on page
// CL.maps exists if the page can show a map (e.g. a search results page)
// CL.maps.map holds the leaflet map global once the map has been visible
function addMapIfVisible() {
  if (!CL.maps) {
    console.log("No map on page, ejecting");
    clearTimeout(timer);
  }
  if (CL.maps.map) {
    addTransitTimeToMap(CL.maps.map);
    clearTimeout(timer);
    console.log("commute times added to map");
  }
}
