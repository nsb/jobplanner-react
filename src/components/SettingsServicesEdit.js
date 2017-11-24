// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import Layer from "grommet/components/Layer";
import type { Business } from "../actions/businesses";
import type { State as ReduxState } from "../types/State";
import ServiceList from "./SettingsServiceList";

type Props = {
  business: Business,
  onClose: Function,
  token: string
};

class ServicesEdit extends Component<Props> {
  render() {
    const { onClose, business } = this.props;
    return (
      <Layer align="right" closer={true} onClose={onClose}>
        <ServiceList business={business} />
      </Layer>
    );
  }
}

const mapStateToProps = (
  { auth }: ReduxState,
  ownProps: {
    business: Business,
    onClose: Function
  }
): Props => ({
  token: auth.token,
  business: ownProps.business,
  onClose: ownProps.onClose
});

export default connect(mapStateToProps)(ServicesEdit);
