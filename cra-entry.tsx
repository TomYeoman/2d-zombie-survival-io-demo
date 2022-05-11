import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './apps/next/src/app/store';
import Main from './apps/next/src/game/Main';
import { Toolbar } from './apps/next/src/features/toolbar/Toolbar';
import { GameStatusHUD } from './apps/next/src/features/playerhud/GameStatusHUD';
import { PlayerHUD } from './apps/next/src/features/playerhud/PlayerHUD';
import { DebugBar } from './apps/next/src/features/debugbar/DebugBar';

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
