// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import Layer from "grommet/components/Layer";
import EmailsList from "./SettingsEmailsList";
import type { Business } from "../actions/businesses";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";

type Props = {
  dispatch: Dispatch,
  business: Business,
  onClose: Function,
  token: string
};

class EmailsEdit extends Component<Props> {
  render() {
    const { onClose, business, dispatch } = this.props;
    return (
      <Layer align="right" closer={true} onClose={onClose}>
        <EmailsList business={business} dispatch={dispatch} onClose={onClose} />
      </Layer>
    );
  }
}

const mapStateToProps = (
  { auth }: ReduxState,
  ownProps: {
    dispatch: Dispatch,
    business: Business,
    onClose: Function
  }
): Props => ({
  token: auth.token,
  business: ownProps.business,
  onClose: ownProps.onClose,
  dispatch: ownProps.dispatch
});

export default connect(mapStateToProps)(EmailsEdit);
