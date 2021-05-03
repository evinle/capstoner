import "./App.css";
import Map from "./map/Map";
import React from "react";
import * as Locations from "./map/locations";
import { FaWindowClose } from "react-icons/fa";
import { FlyToInterpolator } from "react-map-gl";

function Home() {
  // State management for view state of the map
  const [viewState, setViewState] = React.useState({
    ...Locations.Perth,
    zoom: 5,
    pitch: 40,
    bearing: 0,
  });

  const [chosenArea, setChosenArea] = React.useState({});
  const [showAreaStats, setShowAreaStats] = React.useState(false);

  const handleViewStateChange = ({ viewState }) => {
    setViewState({
      ...viewState,
    });
  };

  const handleAreaClick = (area) => {
    setShowAreaStats(true);
    setChosenArea(area);
    setViewState({
      longitude: parseFloat(area.lng),
      latitude: parseFloat(area.lat),
      zoom: 9,
      pitch: 40,
      bearing: 0,
      transitionDuration: 7500 * (1 / viewState.zoom),
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  return (
    <>
      {showAreaStats && (
        <ul className="general-stats-tab">
          <FaWindowClose
            className="close-stats-btn"
            size={40}
            onClick={() => setShowAreaStats(false)}
          />

          {Object.keys(chosenArea).map((stat) => {
            return (
              <li>{`${stat.charAt(0).toUpperCase()}${stat.slice(1)} : ${
                chosenArea[stat]
              }`}</li>
            );
          })}
        </ul>
      )}
      <div className="map-container-app">
        <Map
          width="100vw"
          height="100vh"
          chosenArea={chosenArea}
          areaOnClick={handleAreaClick}
          viewState={viewState}
          onViewStateChange={handleViewStateChange}
        />
      </div>
    </>
  );
}

export default Home;
