console.log(`'Allo 'Allo! Content script`)

import {Listing} from "../lib/interfaces"

function getListingData(listing: HTMLElement): Listing {
  const location: string = listing.getAttribute("se:map:point")
  const id = listing.id;
  return {
    location,
    id,
  };
}

const getCommutes = (listings: Listing[]): Promise<Listing[]> => {
  return browser.runtime.sendMessage({
    action: "getCommutes",
    data: {listings}
  }).then(response => {

    console.log("getCommutes response", response)
    console.log(JSON.stringify(response.data.listings))
    return response.data.listings
  });
};


// Add commute time to the listing
function addCommuteTimeToListing(listing: Listing): Listing {
  const priceElement = document.querySelector(`#${listing.id} ul.details_info`)
    .parentElement;
  const commuteExists = document.querySelector(`#${listing.id}-commute`)
  if(commuteExists) {
    console.log("Commute already added for", listing.id)
  }
  else {
    priceElement.insertAdjacentHTML("afterend", commuteInfoListItem(listing));
  }
  return listing
}

function commuteInfoListItem(listing: Listing) {
  const destination = listing.destination.split(",")[0]
  return `
  <li id="${listing.id}-commute" class="details_info details-info-flex commute-easy">
    <div>
      <b>Commute:</b>
      ${listing.duration}, ${listing.distance} to ${destination} (${listing.mode})
      <a href="${listing.directionsUrl}" target="_blank">directions</a>
    </div>
  </li>`;
}

const noCommuteAdded = (listing: Listing) => (document.querySelector(`#${listing.id}-commute`) == null)
const getListings = (): Listing[] => Array.from(document.querySelectorAll("main > article")).map(getListingData).filter(noCommuteAdded)

const listingsVisible = () => document.querySelectorAll('#result-details main.listings article').length > 0
// Wait for listings to show up on the page
const timer = setInterval(setCommutesIfListings, 1000);


function addCommuteTimesToStreetEasy() {
  const listings = getListings()
  console.log("adding commute times");
  return getCommutes(listings).then((listings: Listing[]) => {

    listings.forEach((listing: Listing) => addCommuteTimeToListing(listing))
    return listings
  });
}

function setCommutesIfListings() {
  console.log("Checking for listings..")
  if(listingsVisible()) {
    console.log("listings visible")
    // sendListings()
    clearTimeout(timer);
    addCommuteTimesToStreetEasy()
  }
}
