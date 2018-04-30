import {DistanceMatrixApiParams} from "./googleMapsApi"
import {timeToMondaySecondsEpoch,secondsEpochToTime} from "./dateUtils"


interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Destination {
  name: string;
  coordinates: Coordinates;
}

export interface Settings {
  mode: string
  arrival_time: number;
  units: string;
  destination: Destination;
}

const DEFAULT_SETTINGS: Settings = {
  mode: "driving",
  arrival_time: 1525093200, // 10 am
  units: "imperial",
  destination: {
    name: "16 West 22nd Street, New York City, New York, United States of America",
    coordinates: {
      latitude: 40.7422,
      longitude: -73.9933
    }
  }
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

export function setArrivalTime(time: string) {
  const arrivalTime = timeToMondaySecondsEpoch(time);
  console.log(arrivalTime)
  return setSetting("arrival_time", arrivalTime)
}

export function getArrivalTime(): Promise<string> {
  return getSetting("arrival_time").then(secondsEpochToTime)
}
