const { readJson, writeJson } = require("fs-extra");

function unique(arr) {
  let u = {};
  return arr.filter(v => {
    return (u[v] = !u.hasOwnProperty(v));
  });
}

const subwayLineIcon = line => {
  const lineName = line.split(" ")[0]; // some names end with Express
  return `<span class="subway-icon subway-icon-${line}">${lineName}</span>`;
};
function subwayStationMarker(name) {
  const lines = name
    .split("-")
    .map(subwayLineIcon)
    .join("");

  return `<div class="subway-marker">${lines}</div>`;
}
async function extractSubwayNames() {
  const { features } = await readJson("./geojson/subway-stations.geojson");
  const subwayLines = features.map(({ properties }) => {
    return properties.line.split("name")[0];
  });
  const markerHtml = unique(subwayLines)
    .map(subwayStationMarker)
    .join("<br />");
  console.log(markerHtml);
  // console.log(unique(subwayLines))
}

extractSubwayNames();
