import {searchResultsVisible, addTripsToSearchResults} from "../lib/content/searchResults"


function checkForResults() {
  console.log("Checking for search results..")
  if(searchResultsVisible()) {
    console.log("listings visible")
    clearTimeout(timer);
    addTripsToSearchResults()
  }
}

const timer = setInterval(checkForResults, 1000);

