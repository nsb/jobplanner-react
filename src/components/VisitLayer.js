// @flow

import React, { Component } from "react";
import Layer from "grommet/components/Layer";
import VisitDetail from "./VisitDetail";
import VisitEdit from "./VisitEdit";
import type { Visit } from "../actions/visits";
import type { Property } from "../actions/properties";
import type { LineItem } from "../actions/lineitems";

export type Props = {
  visit: Visit,
  property: Property,
  dispatch: Dispatch,
  assigned: Array<Object>,
  lineItems: Array<LineItem>,
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
    const { visit, property, assigned, lineItems, onClose } = this.props;

    const visitView = this.state.edit
      ? <VisitEdit visit={visit} />
      : <VisitDetail
          visit={visit}
          property={property}
          assigned={assigned}
          lineItems={lineItems}
          onEdit={this.onEdit}
        />;

    return (
      <Layer align="right" closer={true} onClose={onClose}>
        {visitView}
      </Layer>
    );
  }

  onEdit = () => {
    this.setState({ edit: true });
  };
}

export default VisitLayer;
