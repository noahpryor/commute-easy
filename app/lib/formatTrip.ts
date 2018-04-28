import {Trip} from "./interfaces"
// Format trip as commute string for display on the site
export default function formatTrip(trip: Trip): string {
  const destination = trip.destination.split(",")[0]
  return `<span>
    <b>Commute:</b>
    ${trip.duration}, ${trip.distance} to ${destination} (${trip.mode})
    <a href="${trip.directionsUrl}" target="_blank">directions</a></span>
  `
}
