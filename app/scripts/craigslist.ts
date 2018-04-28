// Add commute times to individual craigslist listing pages
import {getTripsForListings} from "../lib/updatePageContent"
import formatTrip from "../lib/formatTrip"
import {Listing} from "./formatTrip"

const getPostId = () => {
  let pathParts = document.location.pathname.split("/")
  const fileName = pathParts[pathParts.length - 1]
  const postId = fileName.split(".")[0]
  return postId
}

async function addTripToListing(listing) {
  const [listingWithTrip] = await getTripsForListings([listing])
  const {trip} = listingWithTrip
  console.log(listingWithTrip)
  const tripHTML = formatTrip(listingWithTrip.trip)
  document
    .querySelector(".mapaddress")
    .insertAdjacentHTML("afterend", tripHTML)
}

function updateListings() {
  const $map = document.querySelector("#map.viewposting");
  if(!$map) { return }
  const { latitude, longitude} = $map.dataset

  const listing = {
    id: getPostId(),
    location: [latitude, longitude].join(",")
  }

  return addTripToListing(listing)
}

updateListings()
