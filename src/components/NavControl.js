// @flow

import React, {Component} from 'react';
import { bindActionCreators } from "redux";
import {connect} from 'react-redux';
import Button from 'grommet/components/Button';
import {navToggle} from '../actions/nav';
import logo from '../logo.svg';
import type {State} from '../types/State';
import type { Dispatch, ThunkAction } from '../types/Store'

type Props = {
  nav: {active: boolean},
  navToggle: () => ThunkAction
}

class NavControl extends Component<Props> {
  render() {
    const {nav: {active}} = this.props;

    let result;
    if (!active) {
      result = (
        <Button onClick={() => navToggle()}>
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

const mapStateToProps = (state: State) => ({
  nav: state.nav,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      navToggle
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(NavControl);
