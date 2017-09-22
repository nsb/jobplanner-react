// @flow

import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import SettingsEdit from "./SettingsEdit";

class Settings extends Component<*> {
  render() {
    return (
      <Switch>
        <Route component={SettingsEdit} />
      </Switch>
    );
  }
}

export default Settings;
