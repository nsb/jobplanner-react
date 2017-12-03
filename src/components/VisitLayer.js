// @flow

import React, { Component } from "react";
import Layer from "grommet/components/Layer";
import VisitDetailContainer from "./VisitDetailContainer";
import VisitEdit from "./VisitEdit";
import type { Visit } from "../actions/visits";

export type Props = {
  visit: Visit,
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

    const visitView = this.state.edit ? (
      <VisitEdit visit={visit} toggleEdit={this.toggleEdit} />
    ) : (
      <VisitDetailContainer visit={visit} onEdit={this.toggleEdit} />
    );

    return (
      <Layer align="right" closer={true} onClose={onClose}>
        {visitView}
      </Layer>
    );
  }

  toggleEdit = () => {
    this.setState({ edit: !this.state.edit });
  };
}

export default VisitLayer;
