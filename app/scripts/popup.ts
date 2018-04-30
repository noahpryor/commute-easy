import * as places from "places.js";
import {
  getSetting,
  setSetting,
  getArrivalTime,
  setArrivalTime
} from "../lib/commuteSettings";

import {getCommuteTimeMap} from "../lib/travelTimeApi";


interface Latlng {
  lat: number;
  lng: number;
}

interface Suggestion {
  value: string;
  latlng: Latlng;
}
interface EventAutocomplete {
  suggestion: Suggestion;
}

const optionSelectors = document.querySelectorAll(".storage-input")
const arrivalTimeInput: HTMLInputElement = document.querySelector("#arrivalTime")

function saveInput() {
  setSetting(this.name, this.value)
}

function setInput(elem: HTMLInputElement) {
  getSetting(elem.name)
    .then(value => elem.value = value)
}

function saveArrivalTime() {
  console.log("saving arrival time", this.value)
  setArrivalTime(this.value)
}

const saveDestination = (event: EventAutocomplete) =>  {
  const { suggestion } = event
  const destination = {
    name: suggestion.value,
    coordinates: {
      latitude: suggestion.latlng.lat,
      longitude: suggestion.latlng.lng
    }
  }
  console.log(destination)


  setSetting("destination", destination)

}

const setupDestinationInput = async () => {
  const addressInput: HTMLInputElement = document.querySelector('#address-input');
  const destination = await getSetting("destination")

  addressInput.value = destination.name

  const placeAutocomplete = places({
    container: addressInput
  });

  placeAutocomplete.on("change", saveDestination)
}




// input is a time field, but we send back an epoch to google
// so we do some work her
async function setupArrivalTimeInput() {
  const time = await getArrivalTime()
  console.log(time)
  arrivalTimeInput.value = time
  arrivalTimeInput.addEventListener("change", saveArrivalTime)
}

function setupInput(elem: HTMLInputElement) {
  setInput(elem)
  elem.addEventListener("change", saveInput)
}

optionSelectors.forEach(setupInput)

setupArrivalTimeInput()
setupDestinationInput()


