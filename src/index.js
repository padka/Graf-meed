import React from 'react';
import { createRoot } from "react-dom/client";
import './App.css'

import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
const rootElem = document.getElementById('root');
const reactRoot = createRoot(rootElem);
reactRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);




