import React from 'react'
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App';
import store from './store/configureStore.js';

render((
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));
