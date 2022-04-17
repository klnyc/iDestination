import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const initialState = {
  user: {},
  center: {},
  bounds: null,
  map: {},
  mapSearchBox: {},
  mapSearchInput: "",
  markers: [],
  currentMarker: {},
  infoWindow: {},
  drawer: false,
  list: { experiences: false, wishlist: false },
  category: { experiences: true, wishlist: true },
  home: false,
  login: false,
  weather: false,
};

const SET_USER_DATA = "SET_USER_DATA";
const SET_CENTER = "SET_CENTER";
const LOG_OUT = "LOG_OUT";
const OPEN_LOGIN = "OPEN_LOGIN";
const CLOSE_LOGIN = "CLOSE_LOGIN";
const TOGGLE_DRAWER = "TOGGLE_DRAWER";
const TOGGLE_LIST_EXPERIENCES = "TOGGLE_LIST_EXPERIENCES";
const TOGGLE_LIST_WISHLIST = "TOGGLE_LIST_WISHLIST";
const TOGGLE_OFF_FEATURES = "TOGGLE_OFF_FEATURES";
const TOGGLE_CATEGORY_ALL = "TOGGLE_CATEGORY_ALL";
const TOGGLE_CATEGORY_EXPERIENCES = "TOGGLE_CATEGORY_EXPERIENCES";
const TOGGLE_CATEGORY_WISHLIST = "TOGGLE_CATEGORY_WISHLIST";
const TOGGLE_HOME = "TOGGLE_HOME";
const TOGGLE_WEATHER = "TOGGLE_WEATHER";
const GO_TO_MARKER = "GO_TO_MARKER";
const OPEN_INFO_WINDOW = "OPEN_INFO_WINDOW";
const CLOSE_INFO_WINDOW = "CLOSE_INFO_WINDOW";
const HANDLE_MAP_SEARCH_INPUT = "HANDLE_MAP_SEARCH_INPUT";
const CLEAR_MAP_SEARCH_INPUT = "CLEAR_MAP_SEARCH_INPUT";
const CLEAR_CURRENT_MARKER = "CLEAR_CURRENT_MARKER";
const MOUNT_MARKERS = "MOUNT_MARKERS";
const MOUNT_MAP = "MOUNT_MAP";
const MOUNT_MAP_SEARCH_BOX = "MOUNT_MAP_SEARCH_BOX";
const CHANGE_BOUNDS = "CHANGE_BOUNDS";
const CHANGE_PLACE = "CHANGE_PLACE";

