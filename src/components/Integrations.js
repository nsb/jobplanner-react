// @flow

import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import IntegrationList from "../components/IntegrationList";

class Integrations extends Component<*> {
  render() {
    return (
      <Switch>
        <Route component={IntegrationList} />
      </Switch>
    );
  }
}

export default Integrations;
