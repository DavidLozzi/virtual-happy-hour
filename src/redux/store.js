import { connectRouter, routerMiddleware } from 'connected-react-router';
import { combineReducers, applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import history from 'redux/history';

import { name as conversationsName, reducer as conversationsReducer } from 'redux/api/room/room';
import { name as meName, reducer as meReducer } from 'redux/api/me/me';

const middleware = [ // Order dependent
  thunk, // Enables actions to return functions
  routerMiddleware(history) // Enables dispatching actions
];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger({ collapsed: true })); // Must be at bottom
}

let reduxCompose;
if (process.env.NODE_ENV === 'production') {
  reduxCompose = compose(applyMiddleware(...middleware));
} else reduxCompose = composeWithDevTools(applyMiddleware(...middleware)); // Use only in the lower environments


const store = createStore(
  combineReducers({
    router: connectRouter(history),
    [conversationsName]: conversationsReducer,
    [meName]: meReducer
  }),
  reduxCompose
);

export default store;