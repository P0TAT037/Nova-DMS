import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from'./Router/Router.js';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <App />
  </BrowserRouter>
);




reportWebVitals();



