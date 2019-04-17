// @flow
import "url-search-params-polyfill";
import React, { Component } from "react";
import { connect } from "react-redux";
import Article from "grommet/components/Article";
import JobForm, { oneoffInvoicingReminderMap } from "./JobForm";
import { createJob } from "../actions/jobs";
import type { Business } from "../actions/businesses";
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
  client: ?{ value: Client, label: string }
};

type State = {
  scheduleLayer: boolean
};

class JobsAdd extends Component<Props, State> {
  state = {
    scheduleLayer: false
  };

  render() {
    const { token, employees, client } = this.props;

    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>
        <JobForm
          onSubmit={this.handleSubmit}
          onClose={this.onClose}
          employees={employees}
          initialValues={{
            recurrences: '',
            begins: new Date(),
            anytime: true,
            client: client,
            invoice_reminder: {
              value: "closed",
              label: oneoffInvoicingReminderMap["closed"]
            }
          }}
          token={token}
        />
      </Article>
    );
  }

  handleSubmit = values => {
    const { client: { value: client } } = values;
    const { token, business } = this.props;

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
      this.props.dispatch(action);
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
  const { auth, employees, entities } = state;
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
      : undefined
  };
};

export default connect(mapStateToProps)(JobsAdd);
