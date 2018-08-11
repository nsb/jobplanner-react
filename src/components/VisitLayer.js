// @flow

import React, { Component } from "react";
import Layer from "grommet/components/Layer";
import VisitDetailContainer from "./VisitDetailContainer";
import VisitEdit from "./VisitEdit";
import VisitRemove from "./VisitRemove";
import type { Visit } from "../actions/visits";

export type Props = {
  token: ?string,
  visit: Visit,
  onClose: Function
};

type State = {
  view: ?string
};

class VisitLayer extends Component<Props, State> {
  state = {
    view: undefined
  };

  render() {
    const { visit, onClose, token } = this.props;

    const visitView = (view => {
      switch (view) {
        case "delete":
          return <VisitRemove visit={visit} onClose={this.onRemoveClose} onRemove={onClose} token={token} />;
        case "edit":
          return <VisitEdit visit={visit} toggleEdit={this.toggleEdit} />;
        default:
          return (
            <VisitDetailContainer
              visit={visit}
              onEdit={this.toggleEdit}
              onDelete={this.toggleDelete}
            />
          );
      }
    })(this.state.view);

    return (
      <Layer align="right" closer={true} onClose={onClose}>
        {visitView}
      </Layer>
    );
  }

  toggleEdit = () => {
    this.setState({ view: this.state.view ? undefined : "edit" });
  };

  toggleDelete = () => {
    this.setState({ view: this.state.view ? undefined : "delete" });
  };

  onRemoveClose = () => {
    this.setState({ view: undefined })
  }
}

export default VisitLayer;
