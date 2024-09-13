import React from 'react';
import './i18n';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './Store/index';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "aos/dist/aos.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store} >
    <App />
  </Provider>
);
  