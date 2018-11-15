 import React, {Component} from 'react';
 import  './App.css';

class ErrorMessage extends Component {

state =  { 
 errorMessage: ' Error: Problem in loading Google API'
}

render () {

return ( 
	<h1 className = "error-screen-message" > { this.state.errorMessage} </h1>

	)}
}

export default ErrorMessage;