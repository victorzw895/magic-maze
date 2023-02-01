/// <reference types="@welldone-software/why-did-you-render" />
import './wdyr'; 

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GameProvider} from './Contexts/GameContext';
import { DBProvider} from './Contexts/DBContext';


ReactDOM.render(
  <React.StrictMode>
    <DBProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </DBProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
