/// <reference types="@welldone-software/why-did-you-render" />
import './wdyr'; 

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GameProvider } from './Contexts/GameContext';
import { FirestoreProvider } from './Contexts/FirestoreContext';
import { PlayerProvider } from './Contexts/PlayerContext';
import Test from './Components/Test';
import { TilesProvider } from './Contexts/TilesContext';

ReactDOM.render(
  <React.StrictMode>
    <GameProvider>
      <PlayerProvider>
        <FirestoreProvider>
          <TilesProvider>
            {/* TODO KRIS: Add Game Audio Provider here */}
            <App />
            {/* <Test /> */}
          </TilesProvider>
        </FirestoreProvider>
      </PlayerProvider>
    </GameProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
