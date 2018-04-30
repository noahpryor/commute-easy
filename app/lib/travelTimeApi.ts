import { Settings, getSettings } from "./commuteSettings"

declare const process: any

const post = (url: string, data: any) => {
  return fetch("https://api.traveltimeapp.com/v4/time-map", {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, same-origin, *omit
    headers: {
      "user-agent": "CommuteEasyExtension",
      "content-type": "application/json",
      "X-Application-Id": process.env.TRAVELTIME_APP_ID,
      "X-Api-Key": process.env.TRAVELTIME_API_KEY,
    },
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, cors, *same-origin
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // *client, no-referrer
  }).then(response => response.json()) // parses response to JSON
}

interface TravelTimeMapParams {
  latitude: number
  longitude: number
  arrivalTime: Date
  commuteSeconds: number
  mode: string
}

const modeMapping: any = {
  bicycling: "cycling",
  driving: "driving",
  walking: "walking",
  transit: "public_transport",
}

const getTravelTimeMap = (params: TravelTimeMapParams) => {
  const transportationType = modeMapping[params.mode]

  const body = {
    arrival_searches: [
      {
        id: "commuteTimeWork",
        coords: {
          lat: params.latitude,
          lng: params.longitude,
        },
        transportation: {
          type: transportationType,
        },
        arrival_time: params.arrivalTime.toISOString(),
        travel_time: params.commuteSeconds,
        range: {
          enabled: true,
          width: 3600,
        },
      },
    ],
  }
  return post("https://api.traveltimeapp.com/v4/time-map", body)
}

const getCommuteTimeMap = async () => {
  const settings = await getSettings()
  const arrivalTime = new Date(settings.arrival_time * 1000)
  const coordinates = settings.destination.coordinates
  const commuteSeconds = settings.commuteMinutes * 60
  return getTravelTimeMap({
    arrivalTime,
    commuteSeconds,
    mode: settings.mode,
    ...coordinates,
  }).then((data: any) => data.results[0])
}

export { getCommuteTimeMap }
