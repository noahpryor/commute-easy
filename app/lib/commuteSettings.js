const DEFAULT_SETTINGS = {
  key: "CHANGEME",
  mode: "transit",
  arrival_time: "1524664830", // 10 am
  units: "imperial",
  origins: "158 powers st 11211",
  destinations: "16 W 22nd St 10010"
}

export function getSettings() {
  return browser.storage.sync.get(DEFAULT_SETTINGS)
}

export function setSettings(data) {
  return browser.storage.sync.set(data)
}

export function getSetting(key) {
  return getSettings().then(data => data[key])
}

export function setSetting(key, value) {
  const data = {}
  data[key] = value
  return setSettings(data)
}
