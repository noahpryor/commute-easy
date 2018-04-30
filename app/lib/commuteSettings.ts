import { DistanceMatrixApiParams } from "./googleMapsApi"
import { timeToMondaySecondsEpoch, secondsEpochToTime } from "./dateUtils"
import { getCommuteTimeMap } from "./travelTimeApi"

interface Coordinates {
  latitude: number
  longitude: number
}

interface Destination {
  name: string
  coordinates: Coordinates
}

export interface Settings {
  mode: string
  arrival_time: number
  units: string
  commuteMinutes: number
  destination: Destination
}

const DEFAULT_SETTINGS: Settings = {
  mode: "driving",
  arrival_time: 1525093200, // 10 am
  units: "imperial",
  commuteMinutes: 30,
  destination: {
    name:
      "16 West 22nd Street, New York City, New York, United States of America",
    coordinates: {
      latitude: 40.7422,
      longitude: -73.9933,
    },
  },
}

interface StringKeyedMap {
  [key: string]: any
}

function updateCommuteTimeMapCache() {
  return getCommuteTimeMap()
    .then(data => browser.storage.local.set({ commuteMap: data }))
    .then(() => console.log("Commute map cache updated"))
}

export function getSettings(): Promise<Settings> {
  return browser.storage.sync.get(DEFAULT_SETTINGS)
}

export function setSettings(data: any) {
  return browser.storage.sync.set(data).then(updateCommuteTimeMapCache)
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
  const arrivalTime = timeToMondaySecondsEpoch(time)
  console.log(arrivalTime)
  return setSetting("arrival_time", arrivalTime)
}

export function getArrivalTime(): Promise<string> {
  return getSetting("arrival_time").then(secondsEpochToTime)
}
