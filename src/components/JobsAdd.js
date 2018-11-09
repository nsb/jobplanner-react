// @flow
import "url-search-params-polyfill";
import React, { Component } from "react";
import { connect } from "react-redux";
import { RRule } from "rrule";
import Article from "grommet/components/Article";
import JobForm, { invoicingReminderMap } from "./JobForm";
import { createJob } from "../actions/jobs";
import type { Business } from "../actions/businesses";
import type { Employee } from "../actions/employees";
import type { State as ReduxState } from "../types/State";
import type { Dispatch } from "../types/Store";
import type { Schedule } from "../types/Schedule";
import type { Client } from "../actions/clients";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  token: ?string,
  business: Business,
  clients: Array<Client>,
  dispatch: Dispatch,
  push: string => void,
  employees: Array<Employee>,
  client: ?{ value: number, label: string }
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
    const schedule: Schedule = {
      freq: RRule.WEEKLY,
      interval: 1,
      byweekday: RRule.MO
    };
    const initialRecurrences = `RRULE:${new RRule({ ...schedule }).toString()}`;

    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>
        <JobForm
          onSubmit={this.handleSubmit}
          onClose={this.onClose}
          employees={employees}
          initialValues={{
            recurrences: initialRecurrences,
            begins: new Date(),
            anytime: true,
            client: client,
            invoice_reminder: {
              value: "monthly",
              label: invoicingReminderMap["monthly"]
            }
          }}
          token={token}
        />
      </Article>
    );
  }

  handleSubmit = values => {
    const { client: { value: clientId } } = values;
    const { token, business } = this.props;

    if(token) {
      let action = createJob(
        business,
        {
          ...values,
          client: clientId,
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
      push(`/${business.id}/clients/${client.value}`);
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
      ? { value: client.id, label: `${client.first_name} ${client.last_name}` }
      : undefined
  };
};

export default connect(mapStateToProps)(JobsAdd);
