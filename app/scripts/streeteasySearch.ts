import SearchResults from "../lib/content/SearchResults";
import { injectStreeteasyMapOverlay } from "../lib/injectMapOverlay";
import updatePageContent from "../lib/updatePageContent";

function checkForResults() {
  console.log("Checking for search results..");
  if (SearchResults.visible()) {
    console.log("listings visible");
    clearTimeout(timer);
    updatePageContent(SearchResults);
  }
}

const timer = setInterval(checkForResults, 1000);

injectStreeteasyMapOverlay();
