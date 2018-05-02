// Add commute times to individual craigslist listing pages
import formatTrip from "../lib/formatTrip";
import { injectMapOverlay } from "../lib/injectMapOverlay";
import { Listing, ListingWithTrip } from "../lib/interfaces";
import { getTripsForListings } from "../lib/updatePageContent";

const getPostId = () => {
  const pathParts = document.location.pathname.split("/");
  const fileName = pathParts[pathParts.length - 1];
  const postId = fileName.split(".")[0];
  return postId;
};

async function addTripToListing(listing: Listing): Promise<ListingWithTrip> {
  const [listingWithTrip] = await getTripsForListings([listing]);
  const { trip } = listingWithTrip;
  console.log(listingWithTrip);
  const tripHTML = formatTrip(listingWithTrip.trip);
  document
    .querySelector(".mapaddress")
    .insertAdjacentHTML("afterend", tripHTML);
  return listingWithTrip;
}

function updateListings() {
  const $map = document.querySelector("#map.viewposting");
  if (!$map) {
    return;
  }
  const latitude = $map.getAttribute("data-latitude");
  const longitude = $map.getAttribute("data-longitude");

  const listing = {
    id: getPostId(),
    location: [latitude, longitude].join(","),
  };

  return addTripToListing(listing);
}
console.log("I'm on a listing page");
updateListings();

// Content scripts don't share a js context/environ,ent
// with the page, so to add transit data to maps
// we have to inject a script
injectMapOverlay("scripts/craigslistMapOverlay.js");
