console.log('starting');
require('@babel/polyfill');
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter, HashRouter} from 'react-router-dom';

const el = document.querySelector('#app');

if (el) {
	ReactDOM.render(
		<HashRouter>
			<App/>
		</HashRouter>
		,
		el
	)
}
