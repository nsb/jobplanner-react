// @flow

import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import JobList from '../components/JobList';
import JobsAdd from '../components/JobsAdd';
import JobDetail from '../components/JobDetail';
import JobEdit from '../components/JobEdit';

class Jobs extends Component {

  render() {

    return (
      <Switch>
        <Route exact path="/:businessId/jobs/add" component={JobsAdd} />
        <Route exact path="/:businessId/jobs/:jobId" component={JobDetail} />
        <Route exact path="/:businessId/jobs/:jobId/edit" component={JobEdit} />
        <Route component={JobList} />
      </Switch>
    );
  }
}

export default Jobs;
