
import {Settings} from "./interfaces"

const DEFAULT_SETTINGS: Settings = {
  key: null,
  mode: "transit",
  arrival_time: "1524664830", // 10 am
  units: "imperial",
  origins: "158 powers st 11211",
  destinations: "16 W 22nd St 10010"
}

interface StringKeyedMap {
  [key: string]: any;
}

export function getSettings(): Promise<Settings> {
  return browser.storage.sync.get(DEFAULT_SETTINGS)
}

export function setSettings(data: any) {
  return browser.storage.sync.set(data)
}

export function getSetting(key: string) {
  return getSettings().then((data: StringKeyedMap) => data[key])
}

export function setSetting(key: string, value: any) {
  const data: StringKeyedMap = {}
  data[key] = value
  return setSettings(data)
}

