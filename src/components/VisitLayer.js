// @flow

import React, { Component } from "react";
import { Provider } from "react-redux";
import Layer from "grommet/components/Layer";
import VisitDetailContainer from "./VisitDetailContainer";
import VisitEdit from "./VisitEdit";
import VisitUpdateFutureVisits from "./VisitUpdateFutureVisits";
import VisitRemove from "./VisitRemove";
import store from "../store";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";

export type Props = {
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
    const { visit, job, onClose } = this.props;

    const visitView = (view => {
      switch (view) {
        case "delete":
          return <VisitRemove visit={visit} onClose={this.onRemoveClose} onRemove={onClose} />;
        case "edit":
          return <VisitEdit visit={visit} onClose={onClose} toggleEdit={this.toggleEdit} />;
        case "updateFutureVisits":
          return <VisitUpdateFutureVisits visit={visit} job={job} onClose={onClose} />
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
        <Provider store={store}>
          {visitView}
        </Provider>
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
