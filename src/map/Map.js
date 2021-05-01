import React from "react";
import ReactMap from "react-map-gl";
// eslint-disable-next-line
import GeoJson from "../gadm36_AUS_2.json";
import DeckGL from "@deck.gl/react";
import * as Locations from "./locations";
import { ScatterplotLayer, GeoJsonLayer } from "@deck.gl/layers";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import Suburbs from "./subs.json";
import RoadNetwork from "../Road_Network.geojson";

const Map = ({ height, width, viewState, onViewStateChange }) => {
  const locNameArray = [...Object.keys(Locations)];
  let locArray = [];
  locNameArray.forEach((e) => {
    locArray = [...locArray, Locations[e]];
  });

  const locArrayConst = locArray;

  locArray = Suburbs.features;

  // Suburbs.features.filter((sub) => sub.properties.loc_pid.split("WA") > 5999)

  const suburbsArray = locArray.filter((entry) => {
    return (
      (entry.properties.wa_local_2 === "PERTH") |
      (entry.properties.wa_local_2 === "ROCKINGHAM") |
      (entry.properties.wa_local_2 === "JOONDALUP")
    );
  });

  const maxPopulation = React.useRef(0);

  const citiesWa = React.useRef({});

  const tooltip = React.useRef();

  suburbsArray.forEach((entry) => {
    fetch(
      `https://public.opendatasoft.com/api/records/1.0/search/?dataset=worldcitiespop&q=&facet=country&refine.country=au&refine.city=${entry.properties.wa_local_2.toLowerCase()}` //name of city
    )
      .then((rawData) => rawData.json())
      .then((data) => {
        return new Promise((resolve, reject) => {
          if (data.nhits > 0) {
            if (data.records[0].fields.population > maxPopulation.current) {
              maxPopulation.current = data.records[0].fields.population;
            }
            resolve(data.records[0].fields.population);
          } else {
            resolve(0);
          }
        });
      })
      .then((data) => {
        entry.properties.population = data;
      })
      .catch((err) => console.log(err));
  });

  React.memo(() => console.log(suburbsArray), [suburbsArray]);

  React.useEffect(() => {
    fetch(
      "https://public.opendatasoft.com/api/records/1.0/search/?dataset=worldcitiespop&q=&rows=20&sort=population&facet=country&refine.country=au&refine.region=08"
    )
      .then((data) => data.json())
      .then((data) => {
        console.log("Data: " + data);
        citiesWa.current = data.records.filter((city) => {
          return typeof city.fields.population !== "undefined";
        });
      })
      .catch((err) => console.log(err));
  }, []);

  // console.log(citiesWa.current);
  // const citiesWithPopulationWA = citiesWA.filter(() =>{

  // })

  // citiesWa.current.filter((city) => {
  //   return city.fields.population > 0;
  // });

  // console.log(citiesWa.current);

  const geoJsonLaya = new GeoJsonLayer({
    id: "geojson-layer",
    data: { type: "FeatureCollection", features: [...suburbsArray] },
    //data: RoadNetwork,
    pickable: true,
    stroked: true,
    filled: true,
    extruded: true,
    lineWidthScale: 1,
    lineWidthMinPixels: 2,
    getFillColor: (d) => [
      ((d.properties.population / maxPopulation.current) * 255) % 256,
      0,
      0,
      100,
    ],
    getLineColor: (d) => [
      ((d.properties.population / maxPopulation.current) * 255) % 256,
      255,
      255,
      255,
    ],
    // getLineColor: [255, 91, 17],
    // getFillColor: [255, 91, 17],
    getRadius: 100,
    getLineWidth: 2,
    getElevation: 3,
    onClick: (d) => console.log(d.object.properties.population),
  });

  // eslint-disable-next-line
  const scatterplotLaya = new ScatterplotLayer({
    id: "scatterplot-laya",
    data: locArrayConst,
    stroked: true,
    filled: true,
    getRadius: (d) => d.population,
    radiusMaxPixels: 25,
    radiusMinPixels: 5,
    getPosition: (d) => [d.longitude, d.latitude],
    getFillColor: (d) => [(d.population * 2) % 256, 110, 0, 175],
  });

  const layers = [
    new HexagonLayer({
      id: "hexagon-layer",
      data: citiesWa.current,
      pickable: true,
      extruded: true,
      radius: 20000,
      getRadius: 10,
      elevationScale: 500,
      getPosition: (d) => [d.fields.longitude, d.fields.latitude],
      getElevationWeight: (d) => d.fields.population,
      getColorWeight: (d) => d.fields.population,
      onClick: ({ object }) => {
        if (object.points[0].source) {
          console.log(object.points[0].source);
        }
      },
      onHover: (d) => {
        if (d.object) {
          // console.log(d);
          // console.log(d.object.points[0].source.fields.city);
          tooltip.current.style.opacity = 0.9;
          tooltip.current.style.left = `${d.x}px`;
          tooltip.current.style.top = `${d.y}px`;
          tooltip.current.innerHTML = `<h2>${d.object.points[0].source.fields.city.toUpperCase()}</h2>
          <p>Population: ${d.object.points[0].source.fields.population}</p>`;
        } else {
          tooltip.current.style.opacity = 0.0;
          tooltip.current.style.left = `0px`;
          tooltip.current.style.top = `0px`;
        }
      },
    }),
    geoJsonLaya,
  ];

  return (
    <div style={{ position: "relative" }}>
      <ReactMap
        // mapboxApiAccessToken="pk.eyJ1IjoiaW1ldmlubGUiLCJhIjoiY2tucTRwcWR1MWxlYzJ2bzV5bDllMnV4YiJ9.cblBKznaEeK5MCTSECSokg"
        mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
        width={width}
        height={height}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
      >
        <DeckGL viewState={viewState} layers={layers} />
      </ReactMap>
      <div
        ref={tooltip}
        style={{
          display: "block",
          position: "absolute",
          userSelect: "none",
          background: "white",
          padding: "10px",
          borderRadius: "10px",
        }}
      ></div>
    </div>
  );
};

export default Map;
