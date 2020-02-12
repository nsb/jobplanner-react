// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { denormalize } from "normalizr";
import { injectIntl, intlShape } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import { jobSchemaDenormalize } from "../schemas";
import Article from "grommet/components/Article";
import JobForm, { invoicingReminderMap } from "./JobForm";
import { AuthContext } from "../providers/authProvider";
import { updateJob } from "../actions/jobs";
import type { State as ReduxState } from "../types/State";
import type { State as ClientsState } from "../reducers/clients";
import type { Dispatch } from "../types/Store";
import type { Business } from "../actions/businesses";
import type { Property } from "../actions/properties";
import type { Job } from "../actions/jobs";
import type { Employee } from "../actions/employees";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  business: Business,
  property: Property,
  clients: ClientsState,
  job: Job,
  push: string => void,
  employees: Array<Employee>,
  assigned: Array<Employee>,
  isFetching: boolean,
  updateJob: Function,
  history: { push: string => void }
};

class JobEdit extends Component<Props & { intl: intlShape }> {
  static contextType = AuthContext;

  render() {
    const {
      job,
      employees,
      assigned,
      business,
      property,
      intl,
      isFetching
    } = this.props;

    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>
        <JobForm
          business={business}
          onSubmit={this.handleSubmit}
          onClose={this.onClose}
          employees={employees}
          isFetching={isFetching}
          initialValues={{
            ...job,
            client: {
              label: `${job.client_firstname} ${job.client_lastname}`,
              value: job.client
            },
            property: {
              label: `${property.address1}`,
              value: property
            },
            assigned: assigned.map(employee => {
              return { value: employee.id, label: [employee.first_name, employee.last_name].join(' ') };
            }),
            invoice_reminder: {
              value: job.invoice_reminder,
              label: intl.formatMessage({
                id: invoicingReminderMap[job.invoice_reminder]
              })
            }
          }}
        />
      </Article>
    );
  }

  handleSubmit = values => {
    const { business, intl, updateJob, job, history } = this.props;

    const { getUser } = this.context;
    getUser()
      .then(({ access_token }) => {
        return updateJob(
          {
            ...values,
            business: business.id,
            property: job.property,
            assigned: values.assigned.map(v => v.value),
            invoice_reminder: values.invoice_reminder.value
          },
          access_token
        );
      })
      .then((responseJob: Job) => {
        addSuccess({ text: intl.formatMessage({ id: "flash.saved" }) });
        history.push(`/${business.id}/jobs/${responseJob.id}`);
      })
      .catch(() => {
        addError({ text: intl.formatMessage({ id: "flash.error" }) });
      });
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
    fetchClients: (string, Object) => Promise<any>,
    updateJob: (Business, Object, string) => Promise<any>
  }
): Props => {
  const { clients, employees, entities, jobs } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const jobId = parseInt(ownProps.match.params.jobId, 10);
  const job = ensureState(entities).jobs[jobId];

  return {
    business: ensureState(entities).businesses[businessId],
    property: ensureState(entities).properties[job.property],
    push: ownProps.history.push,
    employees: employees.result
      .map((Id: number) => {
        return ensureState(entities).employees[Id];
      })
      .filter(employee => employee.business === businessId),
    assigned: job.assigned.map((Id: number) => {
      return ensureState(entities).employees[Id];
    }),
    clients,
    job: denormalize(
      ensureState(entities).jobs[jobId],
      jobSchemaDenormalize,
      ensureState(entities)
    ),
    isFetching: jobs.isFetching,
    updateJob: ownProps.updateJob,
    history: ownProps.history
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      updateJob
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(JobEdit))
);
