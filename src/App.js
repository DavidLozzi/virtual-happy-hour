import React from 'react';

import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import './App.scss';

import store from 'redux/store';
import history from 'redux/history';

import BrandWrapper from 'brands/BrandWrapper';

import Room from 'components/room/room';
import RoomForm from 'components/roomform/roomform';

function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <BrandWrapper>
          <Switch>
            <Route path={'/:roomName'} component={Room} />
            <Route path={'/'} component={RoomForm} />
          </Switch>
        </BrandWrapper>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
