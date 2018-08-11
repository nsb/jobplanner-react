// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import { jobSchemaDenormalize } from "../schemas";
import Article from "grommet/components/Article";
import JobForm, { invoicingReminderMap } from "./JobForm";
import { updateJob } from "../actions/jobs";
import type { State as ReduxState } from "../types/State";
import type { State as ClientsState } from "../reducers/clients";
import type { Dispatch } from "../types/Store";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { Employee } from "../actions/employees";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  token: ?string,
  business: Business,
  clients: ClientsState,
  job: Job,
  push: string => void,
  dispatch: Dispatch,
  employees: Array<Employee>,
  assigned: Array<Employee>
};

class JobEdit extends Component<Props> {
  render() {
    const { job, employees, assigned } = this.props;

    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>
        <JobForm
          onSubmit={this.handleSubmit}
          onClose={this.onClose}
          employees={employees}
          initialValues={{
            ...job,
            client: {
              label: `${job.client_firstname} ${job.client_lastname}`,
              value: job.client
            },
            assigned: assigned.map(employee => {
              return { value: employee.id, label: employee.username };
            }),
            invoice_reminder: {
              value: job.invoice_reminder,
              label: invoicingReminderMap[job.invoice_reminder]
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
          client: clientId,
          assigned: values.assigned.map(v => v.value),
          invoice_reminder: values.invoice_reminder.value
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
  const { auth, clients, employees, entities } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const jobId = parseInt(ownProps.match.params.jobId, 10);
  const job = ensureState(entities).jobs[jobId];

  return {
    token: auth.token,
    business: ensureState(entities).businesses[businessId],
    push: ownProps.history.push,
    dispatch: ownProps.dispatch,
    employees: employees.result
      .map((Id: number) => {
        return ensureState(entities).employees[Id];
      })
      .filter(employee => {
        return employee.businesses.indexOf(businessId) > -1 ? employee : false;
      }),
    assigned: job.assigned.map((Id: number) => {
      return ensureState(entities).employees[Id];
    }),
    clients,
    job: denormalize(
      ensureState(entities).jobs[jobId],
      jobSchemaDenormalize,
      ensureState(entities)
    )
  };
};

export default connect(mapStateToProps)(JobEdit);
