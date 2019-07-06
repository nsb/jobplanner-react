// @flow

import React, { Component } from "react";
import Layer from "grommet/components/Layer";
import VisitDetailContainer from "./VisitDetailContainer";
import VisitEdit from "./VisitEdit";
import VisitUpdateFutureVisits from "./VisitUpdateFutureVisits";
import VisitRemove from "./VisitRemove";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";

export type Props = {
  token: ?string,
  visit: Visit,
  job: ?Job,
  onClose: Function
};

type State = {
  view: ?"edit" | "updateFutureVisits" | "delete"
};

class VisitLayer extends Component<Props, State> {
  state = {
    view: undefined
  };

  render() {
    const { visit, job, onClose, token } = this.props;

    const visitView = (view => {
      switch (view) {
        case "delete":
          return <VisitRemove visit={visit} onClose={this.onRemoveClose} onRemove={onClose} token={token} />;
        case "edit":
          return <VisitEdit visit={visit} onClose={onClose} toggleEdit={this.toggleEdit} />;
        case "updateFutureVisits":
          return <VisitUpdateFutureVisits visit={visit} job={job} onClose={onClose} token={token} />
        default:
          return (
            <VisitDetailContainer
              visit={visit}
              job={job}
              onEdit={this.toggleEdit}
              onUpdateFutureVisits={this.toggleUpdateFutureVisits}
              onDelete={this.toggleDelete}
              onClose={onClose}
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

  toggleUpdateFutureVisits = () => {
    this.setState({ view: this.state.view ? undefined : "updateFutureVisits" });
  }

  toggleDelete = () => {
    this.setState({ view: this.state.view ? undefined : "delete" });
  };

  onRemoveClose = () => {
    this.setState({ view: undefined })
  }
}

export default VisitLayer;
