import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { StylesProvider } from '@material-ui/core/styles'
import './App.scss';

ReactDOM.render(
  <StylesProvider injectFirst>
  <App /></StylesProvider>,
  document.getElementById('root')
);
registerServiceWorker();
