// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl, intlShape } from 'react-intl';
import { Provider } from "react-redux";
import Layer from "grommet/components/Layer";
import store from "../store";
import CalendarSyncList from "./SettingsCalendarSyncList";
import type { Business } from "../actions/businesses";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";

type Props = {
  business: Business,
  onClose: Function,
  dispatch: Dispatch
};

class CalendarSyncEdit extends Component<Props & { intl: intlShape }> {
  render() {
    const { business, onClose } = this.props;
    return (
      <Layer align="right" closer={true} onClose={onClose}>
        <Provider store={store}>
          <CalendarSyncList business={business} />
        </Provider>
      </Layer>
    );
  }
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    history: { push: string => void },
    business: Business,
    dispatch: Dispatch
  }
): * => ({
  push: ownProps.history.push,
  business: ownProps.business,
  dispatch: ownProps.dispatch
});

export default connect(mapStateToProps)(injectIntl(CalendarSyncEdit));
