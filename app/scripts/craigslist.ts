
// import SearchResults from "../lib/content/SearchResults"

// import updatePageContent from "../lib/updatePageContent"

// import {PageContent} from "../lib/interfaces"


// function checkForResults() {
//   console.log("Checking for search results..")
//   if(SearchResults.visible()) {
//     console.log("listings visible")
//     clearTimeout(timer);
//     updatePageContent(SearchResults)
//   }
// }

// const timer = setInterval(checkForResults, 1000);

import {getTripsForListings} from "../lib/updatePageContent"
import formatTrip from "../lib/formatTrip"

const getPostId = () => {
  let pathParts = document.location.pathname.split("/")
  const fileName = pathParts[pathParts.length - 1]
  const postId = fileName.split(".")[0]
  return postId
}

const $map = document.getElementById("map");
const {
  latitude,
  longitude
} = $map.dataset

const listing = {
  id: getPostId(),
  location: [latitude, longitude].join(",")
}

getTripsForListings([listing]).then(([listingWithTrip]) => {
  const tripHTML = formatTrip(listingWithTrip.trip)
  console.log(tripHTML)
  document.querySelector(".mapaddress").insertAdjacentHTML("afterend", tripHTML)
})
console.log("map data", listing)

