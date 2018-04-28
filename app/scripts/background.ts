// Dispatches requests to the google transit api
// Used to bypass cors in the content script;
import {addTripsToListings} from "../lib/commuteApi"
import {getSettings} from "../lib/commuteSettings";
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
    const settings = await getSettings()
    const listingsWithTrips = await addTripsToListings(request.data.listings, settings)
    const response = {listings: listingsWithTrips}
    console.log("response", response)
    return response
  }
}

browser.runtime.onMessage.addListener(handleMessage)
