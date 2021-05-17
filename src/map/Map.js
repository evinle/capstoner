import "./mapstyles.css";
import React from "react";
import ReactMap from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
// import AUPopulationAtLocation from "../au-cities-population-location.json";
import AUPopulationAtLocation from "../GeoFeature.json";

const Map = ({
  height,
  width,
  viewState,
  onViewStateChange,
  onClick,
  areaOnClick,
  style,
}) => {
  const tooltip = React.useRef();

  const hexagonLayerData = AUPopulationAtLocation;

  // hexagon materials
  const mats = {
    ambient: 0.5,
    diffuse: 0.3,
    shininess: 100,
    specularColor: [100, 30, 30],
  };

  const demandColorRange = [
    // [25, 176, 6, 100],
    // [255, 203, 1, 100],
    // [205, 51, 1, 100],
    [255, 0, 0, 100],
  ];

  const meatSupplyHexagonLayer = new HexagonLayer({
    id: "meat-supply-hexagon-layer",
    data: hexagonLayerData,
    elevationScale: 8,
    pickable: false,
    radius: 200,
    extruded: true,
    getPosition: (d) => [parseFloat(d._long), parseFloat(d.lat)],
    getElevationValue: (d) => d[0].supply.food.meat,
    colorRange: [[200, 150, 150]],
    // colorRange: [[255, 51, 1, 100]],
  });

  const carbsSupplyHexagonLayer = new HexagonLayer({
    id: "carbs-supply-hexagon-layer",
    data: hexagonLayerData,
    elevationScale: 8,
    pickable: false,
    radius: 200,
    extruded: true,
    getPosition: (d) => [parseFloat(d._long), parseFloat(d.lat)],
    getElevationValue: (d) => d[0].supply.food.meat + d[0].supply.food.carbs,
    colorRange: [[150, 115, 92]],
  });

  const vegSupplyHexagonLayer = new HexagonLayer({
    id: "veg-supply-hexagon-layer",
    data: hexagonLayerData,
    elevationScale: 8,
    pickable: false,
    radius: 200,
    extruded: true,
    getPosition: (d) => [parseFloat(d._long), parseFloat(d.lat)],
    getElevationValue: (d) =>
      d[0].supply.food.meat +
      d[0].supply.food.carbs +
      d[0].supply.food.vegetables,
    colorRange: [[133, 203, 51]],
  });

  const fruitsSupplyHexagonLayer = new HexagonLayer({
    id: "fruits-supply-hexagon-layer",
    data: hexagonLayerData,
    elevationScale: 8,
    pickable: true,
    radius: 200,
    extruded: true,
    getPosition: (d) => [parseFloat(d._long), parseFloat(d.lat)],
    getElevationValue: (d) => {
      return (
        d[0].supply.food.meat +
        d[0].supply.food.carbs +
        d[0].supply.food.vegetables +
        d[0].supply.food.fruits
      );
    },
    colorRange: [[220, 122, 30]],
    onClick: (d) => {
      if (areaOnClick) {
        if (d.object.points[0].source) {
          areaOnClick(d.object.points[0].source);
          tooltip.current.style.opacity = 0.0;
          tooltip.current.style.left = `-200px`;
          tooltip.current.style.top = `-200px`;
        }
      }
    },
    // as you can already extrapolate: Da-hover-event
    onHover: (d) => {
      // whenever the user hovers over a hexagon, tool tip shows up with
      // if and only if the object exists
      if (d.object) {
        tooltip.current.style.opacity = 0.9;
        tooltip.current.innerHTML = `<h2>${d.object.points[0].source.suburb.toUpperCase()}</h2>
          <p>Population: ${d.object.points[0].source.population}<br></p>
          `;
        tooltip.current.style.left = `${d.x}px`;
        tooltip.current.style.top = `${d.y}px`;
      } else {
        tooltip.current.style.opacity = 0.0;
        tooltip.current.style.left = `-200px`;
        tooltip.current.style.top = `-200px`;
      }
    },
    onDrag: () => {
      // There was a "feature" where when you hover a town and
      // then starts to drag the map, the tooltip would still be
      // showing but its location on the screen doesn't match the
      // chosen location anymore, so i just choose to disable it
      // if the user starts dragging
      if (tooltip.current.style.opacity === 0.0) {
        return;
      }
      tooltip.current.style.opacity = 0.0;
      tooltip.current.style.left = `-200px`;
      tooltip.current.style.top = `-200px`;
    },
  });

  const supplyHexagonLayer = new HexagonLayer({
    id: "supply-hexagon-layer",
    data: hexagonLayerData,
    pickable: true,
    extruded: true,
    radius: 401,
    // getRadius: 10,
    elevationScale: 8,
    // d is just the data in this case
    getPosition: (d) => [parseFloat(d._long), parseFloat(d.lat)],
    // getElevationWeight:
    getColorWeight: (d) => {
      return Object.keys(d.supply.food).reduce(
        (total, current) => total + d.supply.food[current],
        0
      );
    },
    // d also stands for Da-click-event here
    onClick: (d) => {
      if (areaOnClick) {
        if (d.object.points[0].source) {
          areaOnClick(d.object.points[0].source);
          tooltip.current.style.opacity = 0.0;
          tooltip.current.style.left = `-200px`;
          tooltip.current.style.top = `-200px`;
        }
      }
    },
    // as you can already extrapolate: Da-hover-event
    onHover: (d) => {
      // whenever the user hovers over a hexagon, tool tip shows up with
      // if and only if the object exists
      if (d.object) {
        tooltip.current.style.opacity = 0.9;
        tooltip.current.innerHTML = `<h2>${d.object.points[0].source.suburb.toUpperCase()}</h2>
          <p>Population: ${d.object.points[0].source.population}<br></p>
          `;
        tooltip.current.style.left = `${d.x}px`;
        tooltip.current.style.top = `${d.y}px`;
      } else {
        tooltip.current.style.opacity = 0.0;
        tooltip.current.style.left = `-200px`;
        tooltip.current.style.top = `-200px`;
      }
    },
    onDrag: () => {
      // There was a "feature" where when you hover a town and
      // then starts to drag the map, the tooltip would still be
      // showing but its location on the screen doesn't match the
      // chosen location anymore, so i just choose to disable it
      // if the user starts dragging
      if (tooltip.current.style.opacity === 0.0) {
        return;
      }
      tooltip.current.style.opacity = 0.0;
      tooltip.current.style.left = `-200px`;
      tooltip.current.style.top = `-200px`;
    },
    getElevationValue: (d) =>
      d[0].supply.food.meat +
      d[0].supply.food.carbs +
      d[0].supply.food.vegetables +
      d[0].supply.food.fruits,
    material: mats,
    colorRange: [[0, 255, 0, 100]],
  });

  const demandHexagonLayer = new HexagonLayer({
    id: "demand-hexagon-layer",
    data: hexagonLayerData,
    pickable: true,
    extruded: true,
    radius: 401,
    // getRadius: 10,
    elevationScale: 8,
    // d is just the data in this case
    getPosition: (d) => [parseFloat(d._long), parseFloat(d.lat)],
    // getElevationWeight:
    getColorWeight: (d) =>
      (d.demand.food.meat +
        d.demand.food.carbs +
        d.demand.food.vegetables +
        d.demand.food.fruits) /
      (d.supply.food.meat +
        d.supply.food.carbs +
        d.supply.food.vegetables +
        d.supply.food.fruits),
    // d also stands for Da-click-event here
    onClick: (d) => {
      if (areaOnClick) {
        if (d.object.points[0].source) {
          areaOnClick(d.object.points[0].source);
          tooltip.current.style.opacity = 0.0;
          tooltip.current.style.left = `-200px`;
          tooltip.current.style.top = `-200px`;
        }
      }
    },
    // as you can already extrapolate: Da-hover-event
    onHover: (d) => {
      // whenever the user hovers over a hexagon, tool tip shows up with
      // if and only if the object exists
      if (d.object) {
        tooltip.current.style.opacity = 0.9;
        tooltip.current.innerHTML = `<h2>${d.object.points[0].source.suburb.toUpperCase()}</h2>
          <p>Population: ${d.object.points[0].source.population}<br></p>
          `;
        tooltip.current.style.left = `${d.x}px`;
        tooltip.current.style.top = `${d.y}px`;
      } else {
        tooltip.current.style.opacity = 0.0;
        tooltip.current.style.left = `-200px`;
        tooltip.current.style.top = `-200px`;
      }
    },
    onDrag: () => {
      // There was a "feature" where when you hover a town and
      // then starts to drag the map, the tooltip would still be
      // showing but its location on the screen doesn't match the
      // chosen location anymore, so i just choose to disable it
      // if the user starts dragging
      if (tooltip.current.style.opacity === 0.0) {
        return;
      }
      tooltip.current.style.opacity = 0.0;
      tooltip.current.style.left = `-200px`;
      tooltip.current.style.top = `-200px`;
    },
    getElevationValue: (d) =>
      d[0].demand.food.meat +
      d[0].demand.food.carbs +
      d[0].demand.food.vegetables +
      d[0].demand.food.fruits,
    material: mats,
    colorRange: demandColorRange,
  });

  const layers = [
    // fruitsSupplyHexagonLayer,
    // vegSupplyHexagonLayer,
    // carbsSupplyHexagonLayer,
    // meatSupplyHexagonLayer,
    supplyHexagonLayer,
    demandHexagonLayer,
  ];

  return (
    <div className="map-container" onClick={onClick} style={style}>
      <ReactMap
        mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        width={width}
        height={height}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
      >
        <DeckGL viewState={viewState} layers={layers} />
      </ReactMap>
      {/* this is our tooltip box for when the user hovers over the hexagons */}
      <div ref={tooltip} className="map-tooltip"></div>
    </div>
  );
};

export default Map;
