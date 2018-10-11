import {
  Platform
} from 'react-native';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './reducers';
import middleWares from '../modules/middleWares';
import enhancers from '../modules/enhancers';
import rootSaga from './sagas';
import { navMiddleware } from './modules/Nav/Nav';

const composeEnhancers = composeWithDevTools({
  name: Platform.OS // Specify here name, actionsBlacklist, actionsCreators and other options
});
const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['filter']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const configureStore = () => {
  const store = createStore(
    persistedReducer,
    //rootReducer,
    composeEnhancers.apply(null, [
      ...enhancers,
      applyMiddleware.apply(null, [
        navMiddleware,
        sagaMiddleware,
        ...middleWares
      ])
      //autoRehydrate()
    ])
  );
  if (module.hot) {
    module.hot.accept(() => {
      store.replaceReducer(require('./reducers').rootReducer);
    });
  }

  sagaMiddleware.run(rootSaga);

  return store;
};

export const store = configureStore()