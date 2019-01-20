console.log('starting');

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom';

const el = document.querySelector('#app');

if (el) {
	ReactDOM.render(
		<BrowserRouter>
			<App/>
		</BrowserRouter>
		,
		el
	)
}
