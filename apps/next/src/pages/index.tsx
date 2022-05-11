import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import Main from '../game/Main';
import { Toolbar } from '../features/toolbar/Toolbar';
import { GameStatusHUD } from '../features/playerhud/GameStatusHUD';
import { PlayerHUD } from '../features/playerhud/PlayerHUD';
import { DebugBar } from '../features/debugbar/DebugBar';

ReactDOM.render(
  <React.StrictMode>
        <Provider store={store}>

      <Main />
      <GameStatusHUD/>
      <Toolbar/>
      <DebugBar/>
      <PlayerHUD/>
      </Provider>

  </React.StrictMode>,
  document.getElementById('root')
);
