import React from 'react';
import { connect } from 'react-redux';
import { init } from './AppActions';

import AppWithNavigationState from '../Nav/Nav';

const mapStateToProps = (state) => ({

});

const bindDispatchToProps = {
  init
};

class App extends React.Component {

  componentDidMount() {
    this.props.init();
  }

  render() {
    return <AppWithNavigationState />;
  }
}

App = connect(mapStateToProps, bindDispatchToProps)(App);

export default App;