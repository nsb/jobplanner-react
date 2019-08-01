// @flow
import "url-search-params-polyfill";
import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl, intlShape } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import Article from "grommet/components/Article";
import JobForm, { oneoffInvoicingReminderMap } from "./JobForm";
import history from "../history";
import { createJob } from "../actions/jobs";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { Employee } from "../actions/employees";
import type { State as ReduxState } from "../types/State";
import type { Dispatch } from "../types/Store";
import type { Client } from "../actions/clients";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  token: ?string,
  business: Business,
  clients: Array<Client>,
  dispatch: Dispatch,
  push: string => void,
  employees: Array<Employee>,
  client: ?{ value: Client, label: string },
  isFetching: boolean
};

type State = {
  scheduleLayer: boolean
};

class JobsAdd extends Component<Props & { intl: intlShape }, State> {
  state = {
    scheduleLayer: false
  };

  render() {
    const { token, employees, client, business, intl, isFetching } = this.props;

    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>
        <JobForm
          business={business}
          onSubmit={this.handleSubmit}
          onClose={this.onClose}
          employees={employees}
          isFetching={isFetching}
          initialValues={{
            recurrences: '',
            begins: new Date(),
            anytime: true,
            client: client,
            invoice_reminder: {
              value: "closed",
              label: intl.formatMessage({id: oneoffInvoicingReminderMap["closed"]})
            }
          }}
          token={token}
        />
      </Article>
    );
  }

  handleSubmit = values => {
    const { client: { value: client } } = values;
    const { token, business, dispatch, intl } = this.props;

    if (token) {
      let action = createJob(
        business,
        {
          ...values,
          property: client.properties[0].id ? client.properties[0].id : client.properties[0], // client may not be normalized
          assigned: values.assigned && values.assigned.map(v => v.value),
          invoice_reminder: values.invoice_reminder.value
        },
        token
      );
      dispatch(action).then((responseJob: Job) => {
        addSuccess({text: intl.formatMessage({id: "flash.saved"})})
        history.push(`/${business.id}/jobs/${responseJob.id}`);
      }).catch(() => {
        addError({text: intl.formatMessage({id: "flash.error"})})
      });
    }
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
    history: { push: string => void }
  }
): * => {
  const { auth, employees, entities, jobs } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const searchParams: URLSearchParams = new URLSearchParams(
    document.location.search
  );

  let client;
  const clientId: number = parseInt(searchParams.get("client"), 10);
  if (clientId) {
    client = ensureState(entities).clients[clientId];
  }

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
    client: client
      ? { value: client, label: client.is_business ? client.business_name : `${client.first_name} ${client.last_name}` }
      : undefined,
    isFetching: jobs.isFetching
  };
};

export default connect(mapStateToProps)(injectIntl(JobsAdd));
