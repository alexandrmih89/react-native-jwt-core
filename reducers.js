import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { reducer as auth } from 'redux-saga-auth';
import reducers from '../modules/reducers';

import nav from './modules/Nav/NavReducers';

export const rootReducer = combineReducers({
  auth,
  form,
  nav,
  ...reducers
});
