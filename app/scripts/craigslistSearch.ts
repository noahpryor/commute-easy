import {Listing} from "../lib/interfaces"

function getJSONSearchResultsUrl() {
  return document.location.toString().replace("/search/","/jsonsearch/")
}
interface Result {
  Latitude: number;
  Longitude: number;
  PostingID: number;
}
const formatResult = (result: Result): Listing => {
  const location = `${result.Latitude}${result.Longitude}`
  return {
    id: result.PostingID.toString(),
    location
  }
}
// Hit the maps API to get the lat longs for listings
// Since it isn't included in the html on the search results page
//
async function getListings() {
  const searchUrl = getJSONSearchResultsUrl()
  const [results] = await fetch(searchUrl).then(res => res.json())
  return results.map(formatResult)
}
getListings().then(console.log)
