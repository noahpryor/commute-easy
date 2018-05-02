import { getSettings } from "./commuteSettings";

const SCRIPT_DATA_ATTRIBUTE = "commute-easy-source";

const scriptOnPage = (scriptPath: string) => {
  return (
    document.querySelector(
      `script[${SCRIPT_DATA_ATTRIBUTE}="${scriptPath}"]`
    ) !== null
  );
};

const loadScriptContent = (scriptPath: string) => {
  const scriptUrl = browser.runtime.getURL(scriptPath);
  return fetch(scriptUrl).then(response => response.text());
};

const getMapLayer = () =>
  browser.storage.local.get("commuteMap").then(data => data.commuteMap);

// Chrome extensions don't have access to the JS runtime, which we need to modify a leaflet
// map, so we fetch the contents of a script from the extension and then inject it as an
// inline script on the page
const addScript = async (scriptPath: string, data: any) => {
  if (scriptOnPage(scriptPath)) {
    console.log(`Already added ${scriptPath}`);
    return;
  }

  const scriptText = await loadScriptContent(scriptPath);

  const script = document.createElement("script");

  script.classList.add("commute-easy-injected-script");
  console.log("injecting data", data);
  script.dataset.data = JSON.stringify(data);
  script.setAttribute(SCRIPT_DATA_ATTRIBUTE, scriptPath);
  script.textContent = scriptText;
  return document.head.appendChild(script);
};

export async function injectMapOverlay(scriptPath: string) {
  const mapLayer = await getMapLayer();
  addScript(scriptPath, mapLayer);
}
