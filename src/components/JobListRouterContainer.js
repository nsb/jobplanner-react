// @flow

import React, { Component } from "react";
import JobList from "./JobList";

type Props = {
  match: { params: { businessId: number } },
  history: { push: string => void }
};

class JobListRouterContainer extends Component<Props, void> {
  render() {
    const businessId = parseInt(this.props.match.params.businessId, 10);
    return <JobList businessId={businessId} push={this.props.history.push} />;
  }
}

export default JobListRouterContainer;
