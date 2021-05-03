import "./App.css";
import Map from "./map/Map";
import React from "react";
import * as Locations from "./map/locations";
import { FlyToInterpolator } from "react-map-gl";
import { CgMenuGridO as MenuToggleIcon } from "react-icons/cg";
import { options as SidebarOptions } from "./SidebarOptions";
import { Route, NavLink, BrowserRouter } from "react-router-dom";
import StatisticsPage from "./statistics/Statistics";
import Home from "./Home";
import ComparePage from "./compare/ComparePage";

function App() {
  const [navbarOptions, setNavbarOptions] = React.useState([]);

  React.useEffect(() => {
    setNavbarOptions(SidebarOptions);
  }, []);

  // State management for view state of the map
  // const [viewState, setViewState] = React.useState({
  //   ...Locations.Perth,
  //   zoom: 5,
  //   pitch: 40,
  //   bearing: 0,
  // });

  // const handleViewStateChange = ({ viewState }) => {
  //   setViewState({
  //     ...viewState,
  //   });
  // };

  return (
    <>
      <BrowserRouter>
        <div className="nav-sidebar">
          <ul className="nav-sidebar-list">
            {navbarOptions.map((option) => {
              return (
                <li
                  className="menu-toggle menu-option-container"
                  key={option.id}
                >
                  <NavLink to={option.path} className="menu-option">
                    {option.icon}
                    <span className="menu-option-label">
                      {option.label.toUpperCase()}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
        {/* <div className="map-container-app">
          <Map
            width="100vw"
            height="100vh"
            viewState={viewState}
            onViewStateChange={handleViewStateChange}
          />
        </div> */}
        <Route exact path="/" component={Home} />
        <Route path="/statistics" component={StatisticsPage} />
        <Route path="/compare" component={ComparePage} />
      </BrowserRouter>
    </>
  );
}

export default App;

export const ICON_SIZE = 40;
