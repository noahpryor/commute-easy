import {getSettings} from "../lib/commuteSettings"

const baseUrl = "https://maps.googleapis.com/maps/api/distancematrix/json"

const formatCommuteInfo = (json) => {
  const nestedCommutes = json.rows.map((row, originIndex) => {
    const origin = json.origin_addresses[originIndex]
    return row.elements.map((commute, destinationIndex) => {
      const destination = json.destination_addresses[destinationIndex]
      return Object.assign(commute, {
        origin,
        destination,
        distance: commute.distance.text,
        duration: commute.duration.text,
      })
    })
  })
  const commutes = [].concat(...nestedCommutes)
  return commutes
}

const mapCommutesToListings = (commuteTimes, listings, mode) => {
  return commuteTimes.map((commuteTime, listingIndex) => {
    const listing = listings[listingIndex];
    const directionsUrl = getDirectionsUrl({
      origin: commuteTime.origin,
      destination: commuteTime.destination,
      mode
    })
    return Object.assign(listing, commuteTime, {directionsUrl, mode});
  })
}

// Forming the Directions URL
// https://www.google.com/maps/dir/?api=1&parameters
// Parameters
// origin Defines the starting point from which to display directions. Defaults to most relevant starting location, such as user location, if available. If none, the resulting map may provide a blank form to allow a user to enter the origin. The value can be either a place name, address, or comma-separated latitude/longitude coordinates. A string should be URL-escaped, so an address such as "City Hall, New York, NY" should be converted to City+Hall%2C+New+York%2C+NY.
// Note: This parameter is optional, unless you specify an origin_place_id in your URL. If you choose to specify an origin_place_id, you must also include an origin in the URL.

// origin_place_id (optional): A place ID is a textual identifier that uniquely identifies a place. If you are trying to definitively specify an establishment, using a place ID is the best guarantee that you will link to the right place. URLs that use this parameter must also include an origin.

// destination: Defines the endpoint of the directions. If none, the resulting map may provide a blank form to allow the user to enter the destination. The value can be either a place name, address, or comma-separated latitude/longitude coordinates. A string should be URL-escaped, so an address such as "City Hall, New York, NY" should be converted to City+Hall%2C+New+York%2C+NY.
// Note: This parameter is optional, unless you specify a destination_place_id in your URL. If you choose to specify a destination_place_id, you must also include a destination in the URL.

// destination_place_id (optional): A place ID is a textual identifier that uniquely identifies a place. If you are trying to definitively specify an establishment, using a place ID is the best guarantee that you will link to the right place. URLs that use this parameter must also include a destination.
//
// travelmode (optional): Defines the method of travel. Options are driving, walking (which prefers pedestrian paths and sidewalks, where available), bicycling (which routes via bike paths and preferred streets where available), or transit. If no travelmode is specified, the Google Map shows one or more of the most relevant modes for the specified route and/or user preferences.

// dir_action=navigate (optional): Launches either turn-by-turn navigation or route preview to the specified destination, based on whether the origin is available. If the user specifies an origin and it is not close to the user's current location, or the user's current location is unavailable, the map launches a route preview. If the user does not specify an origin (in which case the origin defaults to the user's current location), or the origin is close to the user's current location, the map launches turn-by-turn navigation. Note that navigation is not available on all Google Maps products and/or between all destinations; in those cases this parameter will be ignored.
function getDirectionsUrl({origin, destination, mode}) {
  const params = {
    api: 1,
    travelmode: mode,
    origin,
    destination
  }
  const baseUrl = "https://www.google.com/maps/dir/"
  return `${baseUrl}?${toQuery(params)}`
}


// different origins have to be joined together by pipes
const getCommuteTimes = async (listings) => {
  const defaultParams = await getSettings()
  console.log(defaultParams)
  const origins = listings.map(({location}) => location).join("|");
  const params = Object.assign(defaultParams, {origins})

  const url = [baseUrl, toQuery(params)].join("?")
  console.log("fetching", url)
  return fetch(url)
    .then(response => response.json())
    .then(formatCommuteInfo)
    .then(commuteTimes => {
      return {
        listings: mapCommutesToListings(commuteTimes, listings, params.mode),
      }
    })
}
console.log("background script loaded")


function handleMessage(request) {
  // return {data: {listings: []}}
  if(request.action === "getCommutes") {
    console.log("getCommutes", request);
    return getCommuteTimes(request.data.listings).then(data => {
      console.log("commutes", data)
      return {action: "commutes", data: data}
    }).catch(err => {
      console.error(err)
    })
  }
}

browser.runtime.onMessage.addListener(handleMessage)

function toQuery(params) {
  const esc = encodeURIComponent
  return Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
}
