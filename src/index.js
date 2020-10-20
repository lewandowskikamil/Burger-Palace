import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Spinner from './components/UI/Spinner/Spinner';
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
import adminReducer from './store/reducers/admin';
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
import { fadeVariants, variantsProps } from './shared/utility';

const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  orders: ordersReducer,
  auth: authReducer,
  cart: cartReducer,
  admin: adminReducer,
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
    reduxFirestore(firebase, fbConfig)
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
  const auth = useSelector(({ firebase: { auth } }) => auth);
  const profile = useSelector(({ firebase: { profile } }) => profile);
  return (
    <AnimatePresence exitBeforeEnter>
      {!isLoaded(auth) || !isLoaded(profile) ? (
        <motion.div
          key='mainSpinner'
          variants={fadeVariants}
          {...variantsProps}
        >
          <Spinner withFullPageWrapper large />
        </motion.div>
      ) : children}
    </AnimatePresence>
  )
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
