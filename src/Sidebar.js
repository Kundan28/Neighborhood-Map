import React, { Component } from "react";

/*class Sidebar*/
export default class Sidebar extends Component {
  constructor() {
    super();

    this.state = {
      query: ''
    }

    this.onChangeQuery = this.onChangeQuery.bind(this);
  }

  /*function to update query*/
  onChangeQuery(event) {
    var query = event.target.value;
    this.setState({query});
  }

  /*function to filter places according to the query*/
  filterPlaces = () => {
    const { query } = this.state;
    this.props.handleQuery(query);
  }

  /*code for search and filter*/
  render() {
    const { filteredPlaces, sidebarStyle, onPlaceSelected } = this.props;

    return (
    <nav className="sidebar" style={sidebarStyle}>
      <a
        className="close" 
        onClick={() => this.props.handleViewSidebar(false)}
        tabIndex="0">
        &times;
      </a>
      <input 
        className="search" 
        type="text" 
        placeholder="Search" 
        onChange={this.onChangeQuery} 
        tabIndex="2" />
      <button 
        className="filter" 
        type="button" 
        onClick={() => this.filterPlaces()}
        tabIndex="3">
        Filter
      </button>
      {
        filteredPlaces.map((place, id) => (
          <a
            key={id} 
            aria-label="Place"
            onClick={() => onPlaceSelected(place)}
            >
            {place.title}
          </a>
        ))
      }
    </nav>)
  }
}