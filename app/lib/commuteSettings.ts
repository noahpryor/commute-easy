import { epochToTime, timeToMondayEpoch } from "./dateUtils";
import { DistanceMatrixApiParams } from "./googleMapsApi";
import { StringKeyedMap } from "./interfaces";
import { getCommuteTimeMap } from "./travelTimeApi";
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Destination {
  name: string;
  coordinates: Coordinates;
}

export interface Settings {
  mode: string;
  arrivalTime: number;
  units: string;
  commuteMinutes: number;
  destination: Destination;
}

const DEFAULT_SETTINGS: Settings = {
  mode: "transit",
  arrivalTime: 1525093200000, // 10 am
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
};

function updateCommuteTimeMapCache(settings: Settings) {
  return getCommuteTimeMap(settings)
    .then((data: any) => browser.storage.local.set({ commuteMap: data }))
    .then(() => console.log("Commute map cache updated", settings));
}

export function getSettings(): Promise<Settings> {
  return browser.storage.sync.get(DEFAULT_SETTINGS);
}

export function setSettings(data: any) {
  return browser.storage.sync
    .set(data)
    .then(getSettings)
    .then(updateCommuteTimeMapCache);
}

export function getSetting(key: string) {
  return getSettings().then((data: StringKeyedMap) => data[key]);
}

export function setSetting(key: string, value: any) {
  const data: StringKeyedMap = {};
  data[key] = value;
  return setSettings(data);
}

export function setArrivalTime(time: string) {
  const arrivalTime = timeToMondayEpoch(time);
  console.log(arrivalTime);
  return setSetting("arrivalTime", arrivalTime);
}

export function getArrivalTime(): Promise<string> {
  return getSetting("arrivalTime").then(epochToTime);
}
