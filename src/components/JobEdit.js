// @flow

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Article from 'grommet/components/Article';
import JobForm from './JobForm';
import {updateJob} from '../actions/jobs';
import {push as pushActionCreator} from 'react-router-redux';
import type {State} from '../types/State';
import type {Business} from '../actions/businesses';
import type {Job} from '../actions/jobs';

class JobEdit extends Component {
  props: {
    token?: string,
    business: Business,
    clients: Object,
    job: Job,
    push: typeof pushActionCreator,
  };

  render() {
    const {clients, job} = this.props;
    const client = clients.entities.clients[job.client];
    const clientList = clients.result.map(Id => {
      return clients.entities.clients[Id];
    });

    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>

        <JobForm
          onSubmit={this.handleSubmit}
          onClose={this.onClose}
          clients={clientList}
          initialValues={{
            ...job,
            client: {label: client.first_name, value: client.id},
          }}
        />

      </Article>
    );
  }

  handleSubmit = values => {
    // get client Id
    const {client: {value: clientId}} = values;

    const {token, business} = this.props;
    updateJob(
      {
        ...values,
        business: business.id,
        client: clientId,
      },
      token || ''
    );
  };

  onClose = () => {
    const {business, push} = this.props;
    push(`/${business.id}/jobs`);
  };
}

const mapStateToProps = (
  state: State,
  ownProps: {params: {businessId: number, jobId: number}}
) => {
  const {auth, businesses, clients, jobs} = state;
  const businessId = parseInt(ownProps.params.businessId, 10);
  const jobId = parseInt(ownProps.params.jobId, 10);

  return {
    token: auth.token,
    business: businesses.entities.businesses[businessId],
    job: jobs.entities.jobs[jobId],
    clients,
  };
};

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators(
    {
      push: pushActionCreator,
      updateJob,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(JobEdit);
