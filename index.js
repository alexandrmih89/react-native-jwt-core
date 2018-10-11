import React from 'react';
import {
  View,
  Text
} from 'react-native';
import { Provider } from 'react-redux';

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

//import { configureStore } from './store';
import { store } from './store';
import AppContainer from './modules/App/App';

if (__DEV__) {
  /*** Set requests debuggable in the console ***/
  //GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
} else {
  /*** Remove console calls in production ***/
  GLOBAL.console.log = () => {};
  GLOBAL.console.warn = () => {};
  GLOBAL.console.error = () => {};
}

const persistor = persistStore(store)

//const store = configureStore();

class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
    );
  }

}

export default App;