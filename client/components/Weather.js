import React from "react";
import { connect } from "react-redux";
import { setUserData } from "../store";
import { WEATHER_API_KEY } from "../../API_keys";
import {
  FaTrash,
  IoIosAddCircleOutline,
  WiDaySunny,
  WiDayCloudy,
  WiCloud,
  WiCloudy,
  WiRainMix,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
} from "../icons";

class Weather extends React.Component {
  constructor() {
    super();
    this.state = {
      weatherCities: [],
      weatherSearchInput: "",
      error: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.weatherAPI_url = this.weatherAPI_url.bind(this);
    this.updateUserState = this.updateUserState.bind(this);
    this.queryWeatherCities = this.queryWeatherCities.bind(this);
    this.addWeatherCity = this.addWeatherCity.bind(this);
    this.removeWeatherCity = this.removeWeatherCity.bind(this);
    this.renderWeatherCities = this.renderWeatherCities.bind(this);
    this.changeTemperatureUnit = this.changeTemperatureUnit.bind(this);
  }

  componentDidMount() {
    this.queryWeatherCities();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  weatherAPI_url(city, unit) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${
      unit || "imperial"
    }&appid=${WEATHER_API_KEY}`;
  }

  updateUserState() {
    const { user, setUserData } = this.props;
    database
      .collection("users")
      .doc(user.id)
      .get()
      .then((userDocument) => {
        setUserData(userDocument.data());
        this.queryWeatherCities();
      });
  }

  queryWeatherCities() {
    const { weatherCities, unit } = this.props.user.weather;
    const weatherRequests = weatherCities.map((city) =>
      fetch(this.weatherAPI_url(city, unit))
    );

    Promise.all(weatherRequests)
      .then((weatherPromises) => {
        return Promise.all(
          weatherPromises.map((weatherPromise) => {
            return weatherPromise.json().then((weatherData) => weatherData);
          })
        );
      })
      .then((weatherData) => this.setState({ weatherCities: weatherData }));
  }

  addWeatherCity() {
    const { user } = this.props;
    const { weatherSearchInput } = this.state;

    if (!weatherSearchInput) return;
    fetch(this.weatherAPI_url(weatherSearchInput))
      .then((response) => response.json())
      .then((weatherData) => {
        if (weatherData.id) {
          this.setState({ weatherSearchInput: "", error: "" });
          database
            .collection("users")
            .doc(user.id)
            .update({
              ["weather.weatherCities"]:
                firebase.firestore.FieldValue.arrayUnion(weatherData.name),
            })
            .then(this.updateUserState);
        } else {
          this.setState({ error: "Invalid City" });
        }
      });
  }

  removeWeatherCity(city) {
    const { user } = this.props;
    database
      .collection("users")
      .doc(user.id)
      .update({
        ["weather.weatherCities"]:
          firebase.firestore.FieldValue.arrayRemove(city),
      })
      .then(this.updateUserState);
  }

  renderWeatherCities(weatherCities) {
    const { user } = this.props;
    return (
      <>
        {weatherCities.map((city, index) => {
          const weatherIcon = weatherIcons[city.weather[0].icon.slice(0, -1)];
          return (
            <div key={index} className="weather-row">
              <div className="weather-column">{city.name}</div>
              <div className="weather-column">
                {Math.round(city.main.temp)}°{" "}
                {user.weather.unit === "Metric" ? "C" : "F"}
              </div>
              <div className="weather-column weather-icon">{weatherIcon}</div>
              <div className="weather-icon-trash">
                <FaTrash
                  className="plain-link"
                  style={{ color: "silver" }}
                  onClick={() => this.removeWeatherCity(city.name)}
                />
              </div>
            </div>
          );
        })}
      </>
    );
  }

  changeTemperatureUnit(unit) {
    const { user } = this.props;
    database
      .collection("users")
      .doc(user.id)
      .update({ ["weather.unit"]: unit })
      .then(this.updateUserState);
  }

  render() {
    const { weatherCities, weatherSearchInput, error } = this.state;
    return (
      <div className="panel card">
        <div className="panel-title">Weather</div>
        <div className="weather-top">
          <div className="weather-temperature">
            <span
              className="plain-link"
              onClick={() => this.changeTemperatureUnit("Imperial")}
            >
              F
            </span>
            <span> | </span>
            <span
              className="plain-link"
              onClick={() => this.changeTemperatureUnit("Metric")}
            >
              C
            </span>
          </div>
          <div className="weather-input">
            <input
              name="weatherSearchInput"
              type="text"
              value={weatherSearchInput}
              placeholder="Enter City"
              onChange={this.handleChange}
              autoComplete="off"
            ></input>
            <div className="weather-icon-add">
              <IoIosAddCircleOutline
                className="plain-link"
                onClick={this.addWeatherCity}
              />
            </div>
          </div>
        </div>
        <div className="weather-error">{error}</div>
        {this.renderWeatherCities(weatherCities)}
      </div>
    );
  }
}

const weatherIcons = {
  "01": <WiDaySunny />, //Sunny
  "02": <WiDayCloudy />, //Few Clouds
  "03": <WiCloud />, //Scattered Clouds
  "04": <WiCloudy />, //Broken Clouds
  "09": <WiRainMix />, //Shower Rain
  10: <WiRain />, //Rain
  11: <WiThunderstorm />, //Thunderstorm
  13: <WiSnow />, //Snow
  50: <WiFog />, //Mist
};

const mapState = (state) => ({
  user: state.user,
});

const mapDispatch = (dispatch) => ({
  setUserData: (userData) => dispatch(setUserData(userData)),
});

export default connect(mapState, mapDispatch)(Weather);
