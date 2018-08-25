// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "grommet/components/Button";
import Title from "grommet/components/Title";
import { navToggle } from "../actions/nav";
import logo from "../logo.svg";
import type { State } from "../types/State";
import type { Dispatch } from "../types/Store";

type Props = {
  title?: any,
  nav: { active: boolean },
  dispatch: Dispatch
};

class NavControl extends Component<Props> {
  render() {
    const {
      nav: { active },
      dispatch,
      title
    } = this.props;

    let button;
    if (!active) {
      button = (
        <Button onClick={() => dispatch(navToggle())}>
          <img
            src={logo}
            className="App-logo"
            alt="logo"
            style={{ height: "40px" }}
          />
        </Button>
      );
    } else {
      button = null;
    }

    let result;
    if (!active && title) {
      result = (
        <Title responsive={false}>
          {button}
          {title}
        </Title>
      );
    } else {
      result = button;
    }

    return result;
  }
}

let select = (state: State): * => ({
  nav: state.nav
});

export default connect(select)(NavControl);
