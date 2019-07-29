// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl, intlShape } from 'react-intl';
import { Provider } from "react-redux";
import { addSuccess, addError } from "redux-flash-messages";
import { updateBusiness } from "../actions/businesses";
import Layer from "grommet/components/Layer";
import store from "../store";
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

class BusinessEdit extends Component<Props & { intl: intlShape }> {
  render() {
    const { business, onClose } = this.props;
    return (
      <Layer align="right" closer={true} onClose={onClose}>
        <Provider store={store}>
          <BusinessForm
            onSubmit={this.handleSubmit}
            onClose={onClose}
            initialValues={business}
          />
        </Provider>
      </Layer>
    );
  }

  handleSubmit = (business: Business) => {
    const { token, dispatch, onClose, intl } = this.props;
    if (token) {
      dispatch(updateBusiness(business, token)).then(() => {
        addSuccess({text: intl.formatMessage({id: "flash.saved"})})
      }).catch(() => {
        addError({text: intl.formatMessage({id: "flash.error"})})
      }).finally(onClose);
    }
  };
}

const mapStateToProps = (
  { auth }: ReduxState,
  ownProps: {
    history: { push: string => void },
    business: Business,
    dispatch: Dispatch
  }
): * => ({
  token: auth.token,
  push: ownProps.history.push,
  business: ownProps.business,
  dispatch: ownProps.dispatch
});

export default connect(mapStateToProps)(injectIntl(BusinessEdit));
