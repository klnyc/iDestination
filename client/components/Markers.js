import React from "react";
import { connect } from "react-redux";
import { Marker } from "react-google-maps";
import { openInfoWindow } from "../store";
import { colors } from "./Index";

class Markers extends React.Component {
  constructor() {
    super();
    this.renderMarker = this.renderMarker.bind(this);
  }

  renderMarker(marker, color, index) {
    const { openInfoWindow } = this.props;
    return (
      <Marker
        key={index}
        position={marker.position}
        onClick={() => openInfoWindow(marker)}
        label={{ text: "●", color: "black" }}
        icon={{
          path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
          fillColor: color,
          fillOpacity: 1,
          strokeColor: "black",
          strokeWeight: 1,
          labelOrigin: { x: 0.48, y: -30 },
        }}
      />
    );
  }

  render() {
    const { markers, currentMarker, category, user } = this.props;
    return (
      <>
        {/* Render Experiences & Wishlist Markers */}
        {category.experiences &&
          category.wishlist &&
          markers.map((marker, index) =>
            marker.experiences
              ? this.renderMarker(marker, colors.experiences, index)
              : this.renderMarker(marker, colors.wishlist, index)
          )}

        {/* Render Only Experience Markers */}
        {category.experiences &&
          !category.wishlist &&
          markers
            .filter((marker) => marker.experiences)
            .map((marker, index) =>
              this.renderMarker(marker, colors.experiences, index)
            )}

        {/* Render Only Wishlist Markers */}
        {!category.experiences &&
          category.wishlist &&
          markers
            .filter((marker) => marker.wishlist)
            .map((marker, index) =>
              this.renderMarker(marker, colors.wishlist, index)
            )}

        {/* Render Current Marker */}
        {currentMarker.position && this.renderMarker(currentMarker, "red")}

        {/* Render Home Marker */}
        {user.home && this.renderMarker(user.home, "silver")}
      </>
    );
  }
}

const mapState = (state) => ({
  markers: state.markers,
  currentMarker: state.currentMarker,
  category: state.category,
  user: state.user,
});

const mapDispatch = (dispatch) => ({
  openInfoWindow: (marker) => dispatch(openInfoWindow(marker)),
});

export default connect(mapState, mapDispatch)(Markers);
