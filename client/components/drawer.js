import React from 'react'
import { connect } from 'react-redux'
import { toggleCategory, toggleHome, goToMarker, setCenter, toggleWeather } from '../store'
import { Header } from './Header'

class Drawer extends Header {
    render() {
        const { user, category, toggleCategory, home, toggleHome, toggleWeather } = this.props
        return (
            <div className='drawer card'>

                {/* Name Section */}
                <div className='drawer-section top'>
                    <div className='drawer-name'>{user.name}</div>
                    <div className='drawer-email'>{user.email}</div>
                </div>

                {/* Display Section */}
                <div className='drawer-section'>
                    <div className='drawer-title'>Display</div>
                    <div className='drawer-link color-link' onClick={() => toggleCategory('all')}>
                        All{(category.experiences && category.wishlist) ? <span>●</span> : ''}
                    </div>
                    <div className='drawer-link color-link' onClick={() => toggleCategory('experiences')}>
                        Experiences{(category.experiences && !category.wishlist) ? <span>●</span> : ''}
                    </div>
                    <div className='drawer-link color-link' onClick={() => toggleCategory('wishlist')}>
                        Wishlist{(!category.experiences && category.wishlist) ? <span>●</span> : ''}
                    </div>
                </div>

                {/* Features Section*/}
                <div className='drawer-section'>
                    <div className='drawer-title'>Features</div>
                    <div className='drawer-link color-link' onClick={() => toggleWeather()}>Weather</div>
                </div>

                {/* Account Section */}
                <div className='drawer-section'>
                    <div className='drawer-title'>Account</div>
                    <div className='drawer-link color-link' onClick={() => { toggleHome(home); this.goHome() }}>Set Home</div>
                    <div className='drawer-link color-link' onClick={() => firebase.auth().signOut()}>Sign Out</div>
                </div>

                <div className='drawer-copyright'>© 2020 iDestination</div>

            </div>
        )
    }
}

const mapState = (state) => ({
    user: state.user,
    category: state.category,
    home: state.home
})

const mapDispatch = (dispatch) => ({
    toggleCategory: (category) => dispatch(toggleCategory(category)),
    toggleHome: (home) => dispatch(toggleHome(home)),
    toggleWeather: () => dispatch(toggleWeather()),
    goToMarker: (marker) => dispatch(goToMarker(marker)),
    setCenter: (coordinates) => dispatch(setCenter(coordinates)),
})

export default connect(mapState, mapDispatch)(Drawer)