// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import { injectIntl, intlShape } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import history from "../history";
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
  employees: Array<Employee>,
  assigned: Array<Employee>,
  isFetching: boolean,
  updateJob: Function
};

class JobEdit extends Component<Props & { intl: intlShape }> {
  render() {
    const {
      job,
      employees,
      assigned,
      business,
      intl,
      isFetching,
      token
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
            assigned: assigned.map(employee => {
              return { value: employee.id, label: employee.username };
            }),
            invoice_reminder: {
              value: job.invoice_reminder,
              label: intl.formatMessage({
                id: invoicingReminderMap[job.invoice_reminder]
              })
            }
          }}
          token={token}
        />
      </Article>
    );
  }

  handleSubmit = values => {
    const { token, business, intl, updateJob, job } = this.props;
    updateJob(
      {
        ...values,
        business: business.id,
        property: job.property,
        assigned: values.assigned.map(v => v.value),
        invoice_reminder: values.invoice_reminder.value
      },
      token || ""
    )
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
  const { auth, clients, employees, entities, jobs } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const jobId = parseInt(ownProps.match.params.jobId, 10);
  const job = ensureState(entities).jobs[jobId];

  return {
    token: auth.token,
    business: ensureState(entities).businesses[businessId],
    push: ownProps.history.push,
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
    ),
    isFetching: jobs.isFetching,
    updateJob: ownProps.updateJob
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      updateJob
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(JobEdit));
