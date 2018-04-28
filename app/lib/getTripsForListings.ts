import {Listing, Trip, ListingWithTrip} from "./interfaces"
import {
  DistanceMatrixApiParams,
  buildGoogleMapsDirectionUrl,
  getTrips,
} from "./googleMapsApi";


const mapTripsToListings = (trips: Trip[], listings: Listing[]): ListingWithTrip[] => {
  return trips.map((trip: any, listingIndex: number) => {
    const listing = listings[listingIndex];
    return Object.assign(listing, {trip})
  })
}

// Fetch transit times
export default async function addTripsToListings(listings: Listing[], settings: DistanceMatrixApiParams): Promise<ListingWithTrip[]> {
  const origins = listings.map((listing: Listing) => listing.location)

  const trips = await getTrips(origins, settings)

  const listingsWithTrips = mapTripsToListings(trips, listings)

  return listingsWithTrips
}
