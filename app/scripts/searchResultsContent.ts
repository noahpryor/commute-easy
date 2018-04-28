
import SearchResults from "../lib/content/SearchResults"

import updatePageContent from "../lib/updatePageContent"

import {PageContent} from "../lib/interfaces"


function checkForResults() {
  console.log("Checking for search results..")
  if(SearchResults.visible()) {
    console.log("listings visible")
    clearTimeout(timer);
    updatePageContent(SearchResults)
  }
}

const timer = setInterval(checkForResults, 1000);

