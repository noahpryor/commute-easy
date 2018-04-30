// Dispatches requests to the google transit api
// Used to bypass cors in the content script;
import getTripsForListings from "../lib/getTripsForListings"
import {getSettings} from "../lib/commuteSettings";
import {getCommuteTimeMap} from "../lib/travelTimeApi"
import {Listing} from "../lib/interfaces"
interface MessageData {
  listings: Listing[];
}

interface Message {
  action: string;
  data: MessageData;
}


async function handleMessage(request: Message) {
  // return {data: {listings: []}}
  if(request.action === "getTripsForListings") {
    console.log("getTripsForListings", request);
    const {mode, units, arrival_time, destination} = await getSettings()
    const destinations = `${destination.coordinates.latitude},${destination.coordinates.longitude}`

    const tripOptions = { mode, units, arrival_time, destinations}

    const listingsWithTrips = await getTripsForListings(request.data.listings, tripOptions)
    const response = {listings: listingsWithTrips}
    console.log("response", response)
    return response
  }
}

getCommuteTimeMap()
  .then(data => browser.storage.local.set({commuteMap: data}))
  .then(() => {
    browser.storage.local.get("commuteMap").then(console.log)
  })

browser.storage.local.get("commuteMap").then(data => console.log("map", data))

browser.runtime.onMessage.addListener(handleMessage)
