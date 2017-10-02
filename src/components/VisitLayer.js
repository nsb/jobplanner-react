// @flow

import React, { Component } from "react";
import type { Visit } from "../actions/visits";
import Layer from "grommet/components/Layer";
import VisitDetail from "./VisitDetail";

type Props = {
  visit: Visit,
  dispatch: Dispatch,
  onClose: Function
};

type State = {
  edit: boolean
};

class VisitLayer extends Component<Props, State> {
  state = {
    edit: false
  };

  render() {
    const { visit, onClose } = this.props;

    return (
      <Layer align="right" closer={true} onClose={onClose}>
        <VisitDetail visit={visit} />
      </Layer>
    );
  }
}

export default VisitLayer;
