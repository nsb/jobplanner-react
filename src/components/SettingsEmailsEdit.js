// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { Provider } from "react-redux";
import { AuthProvider } from "../providers/authProvider";
import Layer from "grommet/components/Layer";
import store from "../store";
import EmailsList from "./SettingsEmailsList";
import type { Business } from "../actions/businesses";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";

type Props = {
  dispatch: Dispatch,
  business: Business,
  onClose: Function,
};

class EmailsEdit extends Component<Props> {
  render() {
    const { onClose, business, dispatch } = this.props;
    return (
      <Layer align="right" closer={true} onClose={onClose}>
        <Provider store={store}>
          <AuthProvider>
            <EmailsList business={business} dispatch={dispatch} onClose={onClose} />
          </AuthProvider>
        </Provider>
      </Layer>
    );
  }
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    dispatch: Dispatch,
    business: Business,
    onClose: Function
  }
): Props => ({
  business: ownProps.business,
  onClose: ownProps.onClose,
  dispatch: ownProps.dispatch
});

export default connect(mapStateToProps)(EmailsEdit);
