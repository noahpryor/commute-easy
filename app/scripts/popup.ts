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
