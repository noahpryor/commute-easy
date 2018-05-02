import { injectMapOverlay } from "../lib/injectMapOverlay";
import { Listing } from "../lib/interfaces";

function getJSONSearchResultsUrl() {
  return document.location.toString().replace("/search/", "/jsonsearch/");
}
interface Result {
  Latitude: number;
  Longitude: number;
  PostingID: number;
}

const formatResult = (result: Result): Listing => {
  const location = `${result.Latitude}${result.Longitude}`;
  return {
    location,
    id: result.PostingID.toString(),
  };
};
// Hit the maps API to get the lat longs for listings
// Since it isn't included in the html on the search results page
//
async function getListings() {
  const searchUrl = getJSONSearchResultsUrl();
  const [results] = await fetch(searchUrl).then(res => res.json());
  return results.map(formatResult);
}
// getListings().then(console.log)

console.log("on listings page");

injectMapOverlay("scripts/craigslistMapOverlay.js");
