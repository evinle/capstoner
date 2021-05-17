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
    zoom: 9,
    pitch: 40,
    bearing: 0,
  });

  const interp = new FlyToInterpolator({ speed: 0.85 });

  // area/hexagon the user clicks on the map
  const [chosenArea, setChosenArea] = React.useState({});

  // this state determines if we're showing the general stats for an area or not
  const [showAreaStats, setShowAreaStats] = React.useState(false);

  // when the user wants to move, this function will be called to update the
  // viewstate based on their input
  const handleViewStateChange = ({ viewState }) => {
    setViewState({
      ...viewState,
    });
  };

  //  const determineZoom = () => {
  //     if (!chosenArea.demand || !chosenArea.supply) return 12;

  //     console.log(
  //       "determined zoom: ",
  //       14 -
  //         Math.max(
  //           Object.keys(chosenArea.demand.food).reduce(
  //             (total, current) => total + chosenArea.demand.food[current],
  //             0
  //           ),
  //           Object.keys(chosenArea.supply.food).reduce(
  //             (total, current) => total + chosenArea.demand.food[current],
  //             0
  //           )
  //         ) /
  //           9000
  //     );
  //     return (
  //       14 -
  //       Math.max(
  //         Object.keys(chosenArea.demand.food).reduce(
  //           (total, current) => total + chosenArea.demand.food[current],
  //           0
  //         ),
  //         Object.keys(chosenArea.supply.food).reduce(
  //           (total, current) => total + chosenArea.demand.food[current],
  //           0
  //         )
  //       ) /
  //         9000
  //     );
  //   };

  // fancy fly-to logic to enable our map to fly to a town the user's clicked
  const handleAreaClick = (area) => {
    setShowAreaStats(true);
    setChosenArea(area);
    setViewState({
      longitude: parseFloat(area._long),
      latitude: parseFloat(area.lat),
      zoom: 13,
      pitch: 40,
      bearing: viewState.bearing,
      // we want the transition duration to be inversely proportional to the
      // zoom i.e if the user's really zoomed in, we want that time to be smaller
      transitionDuration: 10000 / viewState.zoom,
      transitionInterpolator: interp,
    });
  };

  return (
    <>
      {/* we do this instead of the && syntax to enable transitions  */}
      <ul
        className={
          showAreaStats ? "general-stats-tab" : "general-stats-tab closed"
        }
      >
        <FaWindowClose
          className="close-stats-btn"
          size={40}
          onClick={() => setShowAreaStats(false)}
        />

        {Object.keys(chosenArea).map((stat) => {
          if (stat !== "supply" && stat !== "demand") {
            return (
              // logic to display all the key value pairs in the object
              <li key={stat}>{`${stat.charAt(0).toUpperCase()}${stat.slice(
                1
              )} : ${chosenArea[stat]}`}</li>
            );
          }
          return (
            <li key={stat}>{`${stat.charAt(0).toUpperCase()}${stat.slice(
              1
            )} : [Meat: ${chosenArea[stat].food.meat}\nCarbs: ${
              chosenArea[stat].food.carbs
            }\nVeg: ${chosenArea[stat].food.vegetables}\nFruits: ${
              chosenArea[stat].food.fruits
            } ]`}</li>
          );
        })}
      </ul>

      <div className="map-container-app">
        <Map
          width="100vw"
          height="100vh"
          //areaOnClick is the handler we pass in for when the user
          // clicks on a town/hexagon. Since we want to be able to
          // extract information from the clicked object and display it
          // on the page on top of the map, we implement the logic here
          // instead of inside the map component itself. We also don't
          // want this to be a generic function of the map but rather
          // a feature of this "Home" component
          areaOnClick={handleAreaClick}
          viewState={viewState}
          onViewStateChange={handleViewStateChange}
        />
      </div>
    </>
  );
}

export default Home;
