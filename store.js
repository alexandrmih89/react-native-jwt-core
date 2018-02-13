import { composeWithDevTools } from 'remote-redux-devtools';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './reducers';
import middleWares from '../modules/middleWares';
import enhancers from '../modules/enhancers';
import rootSaga from './sagas';
import { navMiddleware } from './modules/Nav/Nav';

const composeEnhancers = composeWithDevTools({});
const sagaMiddleware = createSagaMiddleware();

export const configureStore = () => {
  const store = createStore(
    rootReducer,
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