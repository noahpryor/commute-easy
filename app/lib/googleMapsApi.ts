// Wrapper around google maps API

// https://www.google.com/maps/dir/?api=1&parameters
import {Trip} from "./interfaces"
interface DirectionsParams {
  travelmode: string;
  origin: string;
  destination: string;
  api: number;
}

interface DirectionsOptions {
  origin: string;
  destination: string;
  mode: string;
}

interface ElementData {
  text: string;
}
interface Element {
  distance: ElementData;
  duration: ElementData;
}

interface Row {
  elements: Element[]
}

interface DistanceMatrix {
  origin_addresses: string[]
  destination_addresses: string[]
  rows: Row[]
}

interface QueryParams {
  [key: string]: any;
}

export interface DistanceMatrixApiParams {
  mode: string
  arrival_time: number;
  units: string;
  origins?: string;
  destinations: string;
};

const DISTANCE_MATRIX_API_URL = "https://distancematrix-api.glitch.me/maps/api/distancematrix/json"
const DIRECTIONS_URL = "https://www.google.com/maps/dir/"

// https://developers.google.com/maps/documentation/distance-matrix/
const getDistanceMatrix = (params: DistanceMatrixApiParams): Promise<DistanceMatrix> => {
  const url = buildUrl(DISTANCE_MATRIX_API_URL, params)
  return fetch(url)
           .then(response => response.json())
}

const formatTrip = (element: Element, origin: string, destination: string, mode: string, arrivalTime: number) => {
  const distance = element.distance.text
  const duration = element.duration.text

  const directionsUrl = buildGoogleMapsDirectionUrl({
    origin,
    destination,
    mode
  })
  return {
    origin,
    destination,
    mode,
    directionsUrl,
    distance,
    duration,
    arrivalTime
  }
}

const convertDistanceMatrixToTrips = (distanceMatrix: DistanceMatrix, options: DistanceMatrixApiParams): Trip[] => {
  const { mode, arrival_time } = options
  const nestedTrips = distanceMatrix.rows.map((row, originIndex) => {
    const origin = distanceMatrix.origin_addresses[originIndex]
    return row.elements.map((element, destinationIndex) => {
      const destination = distanceMatrix.destination_addresses[destinationIndex]
      return formatTrip(element, origin, destination, options.mode, options.arrival_time)
    })
  })
  const trips = [].concat(...nestedTrips)
  return trips
}

export async function getTrips(origins: string[], settings: DistanceMatrixApiParams) {
  const params = Object.assign(settings, {
    origins: origins.join("|")
  })
  const distanceMatrix = await getDistanceMatrix(params)
  const trips = convertDistanceMatrixToTrips(distanceMatrix, settings)
  return trips
}

// Build a url for directions on google maps
// https://www.google.com/maps/dir/?api=1&parameters
export function buildGoogleMapsDirectionUrl(options: DirectionsOptions) {
  const {
    origin,
    mode,
    destination
  } = options

  const params: DirectionsParams = {
    api: 1,
    travelmode: mode,
    origin,
    destination
  }
  return buildUrl(DIRECTIONS_URL, params)
}

function buildUrl(baseUrl: string, params: QueryParams): string {
  return `${baseUrl}?${toQuery(params)}`
}

function toQuery(params: any) {
  const esc = encodeURIComponent
  return Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
}