export const setUserData = (user) => ({ type: SET_USER_DATA, user });
export const setCenter = (coordinates) => ({ type: SET_CENTER, coordinates });
export const logout = () => ({ type: LOG_OUT });
export const openLogIn = () => ({ type: OPEN_LOGIN });
export const closeLogIn = () => ({ type: CLOSE_LOGIN });
export const toggleDrawer = (drawer) => ({ type: TOGGLE_DRAWER, drawer });
export const toggleListExperiences = (list) => ({
  type: TOGGLE_LIST_EXPERIENCES,
  list,
});
export const toggleListWishlist = (list) => ({
  type: TOGGLE_LIST_WISHLIST,
  list,
});
export const toggleOffFeatures = () => ({ type: TOGGLE_OFF_FEATURES });
export const toggleCategory = (category) => {
  switch (category) {
    case "all":
      return { type: TOGGLE_CATEGORY_ALL };
    case "experiences":
      return { type: TOGGLE_CATEGORY_EXPERIENCES };
    case "wishlist":
      return { type: TOGGLE_CATEGORY_WISHLIST };
    default:
      return { type: TOGGLE_CATEGORY_ALL };
  }
};
export const toggleHome = (home) => ({ type: TOGGLE_HOME, home });
export const toggleWeather = () => ({ type: TOGGLE_WEATHER });
export const goToMarker = (marker) => ({ type: GO_TO_MARKER, marker });
export const openInfoWindow = (marker) => ({
  type: OPEN_INFO_WINDOW,
  infoWindow: marker,
});
export const closeInfoWindow = () => ({ type: CLOSE_INFO_WINDOW });
export const handleMapSearchInput = (event) => ({
  type: HANDLE_MAP_SEARCH_INPUT,
  mapSearchInput: event.target.value,
});
export const clearMapSearchInput = () => ({ type: CLEAR_MAP_SEARCH_INPUT });
export const clearCurrentMarker = () => ({ type: CLEAR_CURRENT_MARKER });
export const mountMarkers = (markers) => ({ type: MOUNT_MARKERS, markers });
export const mountMap = (map) => ({ type: MOUNT_MAP, map });
export const mountMapSearchBox = (mapSearchBox) => ({
  type: MOUNT_MAP_SEARCH_BOX,
  mapSearchBox,
});
export const changeBounds = (bounds) => ({ type: CHANGE_BOUNDS, bounds });
export const changePlace = (place) => {
  const convertAddress = (place) => {
    const findComponent = (type) =>
      place.address_components.find((component) =>
        component.types.includes(type)
      );
    const streetNumber = findComponent("street_number")
      ? findComponent("street_number").long_name
      : null;
    const streetName = findComponent("route")
      ? findComponent("route").long_name
      : null;
    const subpremise = findComponent("subpremise")
      ? findComponent("subpremise").short_name.toUpperCase()
      : null;
    const locality = findComponent("locality")
      ? findComponent("locality").long_name
      : null;
    const area = findComponent("administrative_area_level_1")
      ? findComponent("administrative_area_level_1").long_name
      : null;
    const country = findComponent("country")
      ? findComponent("country").long_name
      : null;
    const street =
      [streetNumber, streetName].filter((x) => x).join(" ") +
      (subpremise ? `, ${subpremise}` : "");
    const location = [locality, area, country].filter((x) => x).join(", ");
    const city = locality ? locality : area ? area : null;
    const input = [street, city].filter((x) => x).join(" ");
    return { street, location, city, input };
  };

  const address = convertAddress(place);
  const lat = place.geometry.location.lat();
  const lng = place.geometry.location.lng();

  return {
    type: CHANGE_PLACE,
    mapSearchInput: `${place.name} ${address.input}`,
    center: { lat, lng },
    currentMarker: {
      position: { lat, lng },
      name: place.name,
      street: address.street,
      location: address.location,
      city: address.city,
      experiences: false,
      wishlist: false,
    },
    infoWindow: {
      position: { lat, lng },
      name: place.name,
      street: address.street,
      location: address.location,
      city: address.city,
      experiences: false,
      wishlist: false,
    },
  };
};

export const login = (user) => {
  const NYC = { lat: 40.7473735256486, lng: -73.98564376909184 };
  return (dispatch) => {
    database
      .collection("users")
      .doc(user.uid)
      .get()
      .then((data) => {
        dispatch(setUserData(data.data()));
        data.data().home
          ? dispatch(setCenter(data.data().home.position))
          : dispatch(setCenter(NYC));
      });
  };
};

export const renderMarkers = (id) => {
  return (dispatch) => {
    const markers = [];
    database
      .collection("users")
      .doc(id)
      .collection("markers")
      .onSnapshot(
        (snapshot) => {
          snapshot.docs.forEach((markerDocument) =>
            markers.push(markerDocument.data())
          );
          dispatch(mountMarkers(markers));
        },
        (error) => console.log(error.message)
      );
  };
};

export const addMarker = (id, marker, date, category) => {
  const formatDate = (date) => {
    let { month, day, year } = date;
    month = month.length === 1 ? `0${month}` : month;
    day = day.length === 1 ? `0${day}` : day;
    return month && day && year ? `${month}/${day}/${year}` : "";
  };

  if (category === "experiences") {
    marker = { ...marker, date: formatDate(date), experiences: true };
  }
  if (category === "wishlist") {
    marker = { ...marker, date: formatDate(date), wishlist: true };
  }
  return (dispatch) => {
    database
      .collection("users")
      .doc(id)
      .collection("markers")
      .add(marker)
      .then(() => dispatch(renderMarkers(id)))
      .then(() => {
        dispatch(clearMapSearchInput());
        dispatch(closeInfoWindow());
        dispatch(clearCurrentMarker());
      });
  };
};

