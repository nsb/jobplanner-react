// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { updateBusiness } from "../actions/businesses";
import EmailsForm from "./SettingsEmailsForm";
import { AuthContext } from "../providers/authProvider";
import type { Business } from "../actions/businesses";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";

type Props = {
  business: Business,
  onClose: Function,
  dispatch: Dispatch
};

class EmailsEdit extends Component<Props> {
  render() {
    const { business, onClose } = this.props;
    return (
      <EmailsForm
        onSubmit={this.handleSubmit}
        onClose={onClose}
        initialValues={business}
      />
    );
  }

  handleSubmit = (business: Business) => {
    const { dispatch, onClose } = this.props;
    const { getUser } = this.context;
    getUser().then(({ access_token }) => {
      dispatch(updateBusiness(business, access_token));
      onClose();
    });
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    business: Business,
    dispatch: Dispatch
  }
): * => ({
  business: ownProps.business,
  dispatch: ownProps.dispatch
});

export default connect(mapStateToProps)(EmailsEdit);
