import * as places from "places.js";
import {
  getArrivalTime,
  getSetting,
  setArrivalTime,
  setSetting,
} from "../lib/commuteSettings";

import { getCommuteTimeMap } from "../lib/travelTimeApi";

window.browser = browser;
interface Latlng {
  lat: number;
  lng: number;
}

interface Suggestion {
  value: string;
  latlng: Latlng;
  name: string;
  city: string;
}

interface EventAutocomplete {
  suggestion: Suggestion;
}

const $status = {
  loading: document.getElementById("status-loading"),
  success: document.getElementById("status-success"),
  error: document.getElementById("status-error"),
};

const showElement = (elem: HTMLElement) => elem.classList.remove("hidden");
const hideElement = (elem: HTMLElement) => elem.classList.add("hidden");

const showLoading = () => {
  hideElement($status.success);
  hideElement($status.error);
  showElement($status.loading);
};

const showError = () => {
  hideElement($status.success);
  showElement($status.error);
  hideElement($status.loading);
};
const showSuccess = () => {
  showElement($status.success);
  hideElement($status.error);
  hideElement($status.loading);
};

function saveInput() {
  showLoading();
  setSetting(this.name, this.value)
    .then(showSuccess)
    .catch(showError);
}

function setInput(elem: HTMLInputElement) {
  getSetting(elem.name).then(value => (elem.value = value));
}

function saveArrivalTime() {
  console.log("saving arrival time", this.value);
  showLoading();

  setArrivalTime(this.value)
    .then(showSuccess)
    .catch(showError);
}

const saveDestination = (event: EventAutocomplete) => {
  const { suggestion } = event;
  console.log("suggestion", suggestion);
  const destination = {
    name: `${suggestion.name}, ${suggestion.city}`,
    coordinates: {
      latitude: suggestion.latlng.lat,
      longitude: suggestion.latlng.lng,
    },
  };
  console.log(destination);
  showLoading();
  setSetting("destination", destination)
    .then(showSuccess)
    .catch(showError);
};

const setupDestinationInput = async () => {
  const addressInput: HTMLInputElement = document.querySelector(
    "#address-input"
  );
  const destination = await getSetting("destination");

  addressInput.value = destination.name;

  const placeAutocomplete = places({
    container: addressInput,
  });

  placeAutocomplete.on("change", saveDestination);
};

// input is a time field, but we send back an epoch to google
// so we do some work her
async function setupArrivalTimeInput() {
  const time = await getArrivalTime();
  console.log(time);
  const arrivalTimeInput: HTMLInputElement = document.querySelector(
    "#arrivalTime"
  );
  arrivalTimeInput.value = time;
  arrivalTimeInput.addEventListener("change", saveArrivalTime);
}

function setupInput(elem: HTMLInputElement) {
  setInput(elem);
  elem.addEventListener("change", saveInput);
}

const optionSelectors = document.querySelectorAll(".storage-input");

optionSelectors.forEach(setupInput);

setupArrivalTimeInput();
setupDestinationInput();
