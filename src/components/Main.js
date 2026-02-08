import React from "react";
import { connect } from "react-redux";
import { Header, Footer, Map, Home, Drawer, List, Weather } from "./Index";
import { login, logout } from "../store";

class Main extends React.Component {
  constructor() {
    super();
    this.state = { loading: true };
    this.load = this.load.bind(this);
    this.renderApp = this.renderApp.bind(this);
    this.renderMap = this.renderMap.bind(this);
    this.renderHomePage = this.renderHomePage.bind(this);
    this.renderLoadingPage = this.renderLoadingPage.bind(this);
  }

  componentDidMount() {
    const { login, logout } = this.props;
    this.load();
    firebase
      .auth()
      .onAuthStateChanged((user) => (user ? login(user) : logout()));
  }

  load() {
    new Promise((resolve) => setTimeout(resolve, 1200)).then(() =>
      this.setState({ loading: false })
    );
  }

  renderMap() {
    const { drawer, list, weather } = this.props;
    return (
      <>
        <Map />
        {drawer && <Drawer />}
        {(list.experiences || list.wishlist) && <List />}
        {weather && <Weather />}
        <Footer />
      </>
    );
  }

  renderHomePage() {
    return <Home />;
  }

  renderLoadingPage() {
    return (
      <div className="loading">
        <div className="circle">
          <div className="dots"></div>
        </div>
      </div>
    );
  }

  renderApp() {
    const { user } = this.props;
    return (
      <>
        <Header />
        {user.id ? this.renderMap() : this.renderHomePage()}
      </>
    );
  }

  render() {
    const { loading } = this.state;
    return (
      <div id="main">
        {loading ? this.renderLoadingPage() : this.renderApp()}
      </div>
    );
  }
}

const mapState = (state) => ({
  user: state.user,
  drawer: state.drawer,
  list: state.list,
  weather: state.weather,
});

const mapDispatch = (dispatch) => ({
  login: (user) => dispatch(login(user)),
  logout: () => dispatch(logout()),
});

export default connect(mapState, mapDispatch)(Main);
