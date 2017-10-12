// @flow

import React, { Component } from "react";
import VisitForm from "./VisitForm";
import type { Visit } from "../actions/visits";

export type Props = {
  visit: Visit,
};

class VisitEdit extends Component<Props> {

  render() {
    const { visit } = this.props;

    return (
      <VisitForm
        onSubmit={this.handleSubmit}
        initialValues={visit}
      />
    );
  }

  handleSubmit = () => {
    console.log("handleSubmit");
  }
}

export default VisitEdit;
