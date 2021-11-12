import React from 'react'
import { connect } from 'react-redux'
import { goToMarker, toggleOffFeatures } from '../store'

class List extends React.Component {
    constructor() {
        super()
        this.renderMarkerDetails = this.renderMarkerDetails.bind(this)
        this.sortMarkers = this.sortMarkers.bind(this)
    }

    renderMarkerDetails(marker, index) {
        const { goToMarker, toggleOffFeatures, list } = this.props
        return (
            <div key={index} className={'list-line color-link ' + (list.experiences ? 'experiences' : 'wishlist')} onClick={() => { goToMarker(marker); toggleOffFeatures() }}>
                <div className='list-column name'>{marker.name}</div>
                <div className='list-column city'>{marker.city}</div>
                <div className='list-column date'>{marker.date}</div>
            </div>
        )
    }

    sortMarkers(markers) {
        return markers.sort((a, b) => {
            const formatDate = (date) => date ? `${date.slice(6)}${date.slice(0, 2)}${date.slice(3, 5)}` : ''
            return formatDate(b.date) - formatDate(a.date)
        })
    }

    render() {
        const { list, markers } = this.props
        const experiences = markers.filter(marker => marker.experiences)
        const wishlist = markers.filter(marker => marker.wishlist)
        const listMarkers = list.experiences ? experiences : wishlist
        return (
            <div className='panel card'>
                <div className='panel-title'>{list.experiences ? 'Experiences' : 'Wishlist'}</div>
                {this.sortMarkers(listMarkers).map((marker, index) => this.renderMarkerDetails(marker, index))}
            </div>
        )
    }
}

const mapState = (state) => ({
    markers: state.markers,
    list: state.list
})

const mapDispatch = (dispatch) => ({
    goToMarker: (marker) => dispatch(goToMarker(marker)),
    toggleOffFeatures: () => dispatch(toggleOffFeatures())
})

export default connect(mapState, mapDispatch)(List)