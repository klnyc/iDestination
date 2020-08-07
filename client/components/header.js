import React from 'react'
import { connect } from 'react-redux'
import { IoMdPerson, IoMdHome } from 'react-icons/io'
import { toggleDrawer, goToMarker, setCenter } from '../store'

class Header extends React.Component {
    constructor() {
        super()
        this.goHome = this.goHome.bind(this)
        this.renderLoginHeader = this.renderLoginHeader.bind(this)
        this.renderMapHeader = this.renderMapHeader.bind(this)
    }

    goHome() {
        const { goToMarker, setCenter, user } = this.props
        const NYC = { lat: 40.7473735256486, lng: -73.98564376909184 }
        user.home ? goToMarker(user.home) : setCenter(NYC)
    }

    renderLoginHeader() {
        const { toggleDrawer, drawer } = this.props
        return (
            <div className="header header-login">
                <div className="header-icon"><img src="img/logo.png" width="40" height="40"></img></div>
                <div className="header-title">iDestination</div>
                <div className="header-icon"><div className="header-login-link">Login</div></div>
            </div>
        )
    }

    renderMapHeader() {
        const { toggleDrawer, drawer } = this.props
        return (
            <div className="header">
                <div className="header-icon"><IoMdPerson className="plain-link" onClick={() => toggleDrawer(drawer)} /></div>
                <div className="header-title">iDestination</div>
                <div className="header-icon"><IoMdHome className="plain-link" onClick={this.goHome} /></div>
            </div>
        )
    }

    render() {
        const { user } = this.props
        return (
            user.id ? this.renderMapHeader() : this.renderLoginHeader()
        )
    }
}

const mapState = (state) => ({
    user: state.user,
    drawer: state.drawer
})

const mapDispatch = (dispatch) => ({
    toggleDrawer: (drawer) => dispatch(toggleDrawer(drawer)),
    goToMarker: (marker) => dispatch(goToMarker(marker)),
    setCenter: (coordinates) => dispatch(setCenter(coordinates))
})

export default connect(mapState, mapDispatch)(Header)
