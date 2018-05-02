export function routeStyle(feature) {
  switch (feature.properties.rt_symbol) {
    case "1":
      return { color: "#EE352E" };
    case "2":
      return { color: "#EE352E" };
    case "3":
      return { color: "#EE352E" };
    case "4":
      return { color: "#00933C" };
    case "5":
      return { color: "#00933C" };
    case "6":
      return { color: "#00933C" };
    case "B":
      return { color: "#FF6319" };
    case "D":
      return { color: "#FF6319" };
    case "F":
      return { color: "#FF6319" };
    case "M":
      return { color: "#FF6319" };
    case "A":
      return { color: "#2850AD" };
    case "C":
      return { color: "#2850AD" };
    case "E":
      return { color: "#2850AD" };
    case "G":
      return { color: "#6CBE45" };
    case "J":
      return { color: "#996633" };
    case "Z":
      return { color: "#996633" };
    case "L":
      return { color: "#A7A9AC" };
    case "N":
      return { color: "#FCCC0A" };
    case "Q":
      return { color: "#FCCC0A" };
    case "R":
      return { color: "#FCCC0A" };
    case "S":
      return { color: "#808183" };
    case "7":
      return { color: "#A7A9AC" };
  }
}

const subwayIconUrl = (subwayLine: string) => {
  return `https://raw.githubusercontent.com/louh/nyc-subway-icons/master/build/png/${subwayLine}.png`;
};
const SUBWAY_GEOJSON_URLS = {
  stations:
    "https://cdn.rawgit.com/noahpryor/847d05ecefc2cd205bd68557bf55636d/raw/f8f4e834d213214ef8fd4e92fee481f8d4a1792b/subway-stations.geojson",
  lines:
    "https://cdn.rawgit.com/noahpryor/21c51b3f555c90f1d82741364d55cc64/raw/8c87c551e68e614b2028ba58727519384ad81e72/subway-lines.geojson",
};

export async function getSubwayJson() {
  const baseUrl =
    "https://cdn.rawgit.com/noahpryor/21c51b3f555c90f1d82741364d55cc64/raw/8c87c551e68e614b2028ba58727519384ad81e72/subway-lines.geojson";
  const lineData: any = await fetch(SUBWAY_GEOJSON_URLS.lines).then(res =>
    res.json()
  );
  // const stationData: any = await fetch(SUBWAY_GEOJSON_URLS.stations).then(res =>
  //   res.json()
  // );

  const lines = lineData.features.map((feature: any) => {
    feature.properties.style = routeStyle(feature);
    return feature;
  });
  return {
    lines,
    // stations: stationData.features,
  };
}
