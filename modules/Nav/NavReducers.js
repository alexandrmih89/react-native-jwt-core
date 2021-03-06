import _ from 'lodash';
import { NavigationActions } from 'react-navigation';
import { login, logout, register } from './NavActions';

import AppNavigator from './AppNavigator';

const firstAction = AppNavigator.router.getActionForPathAndParams('SplashScreen');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const initialNavState = AppNavigator.router.getStateForAction(tempNavState);

const resetTo = (routeName) => NavigationActions.reset({
  index: 0,
  key: null,
  actions: [ NavigationActions.navigate({ routeName }) ]
});

const formatActions = (actions) => {
  const actionsArray = [];
  if(_.isArray(actions)) {
    actions.forEach(action => {
      let routeName, params;
      if(_.isString(action)) {
        routeName = action;
      } else {
        routeName = action.routeName;
        params = action.params;
      }
      actionsArray.push(NavigationActions.navigate({ routeName, params }));
    });
  } else {
    const { routeName, params } = actions;
    actionsArray.push(NavigationActions.navigate({ routeName, params }));
  }
  console.log(actionsArray);
  return actionsArray;
};

export const nav = (state = initialNavState, action) => {
  let nextState;
  const { payload } = action;
  switch (action.type) {
    case `${login}`:
    case `${register}`:
      nextState = AppNavigator.router.getStateForAction(resetTo('AppScreen'), state);
      break;
    case `${logout}`:
      nextState = AppNavigator.router.getStateForAction(resetTo('AuthScreen'), state);
      break;
    case 'Nav/to':
      if(payload) {
        let routeName, params;
        if (_.isString(payload)) {
          routeName = payload;
        } else {
          routeName = payload.routeName;
          params = payload.props || payload.params;
        }
        nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName, params }), state);
      }
      break;
    case 'Nav/back':
      nextState = AppNavigator.router.getStateForAction(NavigationActions.back({ key: payload }), state);
      break;
    case 'Nav/set_params':
      nextState = AppNavigator.router.getStateForAction(NavigationActions.setParams(payload), state);
      break;
    case 'Nav/reset':
      if(payload) {
        let routeName, params, key;
        if (_.isString(payload)) {
          routeName = payload;
        } else {
          routeName = payload.routeName;
          params = payload.props || payload.params;
          key = payload.key
        }
        const actions = formatActions(payload.actions || { routeName, params }) ;
        nextState = AppNavigator.router.getStateForAction(NavigationActions.reset({
          index: actions.length - 1,
          key,
          actions
        }), state);
      }
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};

export default nav;