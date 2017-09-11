// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import Article from "grommet/components/Article";
import JobForm from "./JobForm";
import { updateJob } from "../actions/jobs";
import type { State as ReduxState } from "../types/State";
import type { State as ClientsState } from "../reducers/clients";
import type { Dispatch } from "../types/Store";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { State as EntitiesState } from "../reducers/entities";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  token?: string,
  business: Business,
  clients: ClientsState,
  entities: EntitiesState,
  job: Job,
  push: string => void,
  dispatch: Dispatch
};

class JobEdit extends Component<Props> {
  render() {
    const { job } = this.props;

    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>

        <JobForm
          onSubmit={this.handleSubmit}
          onClose={this.onClose}
          initialValues={{
            ...job,
            client: {
              label: `${job.client_firstname} ${job.client_lastname}`,
              value: job.client
            }
          }}
        />

      </Article>
    );
  }

  handleSubmit = values => {
    // get client Id
    const { client: { value: clientId } } = values;

    const { token, business, dispatch } = this.props;
    dispatch(
      updateJob(
        {
          ...values,
          business: business.id,
          client: clientId
        },
        token || ""
      )
    );
  };

  onClose = () => {
    const { business, job, push } = this.props;
    push(`/${business.id}/jobs/${job.id}`);
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number, jobId: number } },
    history: { push: string => void },
    dispatch: Dispatch
  }
): Props => {
  const { auth, clients, entities } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const jobId = parseInt(ownProps.match.params.jobId, 10);

  return {
    token: auth.token,
    business: ensureState(entities).businesses[businessId],
    job: ensureState(entities).jobs[jobId],
    push: ownProps.history.push,
    dispatch: ownProps.dispatch,
    clients,
    entities: ensureState(entities)
  };
};

export default connect(mapStateToProps)(JobEdit);
