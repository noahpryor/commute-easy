import {getSetting, setSetting} from "../lib/commuteSettings";

function saveInput(e) {
  setSetting(this.name, this.value)
}

function setInput(elem) {
  getSetting(elem.name)
    .then(value => elem.value = value)
}

const optionSelectors =  document.querySelectorAll(".storage-input")

function setupInput(elem) {
  console.log("setting up input", elem)
  setInput(elem)
  elem.addEventListener("change", saveInput)
}

optionSelectors.forEach(setupInput)
