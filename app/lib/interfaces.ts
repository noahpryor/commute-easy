export interface Listing {
  location: string
  id: string
}

export interface ListingWithTrip extends Listing {
  trip: Trip
}

export interface Trip {
  arrivalTime: number
  destination: string
  directionsUrl: string
  distance?: string
  duration: string
  mode: string
  origin: string
}

export interface PageContent {
  visible(): boolean
  listings(): Listing[]
  updateListingsWithTrips(listings: ListingWithTrip[]): void
}


export interface StringKeyedMap {
  [key: string]: any
}

