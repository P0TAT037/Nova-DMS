import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import './Login.css';
import './Home-buttons.css'
import App from'./Router/Router.js';
import 'bootstrap/dist/css/bootstrap.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <App />
  </BrowserRouter>
);




reportWebVitals();



