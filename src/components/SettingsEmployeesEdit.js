// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { Provider } from "react-intl-redux";
import Layer from "grommet/components/Layer";
import store from "../store";
import type { Business } from "../actions/businesses";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import EmployeeList from "./SettingsEmployeeList";

type Props = {
  business: Business,
  onClose: Function,
  dispatch: Dispatch,
};

class EmployeesEdit extends Component<Props> {
  render() {
    const { onClose, business } = this.props;
    return (
      <Layer align="right" closer={true} onClose={onClose}>
        <Provider store={store}>
          <EmployeeList business={business} />
        </Provider>
      </Layer>
    );
  }
}

const mapStateToProps = (
  { auth }: ReduxState,
  ownProps: {
    history: { push: string => void },
    business: Business,
    dispatch: Dispatch,
    onClose: Function
  }
): Props => ({
  push: ownProps.history.push,
  business: ownProps.business,
  dispatch: ownProps.dispatch,
  onClose: ownProps.onClose
});

export default connect(mapStateToProps)(EmployeesEdit);
