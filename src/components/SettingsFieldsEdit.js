// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import Layer from "grommet/components/Layer";
import type { Business } from "../actions/businesses";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import FieldList from "./SettingsFieldList";

type Props = {
  business: Business,
  onClose: Function,
  dispatch: Dispatch,
};

class FieldsEdit extends Component<Props> {
  render() {
    const { onClose, business, dispatch } = this.props;
    return (
      <Layer align="right" closer={true} onClose={onClose}>
        <FieldList business={business} dispatch={dispatch} />
      </Layer>
    );
  }
}

const mapStateToProps = (
  { auth }: ReduxState,
  ownProps: {
    business: Business,
    dispatch: Dispatch,
    onClose: Function
  }
): Props => ({
  business: ownProps.business,
  dispatch: ownProps.dispatch,
  onClose: ownProps.onClose
});

export default connect(mapStateToProps)(FieldsEdit);
