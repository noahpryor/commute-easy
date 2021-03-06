// Add a layer displaying transit areas
// to a provided Leaflet.js map
import { StringKeyedMap } from "./interfaces";

import { getSubwayJson } from "./transitLayers";
declare const L: any;

interface Shape {
  shell: number[];
  holes: number[];
}

interface MapLayer {
  shapes: Shape[];
  mode: string;
  commuteMinutes: number;
}

function createPolygon(shape: Shape) {
  return L.polygon([shape.shell, shape.holes], {
    color: "#1EB300",
    opacity: 0.2,
  });
}

function createCommuteLayerGroup(shapes: Shape[]) {
  const polygons = shapes.map(createPolygon);
  return L.layerGroup(polygons);
}

// Map polygons are embedded as json in the data-data attribute
// on the script tag
interface InjectedData {
  mapLayer: MapLayer;
}

function getTransitMapData() {
  const $injectedScript = document.querySelector(
    ".commute-easy-injected-script"
  );
  return JSON.parse($injectedScript.getAttribute("data-data"));
}

function onEachFeature(feature: any, layer: any) {
  layer.bindPopup(`${feature.properties.line} - ${feature.properties.name}`);
}

export async function addTransitTimeToMap(map: any) {
  const { lines } = await getSubwayJson();
  const subwayLineLayer = L.geoJson();

  lines.forEach((feature: any) => {
    subwayLineLayer.addData(feature);
  });

  subwayLineLayer.setStyle((feature: any) => feature.properties.style);
  const subwayLineLayerGroup = L.layerGroup([subwayLineLayer]);

  try {
    const commuteTimeMap = getTransitMapData();

    const { shapes, mode, commuteMinutes } = commuteTimeMap;

    const commuteLayerGroup = createCommuteLayerGroup(shapes);
    const layerGroupName = `<${commuteMinutes}m ${mode}`;

    const layerControls: StringKeyedMap = {
      Subway: subwayLineLayerGroup,
    };

    layerControls[layerGroupName] = commuteLayerGroup;
    commuteLayerGroup.addTo(map);
    subwayLineLayerGroup.addTo(map);
    const controls = L.control.layers({}, layerControls, { collapsed: false });

    controls.addTo(map);
    // addResultsToMap(mapLayer, map)
  } catch (e) {
    console.error("CommuteEasy: Adding transit data to map failed", e);
    throw e;
  }
}
