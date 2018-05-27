// @flow

import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import VisitsReportContainer from "./VisitsReportContainer";

class Reports extends Component<*> {
  render() {
    return (
      <Switch>
        <Route component={VisitsReportContainer} />
      </Switch>
    );
  }
}

export default Reports;
