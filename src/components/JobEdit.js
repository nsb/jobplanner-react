// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import Article from "grommet/components/Article";
import JobForm from "./JobForm";
import { updateJob } from "../actions/jobs";
import type { State } from "../types/State";
import type { State as ClientsState } from "../reducers/clients";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { State as EntitiesState } from '../reducers/entities';

class JobEdit extends Component {
  props: {
    token?: string,
    business: Business,
    clients: ClientsState,
    entities: EntitiesState,
    job: Job,
    push: string => void,
    dispatch: Dispatch
  };

  render() {
    const { clients, entities, job } = this.props;
    const client = entities.clients[job.client];
    const clientList = clients.result.map(Id => {
      return entities.clients[Id];
    });

    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>

        <JobForm
          onSubmit={this.handleSubmit}
          onClose={this.onClose}
          clients={clientList}
          initialValues={{
            ...job,
            client: { label: client.first_name, value: client.id }
          }}
        />

      </Article>
    );
  }

  handleSubmit = values => {
    // get client Id
    const { client: { value: clientId } } = values;

    const { token, business, dispatch } = this.props;
    dispatch(updateJob(
      {
        ...values,
        business: business.id,
        client: clientId
      },
      token || ""
    ));
  };

  onClose = () => {
    const { business, job, push } = this.props;
    push(`/${business.id}/jobs/${job.id}`);
  };
}

const mapStateToProps = (
  state: State,
  ownProps: {
    match: { params: { businessId: number, jobId: number } },
    history: { push: string => void },
    dispatch: Dispatch
  }
) => {
  const { auth, clients, entities } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const jobId = parseInt(ownProps.match.params.jobId, 10);

  return {
    token: auth.token,
    business: entities.businesses[businessId],
    job: entities.jobs[jobId],
    push: ownProps.history.push,
    dispatch: ownProps.dispatch,
    clients,
    entities
  };
};

export default connect(mapStateToProps)(JobEdit);
