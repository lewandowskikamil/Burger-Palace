import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers
} from 'redux';
import {
  Provider,
  useSelector
} from 'react-redux';
import thunk from 'redux-thunk';
import burgerBuilderReducer from './store/reducers/burgerBuilder';
import orderReducer from './store/reducers/order';
import ordersReducer from './store/reducers/orders';
import authReducer from './store/reducers/auth';
import cartReducer from './store/reducers/cart';
import {
  reduxFirestore,
  getFirestore,
  createFirestoreInstance,
  firestoreReducer
} from "redux-firestore";
import {
  ReactReduxFirebaseProvider,
  getFirebase,
  isLoaded,
  firebaseReducer
} from "react-redux-firebase";
import fbConfig from "./firebaseConfig";
import firebase from "firebase/app";

const rootReducer = combineReducers({
  burger: burgerBuilderReducer,
  order: orderReducer,
  orders: ordersReducer,
  auth: authReducer,
  cart: cartReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
})

const composeEnhancers = process.env.NODE_ENV === 'development' ? (
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) : null || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk.withExtraArgument({ getFirestore, getFirebase })),
    reduxFirestore(firebase,fbConfig)
  )
);

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
}

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
};

const AuthIsLoaded = ({ children }) => {
  const auth = useSelector(state => state.firebase.auth);
  if (!isLoaded(auth)) return <div>Loading screen...</div>
  return children
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <AuthIsLoaded>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthIsLoaded>
      </ReactReduxFirebaseProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


serviceWorker.unregister();
