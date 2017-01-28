import React, { Component } from 'react';
import AppGrommet from 'grommet/components/App'
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
