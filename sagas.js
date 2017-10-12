import { all } from 'redux-saga/effects';
import AppSagas from './modules/App/AppSagas';

export default function* rootSaga() {
  yield all([
    AppSagas()
  ])
}
