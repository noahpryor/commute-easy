import {getSetting, setSetting} from "../lib/commuteSettings";

function saveInput() {
  setSetting(this.name, this.value)
}

function setInput(elem: HTMLInputElement) {
  getSetting(elem.name)
    .then(value => elem.value = value)
}

const optionSelectors = document.querySelectorAll(".storage-input")

function setupInput(elem: HTMLInputElement) {
  console.log("setting up input", elem)
  setInput(elem)
  elem.addEventListener("change", saveInput)
}

optionSelectors.forEach(setupInput)



// destination: "16 W 22nd St, New York, NY 10010, USA"
// directionsUrl: "https://www.google.com/maps/dir/?api=1&travelmode=transit&origin=121%20Livingston%20St%2C%20Brooklyn%2C%20NY%2011201%2C%20USA&destination=16%20W%2022nd%20St%2C%20New%20York%2C%20NY%2010010%2C%20USA"
// distance: "4.5 mi"
// duration: "22 mins"
// id: "listing_2363081_featured"
// location: "40.69110107,-73.98889923"
// mode: "transit"
// origin
// :
// "121 Livingston St, Brooklyn, NY 11201, USA"
// status
// :
// "OK"