export const removeMarker = (id, marker) => {
  return (dispatch) => {
    database
      .collection("users")
      .doc(id)
      .collection("markers")
      .where("name", "==", `${marker.name}`)
      .get()
      .then((markersSnapshot) => {
        markersSnapshot.forEach((markerDocument) => {
          database
            .collection("users")
            .doc(id)
            .collection("markers")
            .doc(markerDocument.id)
            .delete();
        });
      })
      .then(() => dispatch(renderMarkers(id)))
      .then(() => {
        dispatch(clearMapSearchInput());
        dispatch(clearCurrentMarker());
        dispatch(closeInfoWindow());
      });
  };
};

export const setHome = (id, marker) => {
  return (dispatch) => {
    database
      .collection("users")
      .doc(id)
      .set({ home: marker }, { merge: true })
      .then(() => {
        database
          .collection("users")
          .doc(id)
          .get()
          .then((data) => dispatch(setUserData(data.data())));
      });
  };
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        user: action.user,
        currentMarker: {},
        infoWindow: {},
        home: false,
      };
    case SET_CENTER:
      return { ...state, center: action.coordinates };
    case LOG_OUT:
      return {
        ...state,
        user: {},
        currentMarker: {},
        infoWindow: {},
        mapSearchInput: "",
        drawer: false,
        home: false,
        login: false,
      };
    case OPEN_LOGIN:
      return { ...state, login: true };
    case CLOSE_LOGIN:
      return { ...state, login: false };
    case TOGGLE_DRAWER:
      return {
        ...state,
        drawer: !action.drawer,
        list: { experiences: false, wishlist: false },
        weather: false,
      };
    case TOGGLE_LIST_EXPERIENCES:
      return {
        ...state,
        drawer: false,
        list: { experiences: !action.list, wishlist: false },
        weather: false,
        infoWindow: {},
      };
    case TOGGLE_LIST_WISHLIST:
      return {
        ...state,
        drawer: false,
        list: { experiences: false, wishlist: !action.list },
        weather: false,
        infoWindow: {},
      };
    case TOGGLE_OFF_FEATURES:
      return {
        ...state,
        drawer: false,
        list: { experiences: false, wishlist: false },
        weather: false,
      };
    case TOGGLE_CATEGORY_ALL:
      return { ...state, category: { experiences: true, wishlist: true } };
    case TOGGLE_CATEGORY_EXPERIENCES:
      return { ...state, category: { experiences: true, wishlist: false } };
    case TOGGLE_CATEGORY_WISHLIST:
      return { ...state, category: { experiences: false, wishlist: true } };
    case TOGGLE_HOME:
      return {
        ...state,
        home: !action.home,
        drawer: false,
        list: { experiences: false, wishlist: false },
        currentMarker: {},
        infoWindow: {},
        mapSearchInput: "",
      };
    case TOGGLE_WEATHER:
      return { ...state, drawer: false, weather: true, infoWindow: {} };
    case GO_TO_MARKER:
      return {
        ...state,
        infoWindow: action.marker,
        center: action.marker.position,
      };
    case OPEN_INFO_WINDOW:
      return { ...state, infoWindow: action.infoWindow };
    case CLOSE_INFO_WINDOW:
      return { ...state, infoWindow: {}, home: false };
    case HANDLE_MAP_SEARCH_INPUT:
      return { ...state, mapSearchInput: action.mapSearchInput };
    case CLEAR_MAP_SEARCH_INPUT:
      return { ...state, mapSearchInput: "" };
    case CLEAR_CURRENT_MARKER:
      return { ...state, currentMarker: {} };
    case MOUNT_MARKERS:
      return { ...state, markers: action.markers };
    case MOUNT_MAP:
      return { ...state, map: action.map };
    case MOUNT_MAP_SEARCH_BOX:
      return { ...state, mapSearchBox: action.mapSearchBox };
    case CHANGE_BOUNDS:
      return { ...state, bounds: action.bounds };
    case CHANGE_PLACE:
      return {
        ...state,
        center: action.center,
        currentMarker: action.currentMarker,
        mapSearchInput: action.mapSearchInput,
        infoWindow: action.infoWindow,
      };
    default:
      return state;
  }
}

export default createStore(reducer, applyMiddleware(thunk));
