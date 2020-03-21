import React from 'react';

import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import store from 'redux/store';
import history from 'redux/history';

import Lobby from 'components/lobby/lobby';

function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
          <Switch>
            <Route path={'/:roomName'} component={Lobby} />
            <Route path={'/'} component={Lobby} />
          </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
