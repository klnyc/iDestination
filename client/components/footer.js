import React from 'react'
import { connect } from 'react-redux'
import { colors } from './Index'
import { MdStar, GiFire } from '../icons'
import { toggleListExperiences, toggleListWishlist } from '../store'

class Footer extends React.Component {
    render() {
        const { list, toggleListExperiences, toggleListWishlist } = this.props
        return (
            <div className='footer'>
                <div className='footer-section'>
                    <GiFire className='plain-link' color={colors.experiences} onClick={() => toggleListExperiences(list.experiences)} />
                    <div className='footer-label'>Experiences</div>
                </div>
                <div className='footer-section'>
                    <MdStar className='plain-link' color={colors.wishlist} onClick={() => toggleListWishlist(list.wishlist)} />
                    <div className='footer-label'>Wishlist</div>
                </div>
            </div>
        )
    }
}

const mapState = (state) => ({
    list: state.list
})

const mapDispatch = (dispatch) => ({
    toggleListExperiences: (list) => dispatch(toggleListExperiences(list)),
    toggleListWishlist: (list) => dispatch(toggleListWishlist(list))
})

export default connect(mapState, mapDispatch)(Footer)