console.log(`'Allo 'Allo! Content script`)

function getListingData(listing) {
  const location = listing.attributes["se:map:point"].value;
  const id = listing.id;
  return {
    location,
    id,
  };
}

const getCommutes = listings => {
  return browser.runtime.sendMessage({
    action: "getCommutes",
    data: {listings}
  }).then(response => {

    console.log("getCommutes response", response)
    return response.data
  });
};


// Add commute time to the listing
function addCommuteTimeToListing(listing) {
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

function commuteInfoListItem(listing) {
  const destination = listing.destination.split(",")[0]
  return `
  <li id="${listing.id}-commute" class="details_info details-info-flex commute-easy">
    <div>
      <b>Commute:</b>
      ${listing.duration}, ${listing.distance} to ${destination} (${listing.mode})
      <a href="${listing.directionsUrl}" target="_blank">directions</a>
    </div>
  </li>`;
}

const noCommuteAdded = (listing) => (document.querySelector(`#${listing.id}-commute`) == null)
const getListings = () => [...document.querySelectorAll("main > article")].map(getListingData).filter(noCommuteAdded)


const listingsVisible = () => document.querySelectorAll('#result-details main.listings article').length > 0
// Wait for listings to show up on the page
const timer = setInterval(setCommutesIfListings, 1000);


function addCommuteTimesToStreetEasy() {
  const listings = getListings()
  console.log("adding commute times");
  return getCommutes(listings).then(({listings}) => {

    listings.forEach(listing => addCommuteTimeToListing(listing))
    return listings
  });
}

function setCommutesIfListings() {
  console.log("Checking for listings..")
  if(listingsVisible()) {
    console.log("listings visible")
    // sendListings()
    clearTimeout(timer);
    addCommuteTimesToStreetEasy()
  }
}

function onRequest(request, sender, sendResponse) {
  if (request.action === 'add-commutes') {
    console.log("adding commute times");
    addCommuteTimesToStreetEasy().then(data => {
      console.log("commute times added", data)
      sendResponse(data)
    })
  }
}

const sendMessage = (message) => {
  return new Promise((resolve, reject) => {
    browser.runtime.sendMessage(message, response => {
      response.error ? reject(response) : resolve(response)
    })
  })
}

console.log("loaded listings parser")
browser.runtime.onMessage.addListener(onRequest);
