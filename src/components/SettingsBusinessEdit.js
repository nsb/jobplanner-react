// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { updateBusiness } from "../actions/businesses";
import Layer from "grommet/components/Layer";
import BusinessForm from "./SettingsBusinessForm";
import type { Business } from "../actions/businesses";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";

type Props = {
  business: Business,
  onClose: Function,
  dispatch: Dispatch,
  token: string
};

class BusinessEdit extends Component<Props> {
  render() {
    const { business, onClose } = this.props;
    return (
      <Layer align="right" closer={true} onClose={onClose}>
        <BusinessForm
          onSubmit={this.handleSubmit}
          onClose={onClose}
          initialValues={business}
        />
      </Layer>
    );
  }

  handleSubmit = (business: Business) => {
    const { token, dispatch, onClose } = this.props;
    if (token) {
      dispatch(updateBusiness(business, token));
      onClose();
    }
  };
}

const mapStateToProps = (
  { auth }: ReduxState,
  ownProps: {
    business: Business,
    onClose: Function,
    dispatch: Dispatch
  }
): Props => ({
  token: auth.token,
  business: ownProps.business,
  onClose: ownProps.onClose,
  dispatch: ownProps.dispatch
});

export default connect(mapStateToProps)(BusinessEdit);
