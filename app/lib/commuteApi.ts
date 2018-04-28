import {Listing, Settings} from "./interfaces"
import {
  buildGoogleMapsDirectionUrl,
  getTrips,
  Trip
} from "./googleMapsApi";



export interface ListingWithTrip extends Listing {
  trip: Trip
}

const mapTripsToListings = (trips: Trip[], listings: Listing[]): ListingWithTrip[] => {
  return trips.map((trip: any, listingIndex: number) => {
    const listing = listings[listingIndex];
    return Object.assign(listing, {trip})
  })
}

// Fetch transit times
export async function addTripsToListings(listings: Listing[], settings: Settings): Promise<ListingWithTrip[]> {
  const origins = listings.map((listing: Listing) => listing.location)

  const trips = await getTrips(origins, settings)

  const listingsWithTrips = mapTripsToListings(trips, listings)

  return listingsWithTrips
}
