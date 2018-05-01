import { Listing, ListingWithTrip, PageContent } from "./interfaces";
// Update all of the listings in a given apge element with
// the trip time information

const getTripsForListings = (
  listings: Listing[]
): Promise<ListingWithTrip[]> => {
  return browser.runtime
    .sendMessage({
      action: "getTripsForListings",
      data: { listings },
    })
    .then(response => {
      console.log(response);

      return response.listings;
    });
};

export { getTripsForListings };
export default async function updatePageContent(pageContent: PageContent) {
  const listings = pageContent.listings();
  const listingsWithTrips = await getTripsForListings(listings);
  pageContent.updateListingsWithTrips(listingsWithTrips);
}
