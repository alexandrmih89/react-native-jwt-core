import { composeWithDevTools } from 'remote-redux-devtools';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './reducers';
import rootSaga from './sagas';

const composeEnhancers = composeWithDevTools({});
const sagaMiddleware = createSagaMiddleware();

export const configureStore = () => {
  const store = createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(
        sagaMiddleware
      )
    )
  );
  if (module.hot) {
    module.hot.accept(() => {
      store.replaceReducer(require('./reducers').rootReducer);
    });
  }

  sagaMiddleware.run(rootSaga);

  return store;
};