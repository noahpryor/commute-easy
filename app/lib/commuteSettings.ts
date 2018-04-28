import {DistanceMatrixApiParams} from "./googleMapsApi"
import {timeToMondaySecondsEpoch,secondsEpochToTime} from "./dateUtils"

const DEFAULT_SETTINGS: DistanceMatrixApiParams = {
  mode: "driving",
  arrival_time: 1525093200, // 10 am
  units: "imperial",
  origins: "158 powers st 11211",
  destinations: "16 W 22nd St 10010"
}

interface StringKeyedMap {
  [key: string]: any;
}

export function getSettings(): Promise<DistanceMatrixApiParams> {
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



export function setArrivalTime(time: string) {
  const arrivalTime = timeToMondaySecondsEpoch(time);
  console.log(arrivalTime)
  return setSetting("arrival_time", arrivalTime)
}

export function getArrivalTime(): Promise<string> {
  return getSetting("arrival_time").then(secondsEpochToTime)
}
