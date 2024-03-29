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
import { AssetsProvider } from './Contexts/AssetsContext';
import { AudioProvider } from './Contexts/AudioContext';

ReactDOM.render(
  <React.StrictMode>
    <GameProvider>
      <PlayerProvider>
        <AssetsProvider>
          <FirestoreProvider>
            <AudioProvider>
              <App />
            </AudioProvider>
          </FirestoreProvider>
        </AssetsProvider>
      </PlayerProvider>
    </GameProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
