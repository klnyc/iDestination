import React from 'react'
import { connect } from 'react-redux'
import { InfoWindow } from 'react-google-maps'
import { FaTrash, MdStar, GiFire } from '../icons'
import { addMarker, removeMarker, closeInfoWindow, setHome } from '../store'
import { colors } from './Index'

class Window extends React.Component {
    constructor() {
        super()
        this.state = { 
            month: '',
            day: '',
            year: '',
            error: ''
        }
        this.renderInfoWindowIcons = this.renderInfoWindowIcons.bind(this)
        this.renderInfoWindowDate = this.renderInfoWindowDate.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.renderDatePicker = this.renderDatePicker.bind(this)
        this.submitPlace = this.submitPlace.bind(this)
        this.dateFocus = this.dateFocus.bind(this)
    }

    handleChange(event) {
        if (event.target.name === 'month' || event.target.name === 'day') {
            if (event.target.value.length <= 2) this.setState({ [event.target.name]: event.target.value })
        }
        if (event.target.name === 'year') {
            if (event.target.value.length <= 4) this.setState({ [event.target.name]: event.target.value })
        }
    }

    renderInfoWindowIcons() {
        const { infoWindow } = this.props
        if (infoWindow.experiences && infoWindow.wishlist) return <div><GiFire /><MdStar /></div>
        if (infoWindow.experiences) return <div><GiFire style={{ color: colors.experiences }} /></div>
        if (infoWindow.wishlist) return <div><MdStar style={{ color: colors.wishlist }} /></div>
    }

    renderInfoWindowDate() {
        const { user, infoWindow, removeMarker } = this.props
        return (
          <div className='infoWindow-date-container'>
            {this.renderInfoWindowIcons()}
            <div className='infoWindow-date'>{infoWindow.date}</div>
            <div className='infoWindow-icon-trash plain-link' onClick={() => removeMarker(user.id, infoWindow)}><FaTrash style={{ color: 'silver' }} /></div>
          </div>
        )
    }

    renderDatePicker() {
        const { month, day, year , error} = this.state
        return (
            <>
                <div className='datepicker'>
                    <input name='month' type='number' placeholder='MM' value={month} onChange={this.handleChange} />
                    <input name='day' type='number' placeholder='DD' value={day} onChange={this.handleChange} />
                    <input name='year' type='number' placeholder='YYYY' value={year} onChange={this.handleChange} />
                </div>
                {error && <div className='datepicker-error'>{error}</div>}
            </>
        )
    }

    dateFocus() {
        const month = document.querySelectorAll('input[name=month]')[0]
        const day = document.querySelectorAll('input[name=day]')[0]
        const year = document.querySelectorAll('input[name=year]')[0]
        if (month.value.length === 2) day.focus()
        if (day.value.length === 2) year.focus()
    }

    submitPlace(category) {
        const { month, day, year } = this.state
        const { user, currentMarker, addMarker } = this.props
        if (!month && !day && !year) {
            addMarker(user.id, currentMarker, this.state, category)
        } else if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1920 || year > 2200) {
            this.setState({ error: 'Invalid date' })
        } else {
            addMarker(user.id, currentMarker, this.state, category)
        }
    }

    render() {
        const { infoWindow, markers, closeInfoWindow, home, setHome, user } = this.props;
        return (
            <InfoWindow position={infoWindow.position} onCloseClick={() => closeInfoWindow()}>
                <div className='infoWindow'>

                    {/* Location Details */}
                    <div className='infoWindow-name'>{infoWindow.name}</div>
                    <div className='infoWindow-address'>{infoWindow.street}</div>
                    <div className='infoWindow-address'>{infoWindow.location}</div>

                    {/* New Location */}
                    {!home && (infoWindow !== user.home) && markers.indexOf(infoWindow) === -1 &&
                    <>
                        {this.renderDatePicker()}
                        {document.getElementsByClassName('datepicker')[0] && this.dateFocus()}
                        <div className='infoWindow-button-container'>
                            <div className='infoWindow-button experiences' onClick={() => this.submitPlace('experiences')}>Add Experience</div>
                            <div className='infoWindow-button wishlist' onClick={() => this.submitPlace('wishlist')}>Add Wish</div>
                        </div>
                    </>}

                    {/* Added Location */}
                    {!home && (infoWindow !== user.home) && markers.includes(infoWindow) && this.renderInfoWindowDate()}

                    {/* Add Home */}
                    {home && (infoWindow !== user.home) && <div className='infoWindow-button user-home set-home-active' onClick={() => setHome(user.id, infoWindow)}>Set Home</div>} 

                    {/* Existing Home */} 
                    {(infoWindow === user.home) && <div className='infoWindow-button user-home'>Home</div>}     
                              
                </div>
            </InfoWindow>
        )
    }
}

const mapState = (state) => ({
    user: state.user,
    markers: state.markers,
    currentMarker: state.currentMarker,
    infoWindow: state.infoWindow,
    home: state.home
})

const mapDispatch = (dispatch) => ({
    addMarker: (id, marker, date, category) => dispatch(addMarker(id, marker, date, category)),
    removeMarker: (id, marker) => dispatch(removeMarker(id, marker)),
    closeInfoWindow: () => dispatch(closeInfoWindow()),
    setHome: (id, marker) => dispatch(setHome(id, marker))
})

export default connect(mapState, mapDispatch)(Window)