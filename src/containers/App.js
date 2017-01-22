import React, { Component } from 'react';
import { App as AppGrommet } from 'grommet'
import './App.css';

class App extends Component {

  render() {

    return (
      <AppGrommet centered={false}>
        {this.props.children}
      </AppGrommet>
    )
  }
}

export default App
