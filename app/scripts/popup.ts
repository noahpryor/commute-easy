import {getSetting, setSetting, getArrivalTime, setArrivalTime} from "../lib/commuteSettings";

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

// input is a time field, but we send back an epoch to google
// so we do some work her
async function setupArrivalTimeInput() {
  const time = await getArrivalTime()
  console.log(time)
  arrivalTimeInput.value = time
  arrivalTimeInput.addEventListener("change", saveArrivalTime)


}



function setupInput(elem: HTMLInputElement) {
  console.log("setting up input", elem)
  setInput(elem)
  elem.addEventListener("change", saveInput)
}

optionSelectors.forEach(setupInput)
setupArrivalTimeInput()

