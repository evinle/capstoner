import "./App.css";
import Map from "./map/Map";
import React from "react";
import * as Locations from "./map/locations";
import { FlyToInterpolator } from "react-map-gl";

function App() {
  const [viewState, setViewState] = React.useState({
    ...Locations.Perth,
    zoom: 5,
    pitch: 40,
    bearing: 0,
  });

  const handleViewStateChange = ({ viewState }) => {
    setViewState({
      ...viewState,
    });
  };

  const handleSwitchCity = (newViewState) => {
    setViewState({
      ...viewState,
      ...newViewState,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const MajorNodes = () => {
    return Object.keys(Locations).map((key) => {
      return (
        <button key={key} onClick={() => handleSwitchCity(Locations[key])}>
          {key}
        </button>
      );
    });
  };

  return (
    <div className="map-container">
      <Map
        width="100vw"
        height="100vh"
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
      />
      <MajorNodes />
    </div>
  );
}

export default App;
