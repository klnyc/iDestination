import React from "react";
import { connect } from "react-redux";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import { compose, withProps } from "recompose";
import { GOOGLE_MAPS_API_KEY } from "../../API_keys";
import { IoMdCloseCircle, IoMdArrowRoundUp } from "../icons";
import * as actions from "../store";
import Window from "./Window";
import Markers from "./Markers";

class Map extends React.Component {
  componentDidMount() {
    const { renderMarkers, user } = this.props;
    renderMarkers(user.id);
  }

  render() {
    const {
      mountMap,
      center,
      changeBounds,
      map,
      mountMapSearchBox,
      bounds,
      changePlace,
      mapSearchBox,
      mapSearchInput,
      handleMapSearchInput,
      clearMapSearchInput,
      clearCurrentMarker,
      infoWindow,
      toggleOffFeatures,
      home,
    } = this.props;

    return (
      <GoogleMap
        ref={(map) => mountMap(map)}
        center={center}
        onBoundsChanged={() => changeBounds(map.getBounds())}
        defaultZoom={13}
        defaultOptions={mapSettings}
        onClick={() => toggleOffFeatures()}
      >
        <SearchBox
          className="container"
          ref={(mapSearchBox) => mountMapSearchBox(mapSearchBox)}
          bounds={bounds}
          controlPosition={google.maps.ControlPosition.TOP_CENTER}
          onPlacesChanged={() => changePlace(mapSearchBox.getPlaces()[0])}
        >
          <div
            id="mapSearchBox"
            onClick={() => {
              toggleOffFeatures();
              clearCurrentMarker();
            }}
          >
            <input
              name="mapSearchInput"
              type="text"
              placeholder="Enter Destination"
              value={mapSearchInput}
              onChange={(event) => handleMapSearchInput(event)}
            />
            <div
              className={mapSearchInput ? "clear-input active" : "clear-input"}
              onClick={clearMapSearchInput}
            >
              <IoMdCloseCircle />
            </div>
            {home && !mapSearchInput && (
              <div className="set-home-popup card">
                <span>
                  <IoMdArrowRoundUp />
                </span>
                Enter New Home Address
                <span>
                  <IoMdArrowRoundUp />
                </span>
              </div>
            )}
          </div>
        </SearchBox>

        <Markers />
        {infoWindow.position && <Window />}
      </GoogleMap>
    );
  }
}

const mapSettings = {
  disableDefaultUI: true,
  clickableIcons: false,
  styles: [
    { featureType: "all", stylers: [{ saturation: 0 }, { hue: "#e7ecf0" }] },
    { featureType: "road", stylers: [{ saturation: -70 }] },
    { featureType: "transit", stylers: [{ visibility: "on" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    {
      featureType: "water",
      stylers: [{ visibility: "simplified" }, { saturation: -60 }],
    },
  ],
};

const mapProperties = {
  googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
  loadingElement: <div className="map-google" />,
  containerElement: <div className="map" />,
  mapElement: <div className="map-google" />,
};

const mapState = (state) => ({
  user: state.user,
  center: state.center,
  bounds: state.bounds,
  map: state.map,
  mapSearchBox: state.mapSearchBox,
  mapSearchInput: state.mapSearchInput,
  infoWindow: state.infoWindow,
  home: state.home,
});

const mapDispatch = (dispatch) => ({
  mountMap: (map) => dispatch(actions.mountMap(map)),
  mountMapSearchBox: (mapSearchBox) =>
    dispatch(actions.mountMapSearchBox(mapSearchBox)),
  changeBounds: (bounds) => dispatch(actions.changeBounds(bounds)),
  changePlace: (place) => dispatch(actions.changePlace(place)),
  handleMapSearchInput: (event) =>
    dispatch(actions.handleMapSearchInput(event)),
  clearMapSearchInput: () => dispatch(actions.clearMapSearchInput()),
  clearCurrentMarker: () => dispatch(actions.clearCurrentMarker()),
  renderMarkers: (id) => dispatch(actions.renderMarkers(id)),
  toggleOffFeatures: () => dispatch(actions.toggleOffFeatures()),
});

export default connect(
  mapState,
  mapDispatch
)(compose(withProps(mapProperties), withScriptjs, withGoogleMap)(Map));
