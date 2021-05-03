import "./App.css";
import Map from "./map/Map";
import React from "react";
import * as Locations from "./map/locations";
import { FlyToInterpolator } from "react-map-gl";
import { options as SidebarOptions } from "./SidebarOptions";

function Home() {
  // State management for view state of the map
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
  return (
    <div className="map-container-app">
      <Map
        width="100vw"
        height="100vh"
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
      />
    </div>
  );
}

export default Home;
