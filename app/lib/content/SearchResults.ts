// Runs on search results pages like https://streeteasy.com/for-rent/nyc
// and adds listing results
import { Listing, ListingWithTrip, PageContent } from "../interfaces"
import formatTrip from "../formatTrip"

function parseListingData(listing: HTMLElement): Listing {
  const location: string = listing.getAttribute("se:map:point")
  const id = listing.id
  return {
    location,
    id,
  }
}

// Add commute time to the listing
function addTripToListing(listing: ListingWithTrip): ListingWithTrip {
  const priceElement = document.querySelector(`#${listing.id} ul.details_info`)
    .parentElement
  const commuteExists = document.querySelector(`#${listing.id}-commute`)
  if (!commuteExists) {
    console.debug("Commute already added for", listing.id)
    priceElement.insertAdjacentHTML("afterend", commuteInfoListItem(listing))
  }
  return listing
}

function commuteInfoListItem(listing: ListingWithTrip) {
  const { trip } = listing
  return `
  <li id="${
    listing.id
  }-commute" class="details_info details-info-flex commute-easy">
    <div>
      ${formatTrip(trip)}
    </div>
  </li>`
}

const noCommuteAdded = (listing: Listing) =>
  document.querySelector(`#${listing.id}-commute`) == null

const $searchResults = () =>
  document.querySelectorAll("#result-details main.listings article")

function listingsVisible() {
  return getListings().length > 0
}

function getListings(): Listing[] {
  return Array.from($searchResults())
    .map(parseListingData)
    .filter(noCommuteAdded)
}

const updateListingsWithTrips = (
  listingsWithTrips: ListingWithTrip[]
): void => {
  listingsWithTrips.forEach(listing => addTripToListing(listing))
}

const SearchResults: PageContent = {
  visible: listingsVisible,
  listings: getListings,
  updateListingsWithTrips: updateListingsWithTrips,
}
export default SearchResults
