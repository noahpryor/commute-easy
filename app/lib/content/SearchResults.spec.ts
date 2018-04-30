import SearchResults from "./SearchResults";

// Street easy search results page
const searchResultsPage = `
<div id="result-details">
 <main class="listings">
   <article id="listing_2374346_featured" class="item featured" se:map:point="40.69530106,-73.9641037">
     <ul>
       <li>
         <ul class='details_info details-info-flex'>
         </ul>
       </li>
      </ul>
   </article>
 </main>
</div>

`
describe("#visible", () => {
  it("true there is at least one listing on the page", () => {
    document.body.innerHTML = searchResultsPage
    expect(SearchResults.visible()).toBe(true)
  })

  it("false when there are no articles on the page", () => {
    document.body.innerHTML = ""
    expect(SearchResults.visible()).toBe(false)
  })
})

describe("#listings()", () => {
  it("returns a Listing object for each element on the page", () => {
    document.body.innerHTML = searchResultsPage

    const listings = SearchResults.listings()

    expect(listings).toHaveLength(1);

    expect(listings[0]).toEqual({
      location: "40.69530106,-73.9641037",
      id: "listing_2374346_featured"
    })
  })
})

describe("#updateListingsWithTrips()", () => {
  it("adds the commute string", () => {
    document.body.innerHTML = searchResultsPage

    const trip = {
      destination: "Some place, USA",
      duration: "10 minutes",
      distance: "5 miles",
      mode: "transit",
      directionsUrl: "https://example.com",
      arrivalTime: 12345,
      origin: "origin address"
    }

    const listingWithTrip = {
      location: "40.69530106,-73.9641037",
      id: "listing_2374346_featured",
      trip: trip
    }

    SearchResults.updateListingsWithTrips([listingWithTrip])

    const contentAfterAddition = document.body.innerHTML

    expect(contentAfterAddition).toContain(trip.duration)
    expect(contentAfterAddition).toContain(trip.distance)
    expect(contentAfterAddition).toContain(trip.mode)
    expect(contentAfterAddition).toContain(trip.directionsUrl)

    expect(contentAfterAddition).toContain("Some place")

    // Running it 2x doesnt' change anything
    SearchResults.updateListingsWithTrips([listingWithTrip])
    expect(document.body.innerHTML).toEqual(contentAfterAddition)
  })
})

