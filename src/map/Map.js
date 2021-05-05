import "./mapstyles.css";
import React from "react";
import ReactMap from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import AUPopulationAtLocation from "../au-cities-population-location.json";

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

  const populationHexagonLayer = new HexagonLayer({
    id: "hexagon-layer",
    data: hexagonLayerData,
    pickable: true,
    extruded: true,
    radius: 2000,
    getRadius: 10,
    elevationScale: 500,
    // d is just the data in this case
    getPosition: (d) => [parseFloat(d.lng), parseFloat(d.lat)],
    getElevationWeight: (d) => {
      return parseInt(d.population);
    },
    getColorWeight: (d) => parseInt(d.population),
    // d also stands for Da-click-event here
    onClick: (d) => {
      if (areaOnClick) {
        if (d.object.points[0].source) {
          areaOnClick(d.object.points[0].source);
        }
      }
    },
    // as you can already extrapolate: Da-hover-event
    onHover: (d) => {
      // whenever the user hovers over a hexagon, tool tip shows up with
      // if and only if the object exists
      if (d.object) {
        tooltip.current.style.opacity = 0.9;
        tooltip.current.innerHTML = `<h2>${d.object.points[0].source.city.toUpperCase()}</h2>
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
    material: mats,
  });

  const layers = [populationHexagonLayer];

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
