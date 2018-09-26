// @flow

import React, { Component } from "react";
import moment from "moment";
import "moment/locale/da";
import { Switch, Route } from "react-router-dom";
import JobList from "../components/JobListRouterContainer";
import JobsAdd from "../components/JobsAdd";
import JobDetailContainer from "../components/JobDetailContainer";
import JobEdit from "../components/JobEdit";

const language =
  (navigator.languages && navigator.languages[0]) || navigator.language;

// configure moment locale, with Monday as 1st day of week
moment.locale(language, {
  week: {
    dow: 1,
    doy: 1
  }
});

class Jobs extends Component<*> {
  render() {
    return (
      <Switch>
        <Route exact path="/:businessId/jobs/add" component={JobsAdd} />
        <Route
          exact
          path="/:businessId/jobs/:jobId"
          component={JobDetailContainer}
        />
        <Route exact path="/:businessId/jobs/:jobId/edit" component={JobEdit} />
        <Route component={JobList} />
      </Switch>
    );
  }
}

export default Jobs;
