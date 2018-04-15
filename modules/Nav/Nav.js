import React from 'react';
import _ from 'lodash';
import { diff } from 'deep-diff';
import { BackHandler } from 'react-native';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createReactNavigationReduxMiddleware, createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import AppNavigator from './AppNavigator';

export const navMiddleware = createReactNavigationReduxMiddleware( "root", state => state.nav );

const addListener = createReduxBoundAddListener("root");

class AppWithNavigationState extends React.Component {

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }
  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if(AppNavigator.router.getStateForAction(NavigationActions.back(), nav) === nav) {
      console.groupCollapsed('The app went `background`.');
      console.info("Don't forget to use singleTop and moveTaskToBack(true) - https://github.com/facebook/react-native/issues/13775");
      console.groupEnd();
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    const { dispatch, nav } = this.props;
    return (
      <AppNavigator navigation={addNavigationHelpers({dispatch, state: nav, addListener})}/>
    );
  }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
