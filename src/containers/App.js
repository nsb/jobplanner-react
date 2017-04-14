// @flow
import React, { Component } from 'react';
import AppGrommet from 'grommet/components/App'
import './App.css';

type Props = {
  children: [Component<void, Props, void>]
}

class App extends Component<void, Props, void> {

  render() {

    return (
      <AppGrommet centered={false}>
        {this.props.children}
      </AppGrommet>
    )
  }
}

export default App
