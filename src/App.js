import React from 'react';

import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import './App.scss';

import store from 'redux/store';
import history from 'redux/history';

import Room from 'components/room/room';

import 'assets/images/hero.png'; // used in CSS

function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
          <Switch>
            <Route path={'/:roomName'} component={Room} />
            <Route path={'/'} component={Room} />
          </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
