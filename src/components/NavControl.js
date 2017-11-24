// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import Button from 'grommet/components/Button';
import {navToggle} from '../actions/nav';
import logo from '../logo.svg';
import type {State} from '../types/State';
import type {Dispatch} from '../types/Store';

type Props = {
  nav: {active: boolean},
  dispatch: Dispatch,
}

class NavControl extends Component<Props> {
  render() {
    const {nav: {active}, dispatch} = this.props;

    let result;
    if (!active) {
      result = (
        <Button onClick={() => dispatch(navToggle())}>
          <img
            src={logo}
            className="App-logo"
            alt="logo"
            style={{height: '40px'}}
          />
        </Button>
      );
    } else {
      result = null;
    }
    return result;
  }
}

let select = (state: State) => ({
  nav: state.nav,
});

export default connect(select)(NavControl);
