import React, { Component } from 'react';
import { Split } from 'grommet'
import NavSidebar from '../components/NavSidebar'

class AppAuthenticated extends Component {

  render() {

    return (
        <Split priority={"left"} flex="right">
          {<NavSidebar />}
          {this.props.children}
        </Split>
    );
  }
}

export default AppAuthenticated
