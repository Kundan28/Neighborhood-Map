import React, { Component } from "react";
import MapComponent from "./MapComponent";
import places from './places.json';
import Sidebar from './Sidebar';

/*FourSquare API client-id and client-secret key*/
const CLIENT_ID = "UYK4Y5RQYBI1BGZ20ETWR3EVVRGQSIFNLZFTOE3M00ZKRYKZ";
const CLIENT_SECRET = "WUP1CX3J0JEW3EOVFDN0HMWRAKNABG4JYPQNBZBCOAGPW4DR";
const FS_VERSION = "20181108";

/*App class*/
export default class App extends Component {
  constructor() {
    super();

    this.state = {
      sidebarStyle: {width: '0px'},
      fullContentStyle: {marginLeft: '0px'},
      filteredPlaces: places,
      allPlaces: places,
      selectedPlace: {},
    }

    this.handleViewSidebar = this.handleViewSidebar.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
    this.onPlaceSelected = this.onPlaceSelected.bind(this);
    this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
  }


/*Implementation of FourSquare API*/
  componentDidMount() {
    const static_data = "client_id=" + CLIENT_ID +
               "&client_secret=" + CLIENT_SECRET +
               "&v=" + FS_VERSION +
               "&limit=1";
    const { allPlaces } = this.state;
    let errors = [];
    allPlaces.map((place, id) => {
      const data = static_data + "&ll=" + place.latitude + "," + place.longitude;
      fetch("https://api.foursquare.com/v2/venues/explore?" + data)
      .then(res => res.json())
      .then(
        (result) => {
          if (result.response && result.response.groups) {
            allPlaces[id].formattedAddress = result.response.groups[0].items[0].venue.location.formattedAddress.join(", ");
            this.setState({allPlaces});
          } else {
            errors.push("FourSquare API unsuccessfully returned address of the venue:" + place.title + "\n");
          }
        },
        (error) => {
          errors.push("An error occurred from FourSquare API for the venue:" + place.title + "\n");
        }
      ).catch(()=>{this.setState({requestAvailable: false})});
      return "";
    });

    setTimeout(function(){ 
      if (errors !== undefined && errors.length > 0) {
        window.alert(errors.toString().replace(new RegExp(',', 'g'), '')); 
      }
    }, 3000);
  }

  /*function to filter the places*/
  handleQuery(query) {
    const filteredPlaces = this.state.allPlaces.filter(place => place.title.includes(query));
    this.setState({filteredPlaces});
  }

  /*function for toggling sidebar*/
  handleViewSidebar(shouldBeDisplayed) {
    if (shouldBeDisplayed) {
      this.setState({
        sidebarStyle: {width: '240px'},
        fullContentStyle: {marginLeft: '240px'}
    });
    } else if (!shouldBeDisplayed) {
      this.setState({
        sidebarStyle: {width: '0px'},
        fullContentStyle: {marginLeft: '0px'}
      });
    }
  }

  /*function to close info window*/
  onInfoWindowClose() {
    this.setState({
      selectedPlace: {},
    });
  }

  /*function to open info window*/
  onPlaceSelected(place) {
    this.setState({
      selectedPlace: place,
    });
  }

  /*function to render elements on the page*/
  render() {
    const { sidebarStyle, filteredPlaces, selectedPlace } = this.state;
    const style = { height: `calc(100vh)` };
    return (
      <React.Fragment>
        <Sidebar
          aria-label="Side Bar"
          sidebarStyle={sidebarStyle}
          filteredPlaces={filteredPlaces}
          handleViewSidebar={this.handleViewSidebar}
          onPlaceSelected={this.onPlaceSelected}
          handleQuery={this.handleQuery}
          />

        <div id="content" style={this.state.fullContentStyle}>
          <span className="hamburger" 
            tabIndex="1"
            /*code for hamburger icon*/
            onClick={() => this.handleViewSidebar(true)}>&#8801;</span>
          <div id="map" role="application">
            <MapComponent
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB135NExz5F5gjvTL5Gyvmq-qz-2uXtCHw&v=3.exp&libraries=places"
              loadingElement={<div style={style} />}
              containerElement={<div style={style} />}
              mapElement={<div style={style} />}
              filteredPlaces={filteredPlaces}
              selectedPlace={selectedPlace}
              onPlaceSelected={this.onPlaceSelected}
              onInfoWindowClose={this.onInfoWindowClose}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}