import React from 'react'
import { connect } from 'react-redux'
import { closeLogIn } from '../store'
import { colors } from './Index'
import { GiFire, MdStar, MdAddLocation, FaSearch, FaMap, IoIosHome, IoIosPhonePortrait, IoMdSunny } from '../icons'

class Home extends React.Component {
    render() {
        const { closeLogIn } = this.props
        return (
            <div className='home' onClick={() => closeLogIn()}>

                {/* Description Section */}
                <div className='home-description'>
                    <div className='home-description-slogan'>
                        <span>Travel journal.</span><span>Travel planner.</span><span>All in one.</span>
                    </div>
                    <div className='home-description-text-container'>
                        <div className='home-description-text'>Keep track of your adventures.</div>
                        <div className='home-description-text'>Plan your next vacation.</div>
                    </div>
                    <div className='home-description-map'><img src='img/screenshot.png' className='card'></img></div>
                </div>

                {/* Information Section */}
                <div className='home-information'>
                    <div className='home-information-top'>
                        <div className='home-information-top-box'>
                            <GiFire className='home-information-top-icon' color={colors.experiences} />
                            <div className='home-information-top-title'>Experiences</div>
                            <div className='home-information-top-text'>Track all the places that</div>
                            <div className='home-information-top-text'>you've visited in the past.</div>
                            <div className='home-information-top-text'>Visually reminisce your</div>
                            <div className='home-information-top-text'>travel history on a map.</div>
                        </div>
                        <div className='home-information-top-box'>
                            <MdStar className='home-information-top-icon' color={colors.wishlist} />
                            <div className='home-information-top-title'> Wishlist</div>
                            <div className='home-information-top-text'>Track all the places that</div>
                            <div className='home-information-top-text'>you wish to visit in the future.</div>
                            <div className='home-information-top-text'>See how close they are so</div>
                            <div className='home-information-top-text'>you can plan accordingly.</div>
                        </div>
                    </div>
                    <div className='home-information-bottom'>
                        <div className='home-information-bottom-box'>
                            <FaSearch className='home-information-bottom-icon' />
                            <div className='home-information-bottom-text'>Search thousands of places</div>
                            <div className='home-information-bottom-text'>all over the world.</div>
                        </div>
                        <div className='home-information-bottom-box'>
                            <MdAddLocation className='home-information-bottom-icon' />
                            <div className='home-information-bottom-text'>Add location markers</div>
                            <div className='home-information-bottom-text'>to your journal map.</div>
                        </div>
                        <div className='home-information-bottom-box'>
                            <FaMap className='home-information-bottom-icon' />
                            <div className='home-information-bottom-text'>Filter your saved locations</div>
                            <div className='home-information-bottom-text'>by experiences or wishes.</div>
                        </div>
                        <div className='home-information-bottom-box'>
                            <IoIosHome className='home-information-bottom-icon' />
                            <div className='home-information-bottom-text'>Set your default</div>
                            <div className='home-information-bottom-text'>home location.</div>
                        </div>
                        <div className='home-information-bottom-box'>
                            <IoMdSunny className='home-information-bottom-icon' />
                            <div className='home-information-bottom-text'>Check real-time weather</div>
                            <div className='home-information-bottom-text'>of any city.</div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className='home-footer'>
                    <div className='home-footer-install'>
                        <div className='home-footer-install-left'>
                            <IoIosPhonePortrait className='phone-icon' />
                        </div>
                        <div className='home-footer-install-right'>
                            <div className='home-footer-install-title'>Add iDestination to your iPhone</div>
                            <div className='home-footer-install-text'>• Open Safari</div>
                            <div className='home-footer-install-text'>• Visit idestination.web.app</div>
                            <div className='home-footer-install-text'>• Go to your browser settings</div>
                            <div className='home-footer-install-text'>• Click 'Add to Home Screen'</div>
                            <div className='home-footer-install-text'>• Open iDestination from your home screen</div>
                        </div>
                    </div>
                    <div className='home-footer-bottom'>© 2020 iDestination</div>
                </div>

            </div>
        )
    }
}

const mapDispatch = (dispatch) => ({
    closeLogIn: () => dispatch(closeLogIn())
})

export default connect(null, mapDispatch)(Home)