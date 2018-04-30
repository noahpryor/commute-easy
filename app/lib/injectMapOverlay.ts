import {getSettings} from "./commuteSettings"

const SCRIPT_DATA_ATTRIBUTE = "commute-easy-source"

const scriptOnPage = (scriptPath: string) => {
  document.querySelector(`script[${SCRIPT_DATA_ATTRIBUTE}="${scriptPath}"]`) !== null
}

const loadScriptContent = (scriptPath: string) => {
  const scriptUrl = browser.runtime.getURL(scriptPath)
  return fetch(scriptUrl).then(response => response.text())
}

// Chrome extensions don't have access to the JS runtime, which we need to modify a leaflet
// map, so we fetch the contents of a script from the extension and then inject it as an
// inline script on the page
const addScript = async (scriptPath: string) => {
  if(scriptOnPage(scriptPath)) {
    console.log(`Already added ${scriptPath}`)
    return
  }

  const scriptText = await loadScriptContent(scriptPath)

  const script = document.createElement('script');

  script.setAttribute(SCRIPT_DATA_ATTRIBUTE, scriptPath)
  script.textContent = scriptText
  return document.head.appendChild(script);
}

export async function injectMapOverlay() {
  const commuteDestination = await browser.storage.sync.get("destination");
  console.log(commuteDestination)
  addScript("scripts/inject.js")
}

