// Runs on search results pages like https://streeteasy.com/for-rent/nyc
// and adds listing results
import {Listing} from "../interfaces"
import {ListingWithTrip} from "../commuteApi";
import formatTrip from "../formatTrip"
function getListingData(listing: HTMLElement): Listing {
  const location: string = listing.getAttribute("se:map:point")
  const id = listing.id;
  return {
    location,
    id,
  };
}

// Add commute time to the listing
function addCommuteTimeToListing(listing: ListingWithTrip): ListingWithTrip {
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

function commuteInfoListItem(listing: ListingWithTrip) {
  const {trip} = listing
  return `
  <li id="${listing.id}-commute" class="details_info details-info-flex commute-easy">
    <div>
      ${formatTrip(trip)}
    </div>
  </li>`;
}

const noCommuteAdded = (listing: Listing) => (document.querySelector(`#${listing.id}-commute`) == null)

const getListings = (): Listing[] => {
  return Array.from($searchResults()).map(getListingData).filter(noCommuteAdded)
}

const $searchResults = () => document.querySelectorAll('#result-details main.listings article')
// Wait for listings to show up on the page

const getTripsForListings = (listings: Listing[]): Promise<ListingWithTrip[]> => {
  return browser.runtime.sendMessage({
    action: "getTripsForListings",
    data: {listings}
  }).then(response => {
    console.log(response)

    return response.listings})
};

export function searchResultsVisible() {
  return $searchResults().length > 0
}

export function addTripsToSearchResults() {
  const listings = getListings()
  console.log("adding commute times");
  return getTripsForListings(listings).then((listings: ListingWithTrip[]) => {

    listings.forEach((listing) => addCommuteTimeToListing(listing))
    return listings
  });
}
