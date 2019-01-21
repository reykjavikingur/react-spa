import React from 'react';
import {Route, Switch, NavLink} from 'react-router-dom';
import Root from './Root';
import About from './About';
import Lost from './Lost';

class App extends React.Component {

	render() {
		return [
			<nav key="nav">
				<ul>
					<li><NavLink exact to="/">Home</NavLink></li>
					<li><NavLink to="/about">About</NavLink></li>
				</ul>
			</nav>
			,
			<Switch key="switch">
				<Route exact path="/" component={Root}/>
				<Route path="/about" component={About}/>
				<Route component={Lost}/>
			</Switch>
		]
	}
}

export default App;
