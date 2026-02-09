# iDestination

iDestination is a travel planning single-page application which allows users to keep track of places that they have traveled to in the past and places that they plan to visit in the future. Users can search, add, and filter locations on an integrated map and view real-time weather of any city.

https://idestination.web.app/

## :gear: Functionality
* Optimized for iPhone and desktop
* Login or sign up with your email
* Search and add locations as past experiences or to your wishlist
* Add dates to each location entry
* Delete logged locations
* Filter the map by categories
* Set your home location
* View lists of all logged locations
* View real-time weather of any city

## :hammer_and_pick: Technology Stack

Front End
* React
* Redux
* Webpack
* CSS

Back End
* Firebase
* Google Maps API
* Open Weather API

## :iphone: Add To Your iPhone
* Open Safari
* Visit idestination.web.app
* Go to your browser options, settings, or preferences
* Click "Add to Home Screen"
* Open iDestination from your home screen

## :notebook_with_decorative_cover: Notes
* Using Webpack 4 with Node 15. Any upgrades to Webpack and Node will break unless the whole app is migrated to the latest Google Maps API, Firebase and functional React components.
* `firebase` variable is defined globally by the Firebase scripts in `index.html`
* Running `webpack-dev-server` rebuilds automatically on every save. Run `firebase deploy` to deploy the current build.