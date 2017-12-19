import { fork, put, take, takeEvery } from 'redux-saga/effects';
import { routinePromiseWatcherSaga } from 'redux-saga-routines'
import AuthSagas, {
  initAuthSaga,
  afterLogin,
  afterLogout,
  afterRegister,
  logout,
  isTokenRefreshing,
  selectAccessToken,
  selectRefreshToken,
  tokenRefreshed,
  tokenRefreshing
} from 'redux-saga-auth';
import ApiCallSaga, { cancelAll } from 'redux-saga-api-call-routines';
import {
  init,
  ready
} from './AppActions';
import {
  restoreTokens,
  saveTokens,
  resetTokens,
  updateAccessToken,
  fetchApi,
  refreshAccessToken
} from './AppService';
/*** import app sagas ***/
import appSagas from '../../../modules/sagas';

import {
  login as navLogin,
  logout as navLogout,
  register as navRegister
} from '../Nav/NavActions';

export default function* AppSaga() {

  /*** start AuthSagas watcher here ***/
  yield fork(AuthSagas, { saveTokens, updateAccessToken, resetTokens });

  /*** fork after[*] effects here.
   * They are needed on `init` stage to change Splash to a corresponding screen
   * Don't mind takeEvery, because the order and the flow of login/logout actions are done by redux-saga-auth
   ***/
  yield takeEvery(`${afterLogin}`, afterLoginSaga);
  yield takeEvery(`${afterRegister}`, afterRegisterSaga);
  yield takeEvery(`${afterLogout}`, afterLogoutSaga);

  yield take(`${init}`);

  /*** at this moment AuthSaga watcher must be running to capture login ***/
  yield* initAuthSaga(restoreTokens, resetTokens);

  /*** start redux-saga-api-call-routines ***/
  yield fork(ApiCallSaga, {
    fetchApi,
    refreshAccessToken,
    logout,
    tokenRefreshed,
    tokenRefreshing,
    isTokenRefreshing,
    selectAccessToken,
    selectRefreshToken,
  });

  yield fork(routinePromiseWatcherSaga);

  //TODO: here hide splash and all other onReady routines, and start all further sagas

  /*** all other onReady routines, and start all further sagas ***/
  const appSagasTasks = yield appSagas.map((saga) => fork(saga));

  console.log(appSagasTasks);

  yield put(ready());
}

function *afterLoginSaga() {
  yield put(navLogin());
}

function *afterRegisterSaga() {
  yield put(navRegister());
}

function *afterLogoutSaga() {
  yield put(cancelAll());
  yield put(navLogout());
}