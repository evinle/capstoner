import React from "react";
import ReactMap from "react-map-gl";
import GeoJson from "../gadm36_AUS_2.json";
import DeckGL from "@deck.gl/react";
import * as Locations from "./locations";
import { ScatterplotLayer, GeoJsonLayer } from "@deck.gl/layers";
import { HexagonLayer } from "@deck.gl/aggregation-layers";

const Map = ({ height, width, viewState, onViewStateChange }) => {
  const locNameArray = [...Object.keys(Locations)];
  let locArray = [];
  locNameArray.forEach((e) => {
    locArray = [...locArray, Locations[e]];
  });

  const locArrayConst = locArray;

  locArray = [];

  const geoJsonLaya = new GeoJsonLayer({
    id: "geojson-layer",
    data: GeoJson,
    pickable: true,
    stroked: true,
    filled: true,
    extruded: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: [255, 0, 0, 255],
    getLineColor: [0, 255, 0, 255],
    getRadius: 100,
    getLineWidth: 10,
    getElevation: 30,
  });

  const layers = [
    new ScatterplotLayer({
      id: "scatterplot-laya",
      data: locArrayConst,
      stroked: true,
      filled: true,
      getRadius: (d) => d.population,
      radiusMaxPixels: 25,
      radiusMinPixels: 5,
      getPosition: (d) => [d.longitude, d.latitude],
      getFillColor: (d) => [(d.population * 2) % 256, 110, 0, 175],
    }),

    new HexagonLayer({
      id: "hexagon-layer",
      data: locArrayConst,
      pickable: true,
      extruded: true,
      radius: 500,
      elevationScale: 10,
      getPosition: (d) => [d.longitude, d.latitude],
      getElevationWeight: (d) => d.population,
      getColorWeight: (d) => d.population,
    }),
  ];

  return (
    <div>
      <ReactMap
        mapboxApiAccessToken="pk.eyJ1IjoiaW1ldmlubGUiLCJhIjoiY2tucTRwcWR1MWxlYzJ2bzV5bDllMnV4YiJ9.cblBKznaEeK5MCTSECSokg"
        width={width}
        height={height}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
      >
        <DeckGL viewState={viewState} layers={layers} />
      </ReactMap>
    </div>
  );
};

export default Map;
