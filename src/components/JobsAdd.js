// @flow
import "url-search-params-polyfill";
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { injectIntl, intlShape } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import Article from "grommet/components/Article";
import JobForm, { oneoffInvoicingReminderMap } from "./JobForm";
import { AuthContext } from "../providers/authProvider";
import { createJob } from "../actions/jobs";
import { fetchClients } from "../actions/clients";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { Employee } from "../actions/employees";
import type { State as ReduxState } from "../types/State";
import type { Dispatch } from "../types/Store";
import type { Client } from "../actions/clients";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  business: Business,
  push: (string) => void,
  employees: Array<Employee>,
  client: ?{ value: Client, label: string },
  isFetching: boolean,
  fetchClients?: (string, Object) => Promise<any>,
  createJob: (Business, Job, string) => Promise<any>,
  history: { push: (string) => void },
};

type State = {
  scheduleLayer: boolean,
};

class JobsAdd extends Component<Props & { intl: intlShape }, State> {
  static contextType = AuthContext;
  state = {
    scheduleLayer: false,
  };

  render() {
    const {
      employees,
      client,
      business,
      intl,
      isFetching,
      fetchClients,
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
            recurrences: "",
            begins: new Date(),
            anytime: true,
            client: client,
            invoice_reminder: {
              value: "closed",
              label: intl.formatMessage({
                id: oneoffInvoicingReminderMap["closed"],
              }),
            },
          }}
          fetchClients={fetchClients}
        />
      </Article>
    );
  }

  handleSubmit = (values) => {
    const {
      client: { value: client },
      property,
    } = values;
    const { business, intl, createJob, history } = this.props;

    const { getUser } = this.context;
    getUser()
      .then(({ access_token }) => {
        return createJob(
          business,
          {
            ...values,
            property:
              (property && property.value && property.value.id) ||
              (client.properties[0].id
                ? client.properties[0].id
                : client.properties[0]), // client may not be normalized
            assigned: values.assigned && values.assigned.map((v) => v.value),
            invoice_reminder: values.invoice_reminder.value,
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
    const { business, client, push } = this.props;
    if (client) {
      push(`/${business.id}/clients/${client.value.id}`);
    } else {
      push(`/${business.id}/jobs`);
    }
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number } },
    history: { push: (string) => void },
    fetchClients: (string, Object) => Promise<any>,
    createJob: (Business, Job, string) => Promise<any>,
  }
): * => {
  const { entities, jobs } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const searchParams: URLSearchParams = new URLSearchParams(
    document.location.search
  );

  let client;
  const clientId: number = parseInt(searchParams.get("client"), 10);
  if (clientId) {
    client = ensureState(entities).clients[clientId];
  }

  const business = ensureState(entities).businesses[businessId];

  return {
    business: business,
    push: ownProps.history.push,
    employees: business.employees.map((Id: number) => {
      return ensureState(entities).employees[Id];
    }),
    client: client
      ? {
          value: client,
          label: client.is_business
            ? client.business_name
            : `${client.first_name} ${client.last_name}`,
        }
      : undefined,
    isFetching: jobs.isFetching,
    fetchClients: ownProps.fetchClients,
    createJob: ownProps.createJob,
    history: ownProps.history,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      createJob,
      fetchClients,
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(JobsAdd))
);
