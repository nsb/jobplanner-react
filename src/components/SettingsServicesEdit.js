// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import Layer from "grommet/components/Layer";
import type { Business } from "../actions/businesses";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";

type Props = {
  business: Business,
  onClose: Function,
  dispatch: Dispatch,
  token: string
};

class ServicesEdit extends Component<Props> {
  render() {
    const { onClose } = this.props;
    return (
      <Layer align="right" closer={true} onClose={onClose}>
      </Layer>
    );
  }
}

const mapStateToProps = (
  { auth }: ReduxState,
  ownProps: {
    history: { push: string => void },
    business: Business,
    dispatch: Dispatch
  }
) => ({
  token: auth.token,
  push: ownProps.history.push,
  business: ownProps.business,
  dispatch: ownProps.dispatch
});

export default connect(mapStateToProps)(ServicesEdit);
