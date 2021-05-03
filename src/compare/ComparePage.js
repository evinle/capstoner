import React from "react";
import Map from "../map/Map";
import * as Locations from "../map/locations";

function Compare() {
  const [firstViewState, setFirstViewState] = React.useState({
    ...Locations.Perth,
    pitch: 40,
    bearing: 0,
  });
  const [secondViewState, setSecondViewState] = React.useState({
    ...Locations.Rockingham,
    pitch: 40,
    bearing: 0,
  });

  const handleFirstViewStateChange = ({ viewState }) => {
    setFirstViewState({
      ...viewState,
    });
  };

  const handleSecondViewStateChange = ({ viewState }) => {
    setSecondViewState({
      ...viewState,
    });
  };

  return (
    <div style={{ zIndex: 5 }} className="compare-page-container">
      <Map
        id="firstMap"
        height="44vh"
        width="45vh"
        viewState={firstViewState}
        onViewStateChange={handleFirstViewStateChange}
        style={{ top: "5vh", left: "5vw" }}
      ></Map>

      <Map
        id="secondMap"
        height="44vh"
        width="45vh"
        viewState={secondViewState}
        onViewStateChange={handleSecondViewStateChange}
        style={{ top: "50vh", left: "5vw" }}
      ></Map>
    </div>
  );
}

export default Compare;
