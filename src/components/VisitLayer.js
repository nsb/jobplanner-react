// @flow

import React, { Component } from "react";
import Layer from "grommet/components/Layer";
import VisitDetail from "./VisitDetail";
import type { Visit } from "../actions/visits";
import type { Property } from "../actions/properties";

export type Props = {
  visit: Visit,
  property: Property,
  dispatch: Dispatch,
  assigned: Array<Object>,
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
    const { visit, property, assigned, onClose } = this.props;

    return (
      <Layer align="right" closer={true} onClose={onClose}>
        <VisitDetail visit={visit} property={property} assigned={assigned} />
      </Layer>
    );
  }
}

export default VisitLayer;
